/**
 * Geofence validation and distance calculation utilities.
 */

export interface GeofenceConfig {
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

/**
 * Haversine formula: distance in meters between two lat/lon points.
 */
export function calculateDistanceMeters(
  position: GeolocationPosition,
  config: GeofenceConfig,
): number {
  const lat1 = position.coords.latitude;
  const lon1 = position.coords.longitude;
  const lat2 = config.latitude;
  const lon2 = config.longitude;

  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function isValidWithinGeofence(distanceMeters: number, config: GeofenceConfig): boolean {
  return distanceMeters <= config.radiusMeters;
}

export function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return 'Location permission denied. Please enable location access.';
    case 2:
      return 'Location information unavailable.';
    case 3:
      return 'Location request timed out.';
    default:
      return 'Unable to get your location';
  }
}
