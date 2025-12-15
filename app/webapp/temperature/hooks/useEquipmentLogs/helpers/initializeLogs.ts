/**
 * Initialize logs from cache or set empty state.
 */
import { getCachedData } from '@/lib/cache/data-cache';
import type { TemperatureLog } from '../../types';

export function initializeLogsHelper(
  equipmentName: string | null,
  filterLogsByTime: (logs: TemperatureLog[]) => TemperatureLog[],
  setLogs: (logs: TemperatureLog[]) => void,
  setIsLoading: (loading: boolean) => void,
): { cacheKey: string; cachedLogs: TemperatureLog[] | null } | null {
  if (!equipmentName) {
    setLogs([]);
    setIsLoading(false);
    return null;
  }
  const cacheKey = `equipment_logs_${equipmentName}`;
  const cachedLogs = getCachedData<TemperatureLog[]>(cacheKey);
  if (cachedLogs && cachedLogs.length > 0) {
    setLogs(filterLogsByTime(cachedLogs));
    setIsLoading(false);
  } else {
    setIsLoading(true);
  }
  return { cacheKey, cachedLogs };
}
