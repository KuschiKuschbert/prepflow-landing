import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { calculateOutOfRange } from './fetchTemperatureData/calculateOutOfRange';
import { fetchSupabaseTemperatureData } from './fetchTemperatureData/fetchSupabaseData';
import { fetchDashboardStats } from './fetchTemperatureData/fetchStats';
import { extractLastCheckTime } from './fetchTemperatureData/extractLastCheckTime';

export { calculateOutOfRange, extractLastCheckTime };

/**
 * Fetch temperature status data from cache or API
 *
 * @returns {Promise<{stats: any, logs: any[], equipment: any[]}>} Temperature data
 */
export async function fetchTemperatureStatusData() {
  const today = new Date().toISOString().split('T')[0];
  const cachedStats = getCachedData<any>('dashboard_stats');
  const cachedLogs = getCachedData<any[]>('dashboard_temperature_logs');
  const cachedEquipment = getCachedData<any[]>('dashboard_temperature_equipment');

  // Return cached data if available
  if (cachedStats && cachedLogs && cachedEquipment) {
    return {
      stats: cachedStats,
      logs: cachedLogs.filter((log: any) => log.log_date === today),
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
      logs: logs.filter((log: any) => log.log_date === today),
      equipment: equipment.length > 0 ? equipment : cachedEquipment || [],
    };
  } catch (err) {
    logger.error('Error fetching temperature status:', err);
    // Return cached data if available, otherwise empty
    return {
      stats: cachedStats || null,
      logs: cachedLogs?.filter((log: any) => log.log_date === today) || [],
      equipment: cachedEquipment || [],
    };
  }
}
