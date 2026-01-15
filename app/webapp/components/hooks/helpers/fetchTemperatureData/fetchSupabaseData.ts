/**
 * Fetch temperature data from Supabase
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { TemperatureEquipment, TemperatureLog } from '../../../../temperature/types';

/**
 * Fetch temperature logs and equipment from Supabase
 *
 * @returns {Promise<{logs: TemperatureLog[], equipment: TemperatureEquipment[]}>} Temperature data
 */
export async function fetchSupabaseTemperatureData(): Promise<{
  logs: TemperatureLog[];
  equipment: TemperatureEquipment[];
}> {
  try {
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

    const logs = (logsResult.data || []) as unknown as TemperatureLog[];
    const equipment = (equipmentResult.data || []) as unknown as TemperatureEquipment[];

    // Log Supabase errors but don't fail completely
    if (logsResult.error) {
      logger.error('Error fetching temperature logs:', logsResult.error);
    }
    if (equipmentResult.error) {
      logger.error('Error fetching temperature equipment:', equipmentResult.error);
    }

    return { logs, equipment };
  } catch (error) {
    logger.error('[fetchSupabaseTemperatureData] Error fetching temperature data:', {
      error: error instanceof Error ? error.message : String(error),
    });
    // Return empty arrays on error to prevent crashes
    return { logs: [], equipment: [] };
  }
}
