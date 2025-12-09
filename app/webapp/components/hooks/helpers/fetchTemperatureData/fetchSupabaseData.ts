/**
 * Fetch temperature data from Supabase
 */

import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Fetch temperature logs and equipment from Supabase
 *
 * @returns {Promise<{logs: any[], equipment: any[]}>} Temperature data
 */
export async function fetchSupabaseTemperatureData() {
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

  const logs = logsResult.data || [];
  const equipment = equipmentResult.data || [];

  // Log Supabase errors but don't fail completely
  if (logsResult.error) {
    logger.error('Error fetching temperature logs:', logsResult.error);
  }
  if (equipmentResult.error) {
    logger.error('Error fetching temperature equipment:', equipmentResult.error);
  }

  return { logs, equipment };
}
