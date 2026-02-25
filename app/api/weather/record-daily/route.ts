import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchDailyWeather, getVenueCoordinatesFromDb } from '@/lib/weather/open-meteo';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/weather/record-daily
 * Records today's weather into daily_weather_logs. Idempotent (upsert by date).
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const coords = await getVenueCoordinatesFromDb(supabaseAdmin);
    const today = new Date().toISOString().split('T')[0];
    const record = await fetchDailyWeather(coords.lat, coords.lon, today);

    const { error } = await supabaseAdmin.from('daily_weather_logs').upsert(
      {
        log_date: record.log_date,
        latitude: coords.lat,
        longitude: coords.lon,
        temp_celsius_max: record.temp_celsius_max,
        temp_celsius_min: record.temp_celsius_min,
        precipitation_mm: record.precipitation_mm,
        weather_code: record.weather_code,
        weather_status: record.weather_status,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'log_date',
      },
    );

    if (error) {
      logger.error('[Weather Record Daily API] Database error:', { error });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Daily weather recorded',
      data: record,
    });
  } catch (err) {
    logger.error('[Weather Record Daily API] Unexpected error:', { error: err });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to record daily weather', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
