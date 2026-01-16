/**
 * Fetch temperature data for kitchen alerts
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { TemperatureEquipment, TemperatureLog } from '../../../temperature/types';
import { calculateTemperatureAlerts } from '../useKitchenAlertsHelpers';

/**
 * Fetch temperature alerts data
 *
 * @param {string} today - Today's date string
 * @param {any[]} cachedLogs - Cached temperature logs
 * @param {any[]} cachedEquipment - Cached temperature equipment
 * @returns {Promise<Array<{id: string, message: string, severity: 'critical' | 'warning'}>>} Temperature alerts
 */
export async function fetchTemperatureAlerts(
  today: string,
  cachedLogs?: Pick<TemperatureLog, 'id' | 'location' | 'temperature_celsius' | 'log_date'>[],
  cachedEquipment?: Pick<
    TemperatureEquipment,
    'id' | 'location' | 'min_temp_celsius' | 'max_temp_celsius' | 'name'
  >[],
) {
  try {
    const [logsResult, equipmentResult] = await Promise.all([
      supabase
        .from('temperature_logs')
        .select('id, log_date, log_time, temperature_celsius, location')
        .eq('log_date', today)
        .order('log_time', { ascending: false }),
      supabase
        .from('temperature_equipment')
        .select('id, name, location, min_temp_celsius, max_temp_celsius')
        .eq('is_active', true),
    ]);

    // Log Supabase errors but still try to use data if available
    if (logsResult.error) {
      logger.error('Error fetching temperature logs for alerts:', logsResult.error);
    }
    if (equipmentResult.error) {
      logger.error('Error fetching temperature equipment for alerts:', equipmentResult.error);
    }

    // Use data if available (even if there were errors)
    if (!logsResult.error && logsResult.data && !equipmentResult.error && equipmentResult.data) {
      return calculateTemperatureAlerts(logsResult.data || [], equipmentResult.data || []);
    } else if (cachedLogs && cachedEquipment) {
      // Fallback to cached data if fresh fetch failed
      const todayLogs = (cachedLogs || []).filter(log => log.log_date === today);
      return calculateTemperatureAlerts(todayLogs, cachedEquipment);
    }

    return [];
  } catch (error) {
    logger.error('[fetchTemperatureAlerts] Error fetching temperature alerts:', {
      error: error instanceof Error ? error.message : String(error),
      today,
    });
    // Fallback to cached data if available
    if (cachedLogs && cachedEquipment) {
      const todayLogs = (cachedLogs || []).filter(log => log.log_date === today);
      return calculateTemperatureAlerts(todayLogs, cachedEquipment);
    }
    return [];
  }
}
