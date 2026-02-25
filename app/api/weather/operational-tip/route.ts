import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchDailyWeather, getVenueCoordinatesFromDb } from '@/lib/weather/open-meteo';
import { getOperationalTip } from '@/lib/weather/operational-tip';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/weather/operational-tip
 * Returns an actionable weather tip for today, or null when no specific recommendation.
 */
export async function GET() {
  try {
    const coords = supabaseAdmin
      ? await getVenueCoordinatesFromDb(supabaseAdmin)
      : { lat: -27.6394, lon: 153.1094 };

    const today = new Date().toISOString().split('T')[0];
    const record = await fetchDailyWeather(coords.lat, coords.lon, today);

    const result = getOperationalTip(record);

    if (!result) {
      return NextResponse.json({ tip: null });
    }

    return NextResponse.json(
      { tip: result.tip, tipType: result.tipType, weather_status: result.weather_status },
      { headers: { 'Cache-Control': 'private, max-age=900' } },
    );
  } catch (err) {
    logger.error('[Weather Operational Tip API] Unexpected error:', { error: err });
    return NextResponse.json({ tip: null }, { status: 200 });
  }
}
