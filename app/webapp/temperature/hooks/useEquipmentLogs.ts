import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { useCallback, useEffect, useState } from 'react';
import { TemperatureLog } from '../types';
import { logger } from '@/lib/logger';
interface UseEquipmentLogsOptions {
  equipmentName: string | null;
  equipmentLocation?: string | null;
  timeFilter: '24h' | '7d' | '30d' | 'all';
}
export function useEquipmentLogs({
  equipmentName,
  equipmentLocation,
  timeFilter,
}: UseEquipmentLogsOptions) {
  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filterLogsByTime = useCallback(
    (allLogs: TemperatureLog[]) => {
      if (timeFilter === 'all') return allLogs;
      const now = new Date();
      const daysMap = { '24h': 1, '7d': 7, '30d': 30 };
      const days = daysMap[timeFilter];
      if (days === 1) {
        const cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return allLogs.filter(log => {
          const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
          return logDateTime >= cutoffDate && logDateTime <= now;
        });
      }
      const cutoffDate = new Date(now);
      cutoffDate.setDate(now.getDate() - days);
      return allLogs.filter(log => new Date(log.log_date) >= cutoffDate);
    },
    [timeFilter],
  );
  useEffect(() => {
    if (!equipmentName) {
      setLogs([]);
      setIsLoading(false);
      return;
    }
    const fetchLogs = async () => {
      setIsLoading(true);
      setError(null);
      const cacheKey = `equipment_logs_${equipmentName}`;
      const cachedLogs = getCachedData<TemperatureLog[]>(cacheKey);
      if (cachedLogs) setLogs(filterLogsByTime(cachedLogs));
      try {
        const locationsToQuery = [
          ...(equipmentLocation ? [equipmentLocation] : []),
          ...(equipmentName ? [equipmentName] : []),
        ].filter(Boolean);
        const uniqueLocations = [...new Set(locationsToQuery)];
        const fetchPromises = uniqueLocations.map(loc => {
          const params = new URLSearchParams();
          params.append('location', loc);
          params.append('pageSize', '1000');
          return fetch(`/api/temperature-logs?${params.toString()}`).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch logs for ${loc}: ${res.status}`);
            return res.json();
          });
        });
        const responses = await Promise.all(fetchPromises);
        const allLogs: TemperatureLog[] = [];
        responses.forEach((data, index) => {
          if (data.success && data.data?.items) allLogs.push(...data.data.items);
        });
        const uniqueLogs = Array.from(new Map(allLogs.map(log => [log.id, log])).values());
        if (uniqueLogs.length > 0) {
          cacheData(cacheKey, uniqueLogs);
          setLogs(filterLogsByTime(uniqueLogs));
          logger.dev(`✅ Found ${uniqueLogs.length} logs for equipment "${equipmentName}"`, {
            queriedLocations: uniqueLocations,
            matchingLogs: uniqueLogs.slice(0, 3).map(l => ({ location: l.location, date: l.log_date })),
          });
        } else {
          logger.warn(`⚠️ No logs found for equipment "${equipmentName}"`, { queriedLocations: uniqueLocations });
          setLogs([]);
        }
      } catch (err) {
        logger.error('Error fetching equipment logs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch logs');
        if (!cachedLogs) setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [equipmentName, equipmentLocation, filterLogsByTime]);
  useEffect(() => {
    if (!equipmentName) return;
    const cacheKey = `equipment_logs_${equipmentName}`;
    const cachedLogs = getCachedData<TemperatureLog[]>(cacheKey);
    if (cachedLogs) setLogs(filterLogsByTime(cachedLogs));
  }, [timeFilter, equipmentName, filterLogsByTime]);
  return { logs, isLoading, error };
}
