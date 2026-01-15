import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { TemperatureEquipment, TemperatureLog } from '../../../temperature/types';
import { calculateOutOfRange } from './fetchTemperatureData/calculateOutOfRange';
import { extractLastCheckTime } from './fetchTemperatureData/extractLastCheckTime';
import { fetchDashboardStats } from './fetchTemperatureData/fetchStats';
import { fetchSupabaseTemperatureData } from './fetchTemperatureData/fetchSupabaseData';

export { calculateOutOfRange, extractLastCheckTime };

/**
 * Fetch temperature status data from cache or API
 *
 * @returns {Promise<{stats: Record<string, unknown> | null, logs: TemperatureLog[], equipment: TemperatureEquipment[]}>} Temperature data
 */
export async function fetchTemperatureStatusData() {
  const today = new Date().toISOString().split('T')[0];
  const cachedStats = getCachedData<Record<string, unknown>>('dashboard_stats');
  const cachedLogs = getCachedData<TemperatureLog[]>('dashboard_temperature_logs');
  const cachedEquipment = getCachedData<TemperatureEquipment[]>('dashboard_temperature_equipment');

  // Return cached data if available
  if (cachedStats && cachedLogs && cachedEquipment) {
    return {
      stats: cachedStats,
      logs: cachedLogs.filter(log => log.log_date === today),
      equipment: cachedEquipment,
    };
  }

  // Fetch fresh data
  try {
    const stats = await fetchDashboardStats();
    const { logs, equipment } = await fetchSupabaseTemperatureData();

    // Cache the data if we got fresh data
    if (logs.length > 0) {
      cacheData('dashboard_temperature_logs', logs);
    }
    if (equipment.length > 0) {
      cacheData('dashboard_temperature_equipment', equipment);
    }

    return {
      stats: stats || cachedStats || null,
      logs: logs.filter(log => log.log_date === today),
      equipment: equipment.length > 0 ? equipment : cachedEquipment || [],
    };
  } catch (err) {
    logger.error('Error fetching temperature status:', err);
    // Return cached data if available, otherwise empty
    return {
      stats: cachedStats || null,
      logs: cachedLogs?.filter(log => log.log_date === today) || [],
      equipment: cachedEquipment || [],
    };
  }
}
