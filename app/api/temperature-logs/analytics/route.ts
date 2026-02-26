import { standardAdminChecks } from '@/lib/admin-auth/check-utils';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { buildDateRange } from './helpers/buildDateRange';
import { downsampleChartPoints } from './helpers/downsampleChartPoints';
import { fetchAnalyticsData } from './helpers/fetchAnalyticsData';

/**
 * GET /api/temperature-logs/analytics
 *
 * Returns server-side aggregated temperature data for a single equipment piece.
 * Designed to replace the "fetch all 1000 logs into memory" pattern for
 * the Analytics tab – returns max 200 chart points regardless of data volume.
 *
 * Query params:
 *   equipment_id  string   UUID of the equipment (preferred – uses FK index)
 *   location      string   Location/name string (fallback if no equipment_id)
 *   period        string   Preset: '24h' | '7d' | '30d' | '90d' | '1y' | 'all'
 *   date_from     string   ISO date YYYY-MM-DD (overrides period)
 *   date_to       string   ISO date YYYY-MM-DD (overrides period)
 *
 * Response:
 *   {
 *     success: true,
 *     data: {
 *       equipmentId: string | null,
 *       location: string | null,
 *       period: string,
 *       dateFrom: string,
 *       dateTo: string,
 *       summary: {
 *         avgTemp: number,
 *         minTemp: number,
 *         maxTemp: number,
 *         totalReadings: number,
 *         outOfRangeCount: number,
 *       },
 *       chartPoints: ChartPoint[],   // max 200 points
 *     }
 *   }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const equipmentId = searchParams.get('equipment_id');
  const location = searchParams.get('location');
  const period = searchParams.get('period') || '30d';
  const dateFromParam = searchParams.get('date_from');
  const dateToParam = searchParams.get('date_to');

  if (!equipmentId && !location) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Either equipment_id or location query parameter is required',
        'VALIDATION_ERROR',
        400,
      ),
      { status: 400 },
    );
  }

  try {
    const { supabase, error: authError } = await standardAdminChecks(request);
    if (authError) return authError;
    if (!supabase) throw new Error('Unexpected database state');

    const { dateFrom, dateTo } = buildDateRange(period, dateFromParam, dateToParam);

    const rows = await fetchAnalyticsData(supabase, {
      equipmentId,
      location,
      dateFrom,
      dateTo,
    });

    // Build summary stats from all rows (not downsampled)
    let totalReadings = 0;
    let outOfRangeCount = 0;
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    let avgSum = 0;

    for (const row of rows) {
      totalReadings += Number(row.reading_count);
      outOfRangeCount += Number(row.out_of_range_count);
      if (Number(row.min_temp) < minTemp) minTemp = Number(row.min_temp);
      if (Number(row.max_temp) > maxTemp) maxTemp = Number(row.max_temp);
      avgSum += Number(row.avg_temp) * Number(row.reading_count);
    }

    const avgTemp = totalReadings > 0 ? Math.round((avgSum / totalReadings) * 100) / 100 : null;

    // Downsample to max 200 chart points for fast rendering
    const chartPoints = downsampleChartPoints(rows, 200);

    return NextResponse.json({
      success: true,
      data: {
        equipmentId: equipmentId ?? null,
        location: location ?? null,
        period,
        dateFrom,
        dateTo,
        summary: {
          avgTemp: avgTemp ?? null,
          minTemp: isFinite(minTemp) ? minTemp : null,
          maxTemp: isFinite(maxTemp) ? maxTemp : null,
          totalReadings,
          outOfRangeCount,
        },
        chartPoints,
      },
    });
  } catch (err: unknown) {
    logger.error('[Temperature Analytics API] Error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/temperature-logs/analytics', method: 'GET' },
    });
    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status });
    }
    return NextResponse.json(
      { error: 'Failed to fetch temperature analytics', success: false },
      { status: 500 },
    );
  }
}
