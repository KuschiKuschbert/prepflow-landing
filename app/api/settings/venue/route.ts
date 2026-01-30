import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/settings/venue
 * Fetch venue location and settings
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const { data: venue, error: dbError } = await supabase
      .from('venue_settings')
      .select('*')
      .limit(1)
      .single();

    if (dbError) {
      // If table doesn't exist or empty, return default (fallback)
      if (
        dbError.code === 'PGRST116' ||
        dbError.message.includes('relation "venue_settings" does not exist')
      ) {
        logger.warn('[Venue Settings API] Venue settings not found, using defaults.');
        return NextResponse.json({
          latitude: -27.6394,
          longitude: 153.1094,
          geofence_radius_meters: 100,
        });
      }

      logger.error('[Venue Settings API] Database error:', dbError);
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(dbError, 500), { status: 500 });
    }

    return NextResponse.json(venue);
  } catch (err) {
    logger.error('[Venue Settings API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
