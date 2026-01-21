import { logger } from '@/lib/logger';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface GeofenceConfig {
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export function useGeofence(venueLocation?: GeofenceConfig) {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isValidLocation, setIsValidLocation] = useState<boolean | null>(null);

  // Default venue location (should be configured per venue in reality)
  const defaultVenueLocation = useMemo(
    () =>
      venueLocation || {
        latitude: -27.6394, // Brisbane, QLD (example)
        longitude: 153.1094,
        radiusMeters: 100,
      },
    [venueLocation],
  );

  /**
   * Calculates distance between current location and venue.
   */
  const calculateDistance = useCallback(
    (position: GeolocationPosition) => {
      const lat1 = position.coords.latitude;
      const lon1 = position.coords.longitude;
      const lat2 = defaultVenueLocation.latitude;
      const lon2 = defaultVenueLocation.longitude;

      const R = 6371e3; // Earth radius in meters
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distanceMeters = R * c;
      setDistance(distanceMeters);
      setIsValidLocation(distanceMeters <= defaultVenueLocation.radiusMeters);
    },
    [defaultVenueLocation],
  );

  // Get current location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation(position);
          calculateDistance(position);
        },
        error => {
          let errorMessage = 'Unable to get your location';
          let errorCode = 'UNKNOWN';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              errorCode = 'PERMISSION_DENIED';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              errorCode = 'POSITION_UNAVAILABLE';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              errorCode = 'TIMEOUT';
              break;
          }
          setLocationError(errorMessage);
          // Log as warning since this is a user permission/configuration issue, not a system error
          logger.warn('Geolocation unavailable', {
            code: errorCode,
            message: error.message || errorMessage,
            errorCode: error.code,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, [calculateDistance]);

  return {
    location,
    locationError,
    distance,
    isValidLocation,
    venueRadius: defaultVenueLocation.radiusMeters,
  };
}
