import { logger } from '@/lib/logger';
import {
  type GeofenceConfig,
  calculateDistanceMeters,
  getGeolocationErrorMessage,
  isValidWithinGeofence,
} from '../../utils/geofence-utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useGeofence(propVenueLocation?: GeofenceConfig) {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isValidLocation, setIsValidLocation] = useState<boolean | null>(null);
  const [venueConfig, setVenueConfig] = useState<GeofenceConfig | null>(null);

  const defaultVenueLocation = useMemo(
    () => ({
      latitude: -27.6394,
      longitude: 153.1094,
      radiusMeters: 100,
    }),
    [],
  );

  const activeConfig = useMemo(
    () => propVenueLocation || venueConfig || defaultVenueLocation,
    [propVenueLocation, venueConfig, defaultVenueLocation],
  );

  useEffect(() => {
    if (propVenueLocation) return;
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings/venue');
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
            setVenueConfig({
              latitude: data.latitude,
              longitude: data.longitude,
              radiusMeters: data.geofence_radius_meters || data.radiusMeters || 100,
            });
          }
        }
      } catch (error) {
        logger.error('Failed to fetch venue settings:', error);
      }
    };
    fetchSettings();
  }, [propVenueLocation]);

  const calculateDistance = useCallback(
    (position: GeolocationPosition) => {
      const distanceMeters = calculateDistanceMeters(position, activeConfig);
      setDistance(distanceMeters);
      setIsValidLocation(isValidWithinGeofence(distanceMeters, activeConfig));
    },
    [activeConfig],
  );

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        calculateDistance(position);
      },
      error => {
        setLocationError(getGeolocationErrorMessage(error.code));
        logger.warn('Geolocation unavailable', {
          code:
            error.code === 1
              ? 'PERMISSION_DENIED'
              : error.code === 2
                ? 'POSITION_UNAVAILABLE'
                : 'TIMEOUT',
          message: error.message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [calculateDistance]);

  return {
    location,
    locationError,
    distance,
    isValidLocation,
    venueRadius: activeConfig.radiusMeters,
  };
}
