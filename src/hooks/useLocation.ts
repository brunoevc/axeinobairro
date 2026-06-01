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
};

const DEFAULT_COORDS = { latitude: -22.5444, longitude: -44.1722 }; // Barra Mansa Central
const DEFAULT_LOCATION_NAME = "Barra Mansa/RJ";

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    loading: true,
    error: null,
    permissionStatus: null,
    locationName: DEFAULT_LOCATION_NAME,
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
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  const fetchLocation = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    if (!("geolocation" in navigator)) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocalização não suportada",
        coords: DEFAULT_COORDS,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState((prev) => ({
          ...prev,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
          locationName: "Vila Nova - Barra Mansa/RJ", // In real app, reverse geocode
        }));
      },
      (error) => {
        let errorMsg = "Erro desconhecido";
        if (error.code === 1) errorMsg = "Permissão negada";
        else if (error.code === 2) errorMsg = "Posição indisponível";
        else if (error.code === 3) errorMsg = "Tempo esgotado";

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
          coords: DEFAULT_COORDS,
          locationName: "Localização aproximada",
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((status) => {
        setState((prev) => ({ ...prev, permissionStatus: status.state }));
        status.onchange = () => {
          setState((prev) => ({ ...prev, permissionStatus: status.state }));
        };
      });
    }
    fetchLocation();
  }, [fetchLocation]);

  return {
    ...state,
    retry: fetchLocation,
    getDistance,
    formatDistance,
  };
}
