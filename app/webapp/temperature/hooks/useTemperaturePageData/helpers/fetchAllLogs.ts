/**
 * Fetch all logs helper.
 */
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { TemperatureLog } from '../../types';

export async function fetchAllLogsHelper(
  limit: number | undefined,
  forceRefresh: boolean,
  lastAnalyticsFetch: number,
  allLogs: TemperatureLog[],
  setAllLogs: (logs: TemperatureLog[]) => void,
  setAnalyticsLoading: (loading: boolean) => void,
  setLastAnalyticsFetch: (timestamp: number) => void,
): Promise<void> {
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
}
