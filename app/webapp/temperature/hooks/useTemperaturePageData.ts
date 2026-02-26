import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchApis } from '@/lib/cache/data-cache';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { useTemperatureLogsQuery } from './useTemperatureLogsQuery';
import type { TemperatureLogsResponse } from './useTemperatureLogsQuery';
import { logger } from '@/lib/logger';
import { fetchEquipmentHelper } from './useTemperaturePageData/helpers/fetchEquipment';
import { updateLogsFromQueryHelper } from './useTemperaturePageData/helpers/updateLogsFromQuery';
import { createInitialState } from './useTemperaturePageData/helpers/initialState';

/**
 * useTemperaturePageData
 *
 * Central data hook for the Temperature page.
 *
 * The previous version fetched up to 1,000 raw logs into `allLogs` for
 * client-side filtering on the Analytics and Equipment tabs.  That pattern
 * breaks at scale (5+ years / 100k+ logs).
 *
 * The new approach:
 *  - Logs tab: paginated server query (unchanged, already fast)
 *  - Analytics tab: uses useEquipmentAnalyticsSummaries to fetch aggregated
 *    data per equipment from /api/temperature-logs/analytics
 *  - Equipment drawer: useEquipmentLogs sends date-range params to the server
 *
 * `allLogs` is intentionally removed.  `fetchAllLogs` remains as a no-op
 * stub for backward compatibility with any callers that have not yet been
 * updated, then can be cleaned up in a follow-up.
 */
export function useTemperaturePageData(_activeTab: 'logs' | 'equipment' | 'analytics') {
  const queryClient = useQueryClient();
  const initialState = createInitialState();
  const [logs, setLogs] = useState<TemperatureLog[]>(initialState.logs);
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>(initialState.equipment);
  const [loading, setLoading] = useState(initialState.loading);
  const [selectedDate, setSelectedDate] = useState(initialState.selectedDate);
  const [selectedType, setSelectedType] = useState(initialState.selectedType);
  const [page, setPage] = useState(initialState.page);
  const pageSize = initialState.pageSize;

  const { data: logsData, isLoading: logsLoading } = useTemperatureLogsQuery(
    selectedDate,
    selectedType,
    page,
    pageSize,
  );

  const fetchEquipment = useCallback(async () => {
    await fetchEquipmentHelper(setEquipment);
  }, []);

  useEffect(() => {
    updateLogsFromQueryHelper(logsData, setLogs);
  }, [logsData]);

  useEffect(() => {
    prefetchApis(['/api/temperature-equipment']);
    setLoading(true);
    fetchEquipment()
      .catch(error => logger.error('Error loading temperature data:', error))
      .finally(() => setLoading(false));
  }, [fetchEquipment]);

  const typedLogsData = logsData as TemperatureLogsResponse | undefined;

  /**
   * @deprecated fetchAllLogs is a no-op – analytics data is now fetched
   * server-side per equipment by TemperatureAnalyticsTab.
   * Kept for backward compatibility; remove callers in a follow-up.
   */
  const fetchAllLogs = useCallback(async (_limit?: number, _forceRefresh = false) => {
    // No-op: analytics tab no longer needs raw allLogs
  }, []);

  return {
    logs,
    /** @deprecated Use useEquipmentAnalyticsSummaries in TemperatureAnalyticsTab instead */
    allLogs: [] as TemperatureLog[],
    equipment,
    setEquipment,
    loading,
    analyticsLoading: false,
    logsLoading,
    selectedDate,
    setSelectedDate,
    selectedType,
    setSelectedType,
    page,
    setPage,
    total: typedLogsData?.total || 0,
    totalPages: Math.max(1, Math.ceil((typedLogsData?.total || 0) / pageSize)),
    pageSize,
    fetchAllLogs,
    fetchEquipment,
    queryClient,
  };
}
