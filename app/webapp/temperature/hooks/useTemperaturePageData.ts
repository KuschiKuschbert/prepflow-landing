import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { useTemperatureLogsQuery } from './useTemperatureLogsQuery';
import { logger } from '@/lib/logger';
export function useTemperaturePageData(activeTab: 'logs' | 'equipment' | 'analytics') {
  const queryClient = useQueryClient();
  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const [allLogs, setAllLogs] = useState<TemperatureLog[]>(
    () => getCachedData<TemperatureLog[]>('temperature_all_logs') || [],
  );
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>(
    () => getCachedData<TemperatureEquipment[]>('temperature_equipment') || [],
  );
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [lastAnalyticsFetch, setLastAnalyticsFetch] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { data: logsData, isLoading: logsLoading } = useTemperatureLogsQuery(
    selectedDate,
    selectedType,
    page,
    pageSize,
  );
  const fetchAllLogs = useCallback(
    async (limit?: number, forceRefresh = false) => {
      const isStale = Date.now() - lastAnalyticsFetch > 30000;
      if (!forceRefresh && !isStale && allLogs.length > 0) return;
      setAnalyticsLoading(true);
      try {
        const response = await fetch(`/api/temperature-logs?limit=${limit || 1000}`);
        const json = await response.json();
        if (json.success && json.data?.items) {
          setAllLogs(json.data.items);
          cacheData('temperature_all_logs', json.data.items);
          setLastAnalyticsFetch(Date.now());
        }
      } catch (error) {
        logger.error('Error fetching all logs:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    },
    [allLogs.length, lastAnalyticsFetch],
  );
  const fetchEquipment = useCallback(async () => {
    try {
      const response = await fetch('/api/temperature-equipment');
      const data = await response.json();
      if (data.success && data.data) {
        setEquipment(data.data);
        cacheData('temperature_equipment', data.data);
      }
    } catch (error) {
      logger.error('Error fetching equipment:', error);
    }
  }, []);
  useEffect(() => {
    if (logsData) {
      // Handle both direct items array and wrapped response
      const items = Array.isArray(logsData) ? logsData : (logsData as any)?.items || [];
      setLogs(items);
      logger.dev('[TemperaturePageData] Updated logs:', {
        count: items.length,
        hasData: !!logsData,
        logsDataType: typeof logsData,
        logsDataKeys: logsData ? Object.keys(logsData as any) : [],
      });
    } else {
      logger.dev('[TemperaturePageData] logsData is undefined');
      setLogs([]);
    }
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
