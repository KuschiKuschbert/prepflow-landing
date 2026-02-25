import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { fetchDailyWeather, getVenueCoordinatesFromDb } from '@/lib/weather/open-meteo';
const RAINY_TIP = 'Rain expected – may need a backup plan.';

function isRainy(precip: number, weatherCode: number | null): boolean {
  const RAINY_CODES = new Set([
    51, 53, 55, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
  ]);
  return precip >= 2 || (weatherCode != null && RAINY_CODES.has(weatherCode));
}

/**
 * GET /api/weather/function-alerts
 * Returns weather alerts for upcoming functions in the next 7 days.
 */
export async function GET(req: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(req);

    const today = new Date().toISOString().split('T')[0];
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    const endDate = sevenDaysLater.toISOString().split('T')[0];

    const { data: functions, error } = await supabase
      .from('functions')
      .select('id, name, start_date')
      .eq('user_id', userId)
      .gte('start_date', today)
      .lte('start_date', endDate)
      .order('start_date', { ascending: true });

    if (error || !functions?.length) {
      return NextResponse.json({ alerts: [] });
    }

    const coords = await getVenueCoordinatesFromDb(supabase);
    const dateToRainy = new Map<string, boolean>();

    for (const func of functions) {
      const date = func.start_date?.split('T')[0] ?? func.start_date;
      if (!date || dateToRainy.has(date)) continue;

      try {
        const record = await fetchDailyWeather(coords.lat, coords.lon, date);
        const rainy = isRainy(Number(record.precipitation_mm) || 0, record.weather_code ?? null);
        dateToRainy.set(date, rainy);
      } catch (err) {
        logger.debug('[Function Alerts] Weather fetch failed for date', { date, error: err });
        dateToRainy.set(date, false);
      }
    }

    const alerts = functions
      .filter(f => {
        const d = f.start_date?.split('T')[0] ?? f.start_date;
        return d && dateToRainy.get(d);
      })
      .map(f => ({
        functionId: f.id,
        functionName: f.name || 'Event',
        startDate: f.start_date?.split('T')[0] ?? f.start_date,
        tip: RAINY_TIP,
      }));

    return NextResponse.json({ alerts }, { headers: { 'Cache-Control': 'private, max-age=900' } });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    logger.error('[Weather Function Alerts API] Unexpected error:', { error: err });
    return NextResponse.json({ alerts: [] }, { status: 200 });
  }
}
