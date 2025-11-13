import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { useCallback, useEffect, useState } from 'react';
import { TemperatureLog } from '../types';

interface UseEquipmentLogsOptions {
  equipmentName: string | null;
  equipmentLocation?: string | null; // Optional location field
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
      if (timeFilter === 'all') {
        return allLogs;
      }

      const now = new Date();
      let cutoffDate: Date;

      if (timeFilter === '24h') {
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return allLogs.filter(log => {
          const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
          return logDateTime >= cutoffDate && logDateTime <= now;
        });
      } else if (timeFilter === '7d') {
        cutoffDate = new Date(now);
        cutoffDate.setDate(now.getDate() - 7);
        return allLogs.filter(log => new Date(log.log_date) >= cutoffDate);
      } else if (timeFilter === '30d') {
        cutoffDate = new Date(now);
        cutoffDate.setDate(now.getDate() - 30);
        return allLogs.filter(log => new Date(log.log_date) >= cutoffDate);
      }

      return allLogs;
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

      // Check cache first for instant display
      const cacheKey = `equipment_logs_${equipmentName}`;
      const cachedLogs = getCachedData<TemperatureLog[]>(cacheKey);

      if (cachedLogs) {
        const filtered = filterLogsByTime(cachedLogs);
        setLogs(filtered);
        // Don't set loading to false here - continue to fetch fresh data
      }

      try {
        // Fetch from API - query both name and location to match all logs
        // Logs are created with location: eq.location || eq.name
        // We need to query both possibilities and combine results
        const locationsToQuery = [
          ...(equipmentLocation ? [equipmentLocation] : []),
          ...(equipmentName ? [equipmentName] : []),
        ].filter(Boolean);

        // Remove duplicates
        const uniqueLocations = [...new Set(locationsToQuery)];

        // Fetch logs for all possible locations
        const fetchPromises = uniqueLocations.map(loc => {
          const params = new URLSearchParams();
          params.append('location', loc);
          params.append('pageSize', '1000'); // Get all logs for this location
          return fetch(`/api/temperature-logs?${params.toString()}`).then(res => {
            if (!res.ok) {
              throw new Error(`Failed to fetch logs for ${loc}: ${res.status}`);
            }
            return res.json();
          });
        });

        const responses = await Promise.all(fetchPromises);
        const allLogs: TemperatureLog[] = [];

        // Combine all logs from all queries
        responses.forEach((data, index) => {
          if (data.success && data.data?.items) {
            allLogs.push(...data.data.items);
          }
        });

        // Remove duplicates by log ID
        const uniqueLogs = Array.from(
          new Map(allLogs.map(log => [log.id, log])).values(),
        );

        if (uniqueLogs.length > 0) {
          // Cache all matching logs
          cacheData(cacheKey, uniqueLogs);
          // Filter by time
          const filtered = filterLogsByTime(uniqueLogs);
          setLogs(filtered);
          console.log(`✅ Found ${uniqueLogs.length} logs for equipment "${equipmentName}"`, {
            queriedLocations: uniqueLocations,
            matchingLogs: uniqueLogs.slice(0, 3).map(l => ({ location: l.location, date: l.log_date })),
          });
        } else {
          console.warn(`⚠️ No logs found for equipment "${equipmentName}"`, {
            queriedLocations: uniqueLocations,
          });
          setLogs([]);
        }
      } catch (err) {
        console.error('Error fetching equipment logs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch logs');
        // If we have cached data, keep it even on error
        if (!cachedLogs) {
          setLogs([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [equipmentName, filterLogsByTime]);

  // Re-filter when time filter changes
  useEffect(() => {
    if (!equipmentName) return;

    const cacheKey = `equipment_logs_${equipmentName}`;
    const cachedLogs = getCachedData<TemperatureLog[]>(cacheKey);
    if (cachedLogs) {
      const filtered = filterLogsByTime(cachedLogs);
      setLogs(filtered);
    }
  }, [timeFilter, equipmentName, filterLogsByTime]);

  return { logs, isLoading, error };
}
