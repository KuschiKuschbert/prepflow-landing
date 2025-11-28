import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Calculate out of range temperature logs.
 *
 * @param {any[]} todayLogs - Today's temperature logs
 * @param {any[]} equipment - Temperature equipment list
 * @returns {number} Count of out of range logs
 */
export function calculateOutOfRange(todayLogs: any[], equipment: any[]): number {
  return todayLogs.filter((log: any) => {
    const eq = equipment.find((e: any) => e.location === log.location);
    if (!eq || eq.min_temp_celsius === null || eq.max_temp_celsius === null) return false;
    return (
      log.temperature_celsius < eq.min_temp_celsius || log.temperature_celsius > eq.max_temp_celsius
    );
  }).length;
}

/**
 * Fetch temperature status data from cache or API.
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
    let statsResponse: Response | null = null;
    try {
      statsResponse = await fetch('/api/dashboard/stats', { cache: 'no-store' });
    } catch (fetchError) {
      logger.error('Network error fetching temperature status:', fetchError);
      // Return cached data if available, otherwise empty
      return {
        stats: cachedStats || null,
        logs: cachedLogs?.filter((log: any) => log.log_date === today) || [],
        equipment: cachedEquipment || [],
      };
    }

    const [logsResult, equipmentResult] = await Promise.all([
      supabase
        .from('temperature_logs')
        .select('id, log_date, log_time, temperature_celsius, location, created_at')
        .order('log_date', { ascending: false })
        .order('log_time', { ascending: false })
        .limit(20),
      supabase
        .from('temperature_equipment')
        .select('id, location, min_temp_celsius, max_temp_celsius')
        .eq('is_active', true),
    ]);

    let stats = null;
    if (statsResponse.ok) {
      try {
        const statsJson = await statsResponse.json();
        stats = statsJson?.success ? statsJson : null;
      } catch (parseError) {
        logger.error('Error parsing temperature stats response:', parseError);
      }
    } else {
      logger.error('Error fetching temperature stats:', {
        status: statsResponse.status,
        statusText: statsResponse.statusText,
      });
    }

    const logs = logsResult.data || [];
    const equipment = equipmentResult.data || [];

    // Log Supabase errors but don't fail completely
    if (logsResult.error) {
      logger.error('Error fetching temperature logs:', logsResult.error);
    }
    if (equipmentResult.error) {
      logger.error('Error fetching temperature equipment:', equipmentResult.error);
    }

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

/**
 * Extract last check time from logs.
 *
 * @param {any[]} logs - Temperature logs
 * @returns {string | undefined} Last check time string
 */
export function extractLastCheckTime(logs: any[]): string | undefined {
  if (logs.length === 0) return undefined;
  const lastLog = logs[0];
  return lastLog.log_date && lastLog.log_time
    ? `${lastLog.log_date}T${lastLog.log_time}`
    : lastLog.created_at;
}
