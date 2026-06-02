import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";

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
const STALE_TIME = 1000 * 60 * 30; // 30 minutes

type LocationContextType = LocationState & {
  retry: () => void;
  setManualLocation: (neighborhood: string, city: string) => void;
  getDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  formatDistance: (km: number) => string;
  refreshLocation: () => void;
};

const INITIAL_STATE: LocationState = {
  coords: null,
  loading: false,
  error: null,
  permissionStatus: null,
  locationName: DEFAULT_LOCATION_NAME,
  accuracy: null,
  manualNeighborhood: null,
  manualCity: null,
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const isClient = typeof window !== "undefined";

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LocationState>(() => {
    if (!isClient) return INITIAL_STATE;
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          coords: parsed.coords || null,
          locationName: parsed.locationName || DEFAULT_LOCATION_NAME,
          accuracy: parsed.accuracy || null,
          manualNeighborhood: parsed.manualNeighborhood || null,
          manualCity: parsed.manualCity || null,
        };
      }
    } catch (e) {
      console.error("Error loading location from storage", e);
    }
    return INITIAL_STATE;
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

  const updateStoredLocation = useCallback((newState: Partial<LocationState>) => {
    if (!isClient) return;
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
  }, []);

  const handlePositionUpdate = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    
    setState(prev => {
      // If we have manual location, we don't automatically override it unless requested
      if (prev.manualNeighborhood) return { ...prev, loading: false };

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
  }, [updateStoredLocation]);

  const fetchLocation = useCallback((isRetry = false) => {
    if (!isClient || !navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Geolocalização não suportada",
        coords: prev.coords || DEFAULT_COORDS 
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handlePositionUpdate(position);
      },
      (error) => {
        let errorMsg = "Erro ao buscar GPS";
        if (error.code === 1) errorMsg = "GPS desativado ou negado";
        
        setState((prev) => ({
          ...prev,
          loading: false,
          error: prev.manualNeighborhood ? null : errorMsg,
          coords: prev.coords || DEFAULT_COORDS,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: isRetry ? 0 : 60000 }
    );
  }, [handlePositionUpdate]);

  const setManualLocation = useCallback((neighborhood: string, city: string) => {
    const locationName = `${neighborhood} - ${city}`;
    
    setState(prev => {
      const newState = {
        ...prev,
        manualNeighborhood: neighborhood,
        manualCity: city,
        locationName,
        loading: false,
        error: null,
        coords: null // Manual location clears GPS coords to favor proximity to the neighborhood
      };
      updateStoredLocation({
        manualNeighborhood: neighborhood,
        manualCity: city,
        locationName,
        coords: null
      });
      return newState;
    });
  }, [updateStoredLocation]);

  const retry = useCallback(() => {
    setState(prev => ({
      ...prev,
      manualNeighborhood: null,
      manualCity: null,
      locationName: DEFAULT_LOCATION_NAME,
      loading: true
    }));
    updateStoredLocation({
      manualNeighborhood: null,
      manualCity: null,
      locationName: DEFAULT_LOCATION_NAME,
      coords: null
    });
    fetchLocation(true);
  }, [fetchLocation, updateStoredLocation]);

  useEffect(() => {
    if (!isClient) return;

    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" as any }).then((status) => {
        setState((prev) => ({ ...prev, permissionStatus: status.state }));
        status.onchange = () => {
          setState((prev) => ({ ...prev, permissionStatus: status.state }));
        };
      }).catch(err => console.debug("Permissions API not supported", err));
    }
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // First time, try to get location
      fetchLocation();
    } else {
      try {
        const parsed = JSON.parse(saved);
        const isStale = Date.now() - (parsed.timestamp || 0) > STALE_TIME;
        if (isStale && !parsed.manualNeighborhood) {
          fetchLocation();
        }
      } catch (e) {
        fetchLocation();
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const savedStr = localStorage.getItem(STORAGE_KEY);
        try {
          const parsed = savedStr ? JSON.parse(savedStr) : null;
          const isStale = Date.now() - (parsed?.timestamp || 0) > STALE_TIME;
          if (isStale && !parsed?.manualNeighborhood) {
             fetchLocation();
          }
        } catch (e) {}
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchLocation]);

  const contextValue = useMemo(() => ({
    ...state,
    retry,
    setManualLocation,
    getDistance,
    formatDistance,
    refreshLocation: () => fetchLocation(true)
  }), [state, retry, setManualLocation, getDistance, formatDistance, fetchLocation]);

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    // Return a safe fallback instead of throwing to prevent white screens
    return {
      ...INITIAL_STATE,
      retry: () => {},
      setManualLocation: () => {},
      getDistance: () => 0,
      formatDistance: () => "",
      refreshLocation: () => {},
    };
  }
  return context;
}

