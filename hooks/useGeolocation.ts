'use client';

import { cacheData, clearCache, getCachedData } from '@/lib/cache/data-cache';
import { useCallback, useEffect, useState } from 'react';

const COORDS_CACHE_KEY = 'weather_geolocation';
const COORDS_CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export interface GeolocationCoords {
  lat: number;
  lon: number;
}

type GeolocationStatus = 'idle' | 'loading' | 'resolved' | 'denied' | 'unavailable';

export interface UseGeolocationResult {
  coords: GeolocationCoords | null;
  status: GeolocationStatus;
  refetch: () => void;
}

/**
 * Uses browser Geolocation API to get user's coordinates.
 * Caches result in sessionStorage (1 hour) to avoid repeated permission prompts.
 *
 * @returns Coords when available, null when denied/unavailable, and status/refetch helpers.
 */
export function useGeolocation(): UseGeolocationResult {
  const [coords, setCoords] = useState<GeolocationCoords | null>(() => {
    if (typeof window === 'undefined') return null;
    return getCachedData<GeolocationCoords>(COORDS_CACHE_KEY);
  });
  const [status, setStatus] = useState<GeolocationStatus>(() => {
    if (typeof window === 'undefined') return 'idle';
    return getCachedData<GeolocationCoords>(COORDS_CACHE_KEY) ? 'resolved' : 'idle';
  });

  const resolve = useCallback(() => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      setStatus('unavailable');
      return;
    }

    const cached = getCachedData<GeolocationCoords>(COORDS_CACHE_KEY);
    if (cached) {
      setCoords(cached);
      setStatus('resolved');
      return;
    }

    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const result = { lat: latitude, lon: longitude };
        setCoords(result);
        setStatus('resolved');
        cacheData(COORDS_CACHE_KEY, result, COORDS_CACHE_EXPIRY_MS);
      },
      () => {
        setCoords(null);
        setStatus('denied');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  useEffect(() => {
    resolve();
  }, [resolve]);

  const refetch = useCallback(() => {
    if (typeof window === 'undefined') return;
    clearCache(COORDS_CACHE_KEY);
    setCoords(null);
    setStatus('idle');
    resolve();
  }, [resolve]);

  return { coords, status, refetch };
}
