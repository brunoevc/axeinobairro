import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

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

const DEFAULT_COORDS = { latitude: -22.8732, longitude: -42.3431 };
const DEFAULT_CITY = "Araruama/RJ";
const DEFAULT_NEIGHBORHOOD = "Centro";
const DEFAULT_LOCATION_NAME = `${DEFAULT_NEIGHBORHOOD} - ${DEFAULT_CITY}`;
const STORAGE_KEY = "axei_location_data";
const MIN_DISTANCE_CHANGE = 0.05; // 50 meters

type LocationContextType = LocationState & {
  retry: () => void;
  setManualLocation: (neighborhood: string, city: string) => void;
  getDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  formatDistance: (km: number) => string;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
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

  const watchId = useRef<number | null>(null);

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

  const updateStoredLocation = (newState: Partial<LocationState>) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...parsed,
        ...newState,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error("Error saving location", e);
    }
  };

  const handlePositionUpdate = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    
    setState(prev => {
      if (prev.manualNeighborhood) return { ...prev, loading: false };

      if (prev.coords) {
        const dist = getDistance(prev.coords.latitude, prev.coords.longitude, latitude, longitude);
        if (dist < MIN_DISTANCE_CHANGE && (prev.accuracy && accuracy >= prev.accuracy)) {
          return { ...prev, loading: false };
        }
      }

      const newState = {
        coords: { latitude, longitude },
        accuracy,
        loading: false,
        error: null,
        locationName: prev.manualNeighborhood 
          ? `${prev.manualNeighborhood} - ${prev.manualCity}` 
          : DEFAULT_LOCATION_NAME,
      };

      updateStoredLocation(newState);
      return { ...prev, ...newState };
    });
  }, [getDistance]);

  const startWatching = useCallback(() => {
    if (watchId.current !== null) return;
    if (!("geolocation" in navigator)) return;

    watchId.current = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      (error) => {
        console.error("GPS Watch error", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, [handlePositionUpdate]);

  const fetchLocation = useCallback((isRetry = false) => {
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

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handlePositionUpdate(position);
        if (!state.manualNeighborhood) startWatching();
      },
      (error) => {
        let errorMsg = "Erro ao buscar GPS";
        if (error.code === 1) errorMsg = "GPS desativado";
        
        setState((prev) => ({
          ...prev,
          loading: false,
          error: prev.manualNeighborhood ? null : errorMsg,
          coords: prev.coords || DEFAULT_COORDS,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: isRetry ? 0 : 60000 }
    );
  }, [state.manualNeighborhood, handlePositionUpdate, startWatching]);

  const setManualLocation = useCallback((neighborhood: string, city: string) => {
    const locationName = `${neighborhood} - ${city}`;
    
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    setState(prev => ({
      ...prev,
      manualNeighborhood: neighborhood,
      manualCity: city,
      locationName,
      loading: false,
      error: null
    }));

    updateStoredLocation({
      manualNeighborhood: neighborhood,
      manualCity: city,
      locationName,
      coords: null
    });
  }, []);

  const retry = useCallback(() => {
    setState(prev => ({
      ...prev,
      manualNeighborhood: null,
      manualCity: null,
      locationName: DEFAULT_LOCATION_NAME
    }));
    updateStoredLocation({
      manualNeighborhood: null,
      manualCity: null,
      locationName: DEFAULT_LOCATION_NAME
    });
    fetchLocation(true);
  }, [fetchLocation]);

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" as any }).then((status) => {
        setState((prev) => ({ ...prev, permissionStatus: status.state }));
        status.onchange = () => {
          setState((prev) => ({ ...prev, permissionStatus: (status as any).state }));
        };
      });
    }
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      fetchLocation();
    } else {
      const parsed = JSON.parse(saved);
      const isStale = Date.now() - (parsed.timestamp || 0) > 1000 * 60 * 30;
      if (isStale && !parsed.manualNeighborhood) {
        fetchLocation();
      } else {
        setState(prev => ({ ...prev, loading: false }));
        if (!parsed.manualNeighborhood) startWatching();
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const savedStr = localStorage.getItem(STORAGE_KEY);
        const parsed = savedStr ? JSON.parse(savedStr) : null;
        if (!parsed?.manualNeighborhood) {
           fetchLocation();
        }
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchLocation, startWatching]);

  const value: LocationContextType = {
    ...state,
    retry,
    setManualLocation,
    getDistance,
    formatDistance,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
