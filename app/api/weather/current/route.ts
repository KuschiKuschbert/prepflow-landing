import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchCurrentWeather, getVenueCoordinatesFromDb } from '@/lib/weather/open-meteo';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/weather/current
 * Returns current weather for header widget. Metric units only (Celsius, mm).
 * Accepts optional ?lat= & ?lon= query params (browser geolocation); otherwise uses venue_settings or Brisbane fallback.
 */
export async function GET(request: NextRequest) {
  try {
    let coords: { lat: number; lon: number };

    const latParam = request.nextUrl.searchParams.get('lat');
    const lonParam = request.nextUrl.searchParams.get('lon');
    const lat = latParam != null ? parseFloat(latParam) : NaN;
    const lon = lonParam != null ? parseFloat(lonParam) : NaN;

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    ) {
      coords = { lat, lon };
    } else {
      coords = supabaseAdmin
        ? await getVenueCoordinatesFromDb(supabaseAdmin)
        : { lat: -27.6394, lon: 153.1094 };
    }

    const weather = await fetchCurrentWeather(coords.lat, coords.lon);

    return NextResponse.json(weather);
  } catch (err) {
    logger.error('[Weather Current API] Unexpected error:', { error: err });
    return NextResponse.json(
      {
        temp_celsius: null,
        precipitation_mm: 0,
        weather_code: null,
        weather_status: 'Unavailable',
        isFallback: true,
      },
      { status: 200 },
    );
  }
}
