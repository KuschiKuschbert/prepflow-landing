'use client';

import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useQuery } from '@tanstack/react-query';
import { ChartPoint } from '@/app/api/temperature-logs/analytics/helpers/downsampleChartPoints';

/**
 * Summary statistics for a single equipment piece over the requested period.
 */
export interface EquipmentAnalyticsSummary {
  avgTemp: number | null;
  minTemp: number | null;
  maxTemp: number | null;
  totalReadings: number;
  outOfRangeCount: number;
}

/**
 * Full analytics response for one equipment piece.
 */
export interface EquipmentAnalyticsData {
  equipmentId: string | null;
  location: string | null;
  period: string;
  dateFrom: string;
  dateTo: string;
  summary: EquipmentAnalyticsSummary;
  /** Max 200 downsampled chart points – safe to render regardless of data volume. */
  chartPoints: ChartPoint[];
}

/**
 * useTemperatureAnalyticsQuery
 *
 * Fetches server-aggregated temperature analytics for a single equipment piece.
 * Replaces the old pattern of fetching 1000 raw logs into memory and filtering
 * client-side.  The server returns at most 200 chart points regardless of
 * how many raw readings are stored.
 *
 * Falls back to graceful empty state when equipment has no data.
 */
export function useTemperatureAnalyticsQuery(
  equipmentId: string | null,
  location: string | null,
  period: '24h' | '7d' | '30d' | '90d' | '1y' | 'all',
) {
  const cacheKey = `temp_analytics_${equipmentId ?? location}_${period}`;

  return useQuery<EquipmentAnalyticsData, Error>({
    queryKey: ['temperature-analytics', { equipmentId, location, period }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (equipmentId) params.append('equipment_id', equipmentId);
      if (location) params.append('location', location);
      params.append('period', period);

      const url = `/api/temperature-logs/analytics?${params.toString()}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch temperature analytics');
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Analytics API error');

      const data = json.data as EquipmentAnalyticsData;
      cacheData(cacheKey, data);

      logger.dev('[useTemperatureAnalyticsQuery] Fetched analytics:', {
        equipmentId,
        location,
        period,
        chartPoints: data.chartPoints.length,
        totalReadings: data.summary.totalReadings,
      });

      return data;
    },
    // Short stale time: analytics data changes as new logs are added
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    enabled: !!(equipmentId || location),
    // Use cached data for instant display while revalidating
    initialData: (() => {
      const cached = getCachedData<EquipmentAnalyticsData>(cacheKey);
      return cached ?? undefined;
    })(),
    placeholderData: previousData => previousData,
  });
}
