import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/weather/daily-logs
 * Fetches stored daily weather for a date range. Query params: startDate, endDate (YYYY-MM-DD).
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabaseAdmin
      .from('daily_weather_logs')
      .select(
        'log_date, temp_celsius_max, temp_celsius_min, precipitation_mm, weather_code, weather_status',
      )
      .order('log_date', { ascending: true });

    if (startDate) {
      query = query.gte('log_date', startDate);
    }
    if (endDate) {
      query = query.lte('log_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      if (
        error.code === 'PGRST116' ||
        error.message.includes('relation "daily_weather_logs" does not exist')
      ) {
        return NextResponse.json({ success: true, data: [] });
      }
      logger.error('[Weather Daily Logs API] Database error:', { error });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    });
  } catch (err) {
    logger.error('[Weather Daily Logs API] Unexpected error:', { error: err });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch daily weather logs', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
