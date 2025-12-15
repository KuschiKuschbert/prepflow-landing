/**
 * Fetch logs for equipment.
 */
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { TemperatureLog } from '../../../types';

export async function fetchEquipmentLogsHelper(
  equipmentName: string,
  equipmentLocation: string | null | undefined,
  filterLogsByTime: (logs: TemperatureLog[]) => TemperatureLog[],
  setLogs: (logs: TemperatureLog[]) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  cachedLogs: TemperatureLog[] | null,
): Promise<void> {
  try {
    const locationsToQuery = [...(equipmentLocation ? [equipmentLocation] : []), ...(equipmentName ? [equipmentName] : [])].filter(Boolean);
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
    responses.forEach((data) => {
      if (data.success && data.data?.items) allLogs.push(...data.data.items);
    });
    const uniqueLogs = Array.from(new Map(allLogs.map(log => [log.id, log])).values());
    if (uniqueLogs.length > 0) {
      const cacheKey = `equipment_logs_${equipmentName}`;
      cacheData(cacheKey, uniqueLogs);
      setLogs(filterLogsByTime(uniqueLogs));
      logger.dev(`✅ Found ${uniqueLogs.length} logs for equipment "${equipmentName}"`, {
        queriedLocations: uniqueLocations,
        matchingLogs: uniqueLogs.slice(0, 3).map(l => ({ location: l.location, date: l.log_date })),
      });
    } else {
      logger.warn(`⚠️ No logs found for equipment "${equipmentName}"`, { queriedLocations: uniqueLocations });
      if (!cachedLogs) setLogs([]);
    }
  } catch (err) {
    logger.error('Error fetching equipment logs:', err);
    setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    if (!cachedLogs) setLogs([]);
  } finally {
    setIsLoading(false);
  }
}
