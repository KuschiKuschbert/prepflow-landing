import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';
import { calculateDistance } from './calculateDistance';

// Venue location (should be configurable, hardcoded for now)
const VENUE_LOCATION = {
  latitude: -27.6394, // Example: Brisbane, QLD
  longitude: 153.1094,
  radiusMeters: 100, // 100 meter geofence radius
};

/**
 * Validate geofence for clock-in location
 */
export function validateGeofence(
  latitude: number,
  longitude: number,
): { isValid: boolean; distance: number; error?: NextResponse } {
  const distance = calculateDistance(
    latitude,
    longitude,
    VENUE_LOCATION.latitude,
    VENUE_LOCATION.longitude,
  );
  const isGeofenceValid = distance <= VENUE_LOCATION.radiusMeters;

  if (!isGeofenceValid) {
    return {
      isValid: false,
      distance,
      error: NextResponse.json(
        ApiErrorHandler.createError(
          `Clock-in location is ${Math.round(distance)}m away from venue (maximum: ${VENUE_LOCATION.radiusMeters}m)`,
          'GEOFENCE_ERROR',
          400,
        ),
        { status: 400 },
      ),
    };
  }

  return { isValid: true, distance };
}
