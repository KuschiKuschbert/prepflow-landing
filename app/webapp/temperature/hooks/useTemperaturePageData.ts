import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchApis } from '@/lib/cache/data-cache';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { useTemperatureLogsQuery } from './useTemperatureLogsQuery';
import { logger } from '@/lib/logger';
import { fetchAllLogsHelper } from './useTemperaturePageData/helpers/fetchAllLogs';
import { fetchEquipmentHelper } from './useTemperaturePageData/helpers/fetchEquipment';
import { updateLogsFromQueryHelper } from './useTemperaturePageData/helpers/updateLogsFromQuery';
import { createInitialState } from './useTemperaturePageData/helpers/initialState';
export function useTemperaturePageData(activeTab: 'logs' | 'equipment' | 'analytics') {
  const queryClient = useQueryClient();
  const initialState = createInitialState();
  const [logs, setLogs] = useState<TemperatureLog[]>(initialState.logs);
  const [allLogs, setAllLogs] = useState<TemperatureLog[]>(initialState.allLogs);
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>(initialState.equipment);
  const [loading, setLoading] = useState(initialState.loading);
  const [analyticsLoading, setAnalyticsLoading] = useState(initialState.analyticsLoading);
  const [lastAnalyticsFetch, setLastAnalyticsFetch] = useState(initialState.lastAnalyticsFetch);
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
  const fetchAllLogs = useCallback(
    async (limit?: number, forceRefresh = false) => {
      await fetchAllLogsHelper(
        limit,
        forceRefresh,
        lastAnalyticsFetch,
        allLogs,
        setAllLogs,
        setAnalyticsLoading,
        setLastAnalyticsFetch,
      );
    },
    [allLogs, lastAnalyticsFetch],
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
  useEffect(() => {
    if ((activeTab === 'analytics' || activeTab === 'equipment') && !analyticsLoading) {
      const isStale = Date.now() - lastAnalyticsFetch > 30000;
      if (allLogs.length === 0 || isStale) fetchAllLogs(1000, isStale).catch(() => {});
    }
  }, [activeTab, allLogs.length, lastAnalyticsFetch, analyticsLoading, fetchAllLogs]);
  return {
    logs,
    allLogs,
    equipment,
    setEquipment,
    loading,
    analyticsLoading,
    logsLoading,
    selectedDate,
    setSelectedDate,
    selectedType,
    setSelectedType,
    page,
    setPage,
    total: (logsData as any)?.total || 0,
    totalPages: Math.max(1, Math.ceil(((logsData as any)?.total || 0) / pageSize)),
    pageSize,
    fetchAllLogs,
    fetchEquipment,
    queryClient,
  };
}
