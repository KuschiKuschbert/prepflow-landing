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
        const data = await response.json();
        if (data.success && data.items) {
          setAllLogs(data.items);
          cacheData('temperature_all_logs', data.items);
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
      if (data.success && data.items) {
        setEquipment(data.items);
        cacheData('temperature_equipment', data.items);
      }
    } catch (error) {
      logger.error('Error fetching equipment:', error);
    }
  }, []);
  useEffect(() => {
    const ld = logsData as any;
    if (ld?.items) setLogs(ld.items);
    else if (logsData && !ld?.items) setLogs([]);
  }, [logsData]);
  useEffect(() => {
    prefetchApis(['/api/temperature-equipment']);
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchEquipment()]);
      } catch (error) {
        logger.error('Error loading temperature data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchEquipment]);
  useEffect(() => {
    if (activeTab === 'analytics' || activeTab === 'equipment') {
      const isStale = Date.now() - lastAnalyticsFetch > 30000;
      const shouldFetch = allLogs.length === 0 || isStale;
      if (shouldFetch && !analyticsLoading) fetchAllLogs(1000, isStale).catch(() => {});
    }
  }, [activeTab, allLogs.length, lastAnalyticsFetch, analyticsLoading, fetchAllLogs]);
  const total = (logsData as any)?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
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
    total,
    totalPages,
    pageSize,
    fetchAllLogs,
    fetchEquipment,
    queryClient,
  };
}
