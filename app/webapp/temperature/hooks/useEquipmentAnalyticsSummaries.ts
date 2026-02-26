'use client';

import { logger } from '@/lib/logger';
import { useQueries } from '@tanstack/react-query';
import { EquipmentAnalyticsData } from './useTemperatureAnalyticsQuery';
import { TemperatureEquipment } from '../types';

/**
 * Fetch server-aggregated analytics summaries for ALL equipment in parallel.
 *
 * This replaces the old pattern of:
 *   1. Fetching 1,000 raw logs into `allLogs`
 *   2. Filtering client-side per equipment per time filter
 *
 * Instead, the server aggregates per equipment per period so the browser
 * never holds large raw log arrays in memory.
 */
export function useEquipmentAnalyticsSummaries(
  equipment: TemperatureEquipment[],
  period: '24h' | '7d' | '30d' | '90d' | '1y' | 'all',
) {
  // useQueries fires one query per equipment piece in parallel
  const results = useQueries({
    queries: equipment.map(eq => ({
      queryKey: ['temperature-analytics', { equipmentId: eq.id, period }],
      queryFn: async (): Promise<EquipmentAnalyticsData> => {
        const params = new URLSearchParams({
          equipment_id: eq.id,
          period,
        });
        const res = await fetch(`/api/temperature-logs/analytics?${params.toString()}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`Failed to fetch analytics for ${eq.name}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Analytics API error');

        logger.dev('[useEquipmentAnalyticsSummaries] Fetched:', {
          equipment: eq.name,
          period,
          totalReadings: json.data.summary.totalReadings,
          chartPoints: json.data.chartPoints.length,
        });

        return json.data as EquipmentAnalyticsData;
      },
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      enabled: equipment.length > 0,
    })),
  });

  // Build a map: equipmentId -> EquipmentAnalyticsData | undefined
  const summaryMap = new Map<string, EquipmentAnalyticsData>();
  for (let i = 0; i < equipment.length; i++) {
    const result = results[i];
    if (result.data) {
      summaryMap.set(equipment[i].id, result.data);
    }
  }

  const isLoading = results.some(r => r.isLoading);
  const isError = results.some(r => r.isError);

  return { summaryMap, isLoading, isError };
}
