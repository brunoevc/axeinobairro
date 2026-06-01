import { useState, useEffect, useCallback } from "react";

export type Coords = {
  latitude: number;
  longitude: number;
};

export type LocationState = {
  coords: Coords | null;
  loading: boolean;
  error: string | null;
  permissionStatus: PermissionState | null;
  locationName: string;
  accuracy: number | null;
};

const DEFAULT_COORDS = { latitude: -22.5444, longitude: -44.1722 }; // Barra Mansa Central
const DEFAULT_LOCATION_NAME = "Barra Mansa/RJ";
const STORAGE_KEY = "axei_location_data";

export function useLocation() {
  const [state, setState] = useState<LocationState>(() => {
    // Try to load from localStorage on init
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          coords: parsed.coords,
          loading: false,
          error: null,
          permissionStatus: null,
          locationName: parsed.locationName || DEFAULT_LOCATION_NAME,
          accuracy: parsed.accuracy || null,
        };
      }
    } catch (e) {
      console.error("Error loading location from storage", e);
    }

    return {
      coords: null,
      loading: true,
      error: null,
      permissionStatus: null,
      locationName: DEFAULT_LOCATION_NAME,
      accuracy: null,
    };
  });

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (km: number) => {
    if (km < 1) {
      const meters = Math.round(km * 1000);
      return meters < 100 ? "Bem próximo" : `${meters}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  const fetchLocation = useCallback((isRetry = false) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    if (!("geolocation" in navigator)) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocalização não suportada",
        coords: prev.coords || DEFAULT_COORDS,
      }));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: isRetry ? 0 : 60000,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newState = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
          locationName: "Vila Nova - Barra Mansa/RJ", // In a real app, reverse geocode here
          accuracy: position.coords.accuracy,
        };

        setState((prev) => ({ ...prev, ...newState }));
        
        // Save to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            coords: newState.coords,
            locationName: newState.locationName,
            accuracy: newState.accuracy,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.error("Error saving location", e);
        }
      },
      (error) => {
        let errorMsg = "Erro desconhecido";
        if (error.code === 1) errorMsg = "Permissão negada. Ative o GPS para ver lojas próximas.";
        else if (error.code === 2) errorMsg = "Posição indisponível";
        else if (error.code === 3) errorMsg = "Tempo esgotado ao buscar localização";

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
          coords: prev.coords || DEFAULT_COORDS,
          locationName: prev.coords ? prev.locationName : "Localização aproximada",
        }));
      },
      options
    );
  }, []);

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" as any }).then((status) => {
        setState((prev) => ({ ...prev, permissionStatus: status.state }));
        status.onchange = () => {
          setState((prev) => ({ ...prev, permissionStatus: status.state }));
        };
      });
    }
    
    // Only auto-fetch if we don't have stored coords or if they are stale
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      fetchLocation();
    } else {
      const parsed = JSON.parse(saved);
      const isStale = Date.now() - parsed.timestamp > 1000 * 60 * 30; // 30 mins
      if (isStale) fetchLocation();
    }
  }, [fetchLocation]);

  return {
    ...state,
    retry: () => fetchLocation(true),
    getDistance,
    formatDistance,
  };
}
