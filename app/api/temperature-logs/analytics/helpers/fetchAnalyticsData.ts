import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { DailyAggRow } from './downsampleChartPoints';

/**
 * Fetch daily aggregated temperature data for a single equipment piece
 * using either the equipment UUID (faster, uses FK index) or location string.
 *
 * Falls back to a direct Supabase query if the RPC is not yet deployed.
 */
export async function fetchAnalyticsData(
  supabase: SupabaseClient,
  opts: {
    equipmentId?: string | null;
    location?: string | null;
    dateFrom: string;
    dateTo: string;
  },
): Promise<DailyAggRow[]> {
  const { equipmentId, location, dateFrom, dateTo } = opts;

  // Prefer equipment_id FK lookup (uses idx_temperature_logs_equipment_date)
  if (equipmentId) {
    const { data, error } = await supabase.rpc('get_temperature_analytics_equipment', {
      p_equipment_id: equipmentId,
      p_date_from: dateFrom,
      p_date_to: dateTo,
    });

    if (!error && data) {
      return data as DailyAggRow[];
    }

    // RPC not yet deployed – fall back to direct aggregation query
    logger.warn(
      '[Temperature Analytics] RPC get_temperature_analytics_equipment unavailable, using fallback query',
      {
        error: error?.message,
        equipmentId,
      },
    );
    return fallbackAggregation(supabase, { equipmentId, dateFrom, dateTo });
  }

  // Location-based lookup
  if (location) {
    const { data, error } = await supabase.rpc('get_temperature_analytics', {
      p_location: location,
      p_date_from: dateFrom,
      p_date_to: dateTo,
    });

    if (!error && data) {
      return data as DailyAggRow[];
    }

    logger.warn(
      '[Temperature Analytics] RPC get_temperature_analytics unavailable, using fallback query',
      {
        error: error?.message,
        location,
      },
    );
    return fallbackAggregation(supabase, { location, dateFrom, dateTo });
  }

  throw ApiErrorHandler.createError(
    'Either equipment_id or location is required',
    'VALIDATION_ERROR',
    400,
  );
}

/**
 * Fallback: direct Supabase query when RPC is not yet available.
 * Fetches raw rows and aggregates in JS.  This is only used during the
 * transition period before the migration has been applied.
 */
async function fallbackAggregation(
  supabase: SupabaseClient,
  opts: {
    equipmentId?: string | null;
    location?: string | null;
    dateFrom: string;
    dateTo: string;
  },
): Promise<DailyAggRow[]> {
  let query = supabase
    .from('temperature_logs')
    .select('log_date, temperature_celsius')
    .gte('log_date', opts.dateFrom)
    .lte('log_date', opts.dateTo)
    .order('log_date', { ascending: true });

  if (opts.equipmentId) {
    query = query.eq('equipment_id', opts.equipmentId);
  } else if (opts.location) {
    query = query.eq('location', opts.location);
  }

  const { data, error } = await query;

  if (error) {
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  // Aggregate by log_date in JS
  const byDate = new Map<string, number[]>();
  for (const row of data ?? []) {
    const arr = byDate.get(row.log_date) ?? [];
    arr.push(Number(row.temperature_celsius));
    byDate.set(row.log_date, arr);
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([log_date, temps]) => ({
      log_date,
      avg_temp: Math.round((temps.reduce((s, t) => s + t, 0) / temps.length) * 100) / 100,
      min_temp: Math.min(...temps),
      max_temp: Math.max(...temps),
      reading_count: temps.length,
      out_of_range_count: 0, // thresholds not available in fallback
    }));
}
