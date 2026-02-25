import { evaluateGate } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { fetchDailyWeather, getVenueCoordinatesFromDb } from '@/lib/weather/open-meteo';

const RAINY_CODES = new Set([
  51, 53, 55, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
]);
const OVERCAST_CODES = new Set([3, 45, 48]);
const TEMP_TOLERANCE = 3;
const MIN_SIMILAR_DAYS = 3;

function isRainy(precip: number, code: number | null): boolean {
  return precip >= 2 || (code != null && RAINY_CODES.has(code));
}

function isOvercast(code: number | null): boolean {
  return code != null && OVERCAST_CODES.has(code);
}

function getWeatherBucket(tempMax: number | null, precip: number, code: number | null): string {
  if (tempMax == null) return 'unknown';
  const rainy = isRainy(precip, code);
  const overcast = isOvercast(code);
  if (rainy) return 'rain';
  if (tempMax >= 30) return 'hot';
  if (tempMax <= 12) return 'cold';
  if (tempMax >= 13 && tempMax <= 22 && overcast) return 'cool-overcast';
  return 'neutral';
}

function getTipForBucket(bucket: string, count: number): string | null {
  if (count < MIN_SIMILAR_DAYS) return null;
  switch (bucket) {
    case 'rain':
      return 'On rainy days like today, dine-in often drops – check which items still sell well.';
    case 'hot':
      return 'Hot days favour cold drinks and salads – see how your menu performed on similar days.';
    case 'cold':
      return 'Cold days often boost hot drinks and comfort food – worth checking your historical patterns.';
    case 'cool-overcast':
      return 'Cool, overcast days like today tend to favour comfort food – check your Hidden Gems.';
    default:
      return count >= 5
        ? `You've had ${count} similar days in the past 90 – worth reviewing performance patterns.`
        : null;
  }
}

/**
 * GET /api/weather/performance-insight
 * Returns a "days like today" insight for the Performance page.
 */
export async function GET(req: NextRequest) {
  try {
    const gate = evaluateGate('analytics', req);
    if (!gate.allowed) {
      return NextResponse.json({ insight: null });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ insight: null });
    }

    const today = new Date().toISOString().split('T')[0];
    const coords = await getVenueCoordinatesFromDb(supabaseAdmin);
    const todayRecord = await fetchDailyWeather(coords.lat, coords.lon, today);

    const tempMax = todayRecord.temp_celsius_max ?? todayRecord.temp_celsius_min ?? null;
    const precip = Number(todayRecord.precipitation_mm) || 0;
    const code = todayRecord.weather_code ?? null;
    const bucket = getWeatherBucket(tempMax, precip, code);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const startDate = ninetyDaysAgo.toISOString().split('T')[0];

    const { data: logs } = await supabaseAdmin
      .from('daily_weather_logs')
      .select('log_date, temp_celsius_max, temp_celsius_min, precipitation_mm, weather_code')
      .gte('log_date', startDate)
      .lt('log_date', today);

    let similarCount = 0;
    for (const log of logs || []) {
      const logTemp = log.temp_celsius_max ?? log.temp_celsius_min ?? null;
      const logPrecip = Number(log.precipitation_mm) || 0;
      const logCode = log.weather_code ?? null;
      if (tempMax != null && logTemp != null) {
        if (Math.abs(tempMax - logTemp) > TEMP_TOLERANCE) continue;
      }
      const logBucket = getWeatherBucket(logTemp, logPrecip, logCode);
      if (logBucket === bucket) similarCount++;
    }

    const tip = getTipForBucket(bucket, similarCount);

    return NextResponse.json(
      {
        insight: tip,
        similarDayCount: similarCount,
        weatherBucket: bucket,
      },
      { headers: { 'Cache-Control': 'private, max-age=900' } },
    );
  } catch (err) {
    logger.debug('[Weather Performance Insight] Error:', { error: err });
    return NextResponse.json({ insight: null });
  }
}
