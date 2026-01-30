import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';
import { calculateDistance } from './calculateDistance';

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

// Default fallback (Brisbane, QLD)
const DEFAULT_VENUE = {
  latitude: -27.6394,
  longitude: 153.1094,
  geofence_radius_meters: 100,
};

/**
 * Validate geofence for clock-in location
 */
export async function validateGeofence(
  supabase: SupabaseClient,
  latitude: number,
  longitude: number,
): Promise<{ isValid: boolean; distance: number; error?: NextResponse }> {
  // Fetch venue settings
  let targetVenue = DEFAULT_VENUE;

  const { data: venue, error: dbError } = await supabase
    .from('venue_settings')
    .select('latitude, longitude, geofence_radius_meters')
    .limit(1)
    .single();

  if (venue) {
    targetVenue = venue;
  } else if (dbError && dbError.code !== 'PGRST116') {
    logger.error('Error fetching venue settings:', dbError);
    // Proceed with default, or fail safe? Let's fail safe if DB error implies connection issue,
    // but here we'll log and use default to avoid blocking clock-ins on config error.
  }

  const distance = calculateDistance(
    latitude,
    longitude,
    targetVenue.latitude,
    targetVenue.longitude,
  );
  const isGeofenceValid = distance <= targetVenue.geofence_radius_meters;

  if (!isGeofenceValid) {
    return {
      isValid: false,
      distance,
      error: NextResponse.json(
        ApiErrorHandler.createError(
          `Clock-in location is ${Math.round(distance)}m away from venue (maximum: ${targetVenue.geofence_radius_meters}m)`,
          'GEOFENCE_ERROR',
          400,
        ),
        { status: 400 },
      ),
    };
  }

  return { isValid: true, distance };
}
