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
  manualNeighborhood: string | null;
  manualCity: string | null;
};

// Araruama Central
const DEFAULT_COORDS = { latitude: -22.8732, longitude: -42.3431 };
const DEFAULT_CITY = "Araruama/RJ";
const DEFAULT_NEIGHBORHOOD = "Centro";
const DEFAULT_LOCATION_NAME = `${DEFAULT_NEIGHBORHOOD} - ${DEFAULT_CITY}`;

const STORAGE_KEY = "axei_location_data";

export function useLocation() {
  const [state, setState] = useState<LocationState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          coords: parsed.coords || null,
          loading: false,
          error: null,
          permissionStatus: null,
          locationName: parsed.locationName || DEFAULT_LOCATION_NAME,
          accuracy: parsed.accuracy || null,
          manualNeighborhood: parsed.manualNeighborhood || null,
          manualCity: parsed.manualCity || null,
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
      manualNeighborhood: null,
      manualCity: null,
    };
  });

  const getDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
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
  }, []);

  const formatDistance = useCallback((km: number) => {
    if (km < 1) {
      const meters = Math.round(km * 1000);
      return meters < 100 ? "Bem próximo" : `${meters}m`;
    }
    return `${km.toFixed(1)}km`;
  }, []);

  const setManualLocation = useCallback((neighborhood: string, city: string) => {
    const locationName = `${neighborhood} - ${city}`;
    setState(prev => ({
      ...prev,
      manualNeighborhood: neighborhood,
      manualCity: city,
      locationName,
      loading: false
    }));

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...parsed,
        manualNeighborhood: neighborhood,
        manualCity: city,
        locationName,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error("Error saving manual location", e);
    }
  }, []);

  const fetchLocation = useCallback((isRetry = false) => {
    // If we have manual location and it's not a retry, skip auto-fetching GPS
    if (state.manualNeighborhood && !isRetry) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

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
      timeout: 10000,
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
          locationName: state.manualNeighborhood 
            ? `${state.manualNeighborhood} - ${state.manualCity}` 
            : DEFAULT_LOCATION_NAME,
          accuracy: position.coords.accuracy,
        };

        setState((prev) => ({ ...prev, ...newState }));
        
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          const parsed = saved ? JSON.parse(saved) : {};
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            ...parsed,
            coords: newState.coords,
            accuracy: newState.accuracy,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.error("Error saving location", e);
        }
      },
      (error) => {
        let errorMsg = "Erro ao buscar GPS";
        if (error.code === 1) errorMsg = "GPS desativado";
        
        setState((prev) => ({
          ...prev,
          loading: false,
          error: state.manualNeighborhood ? null : errorMsg,
          coords: prev.coords || DEFAULT_COORDS,
        }));
      },
      options
    );
  }, [state.manualNeighborhood, state.manualCity]);

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" as any }).then((status) => {
        setState((prev) => ({ ...prev, permissionStatus: status.state }));
        status.onchange = () => {
          setState((prev) => ({ ...prev, permissionStatus: status.state }));
        };
      });
    }
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      fetchLocation();
    } else {
      const parsed = JSON.parse(saved);
      const isStale = Date.now() - parsed.timestamp > 1000 * 60 * 30;
      if (isStale && !parsed.manualNeighborhood) fetchLocation();
      else setState(prev => ({ ...prev, loading: false }));
    }
  }, [fetchLocation]);

  return {
    ...state,
    retry: () => fetchLocation(true),
    setManualLocation,
    getDistance,
    formatDistance,
  };
}
