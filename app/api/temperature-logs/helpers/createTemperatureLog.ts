import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create a temperature log entry.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {Object} logData - Temperature log data
 * @returns {Promise<Object>} Created log entry
 * @throws {Error} If creation fails
 */
export async function createTemperatureLog(
  supabase: SupabaseClient,
  logData: {
    equipment_id?: string | null;
    log_date?: string;
    log_time?: string;
    temperature_type?: string;
    temperature_celsius: number;
    location?: string | null;
    notes?: string | null;
    logged_by?: string;
  },
) {

  // If equipment_id is provided, fetch equipment details
  let temperatureType = logData.temperature_type;
  let equipmentLocation = logData.location;

  if (logData.equipment_id) {
    const { data: equipment, error: equipmentError } = await supabase
      .from('temperature_equipment')
      .select('equipment_type, location, name')
      .eq('id', logData.equipment_id)
      .single();

    if (equipmentError) {
      logger.warn('[Temperature Logs API] Error fetching equipment details (non-fatal):', {
        error: equipmentError.message,
        code: equipmentError.code,
        equipmentId: logData.equipment_id,
      });
      // Continue without equipment details - use provided values or defaults
    } else if (equipment) {
      temperatureType = temperatureType || equipment.equipment_type;
      equipmentLocation = equipmentLocation || equipment.location || equipment.name;
    }
  }

  const { data, error } = await supabase
    .from('temperature_logs')
    .insert([
      {
        equipment_id: logData.equipment_id || null,
        log_date: logData.log_date || new Date().toISOString().split('T')[0],
        log_time: logData.log_time || new Date().toTimeString().split(' ')[0],
        temperature_type: temperatureType,
        temperature_celsius: logData.temperature_celsius,
        location: equipmentLocation || null,
        notes: logData.notes || null,
        logged_by: logData.logged_by || 'System',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    logger.error('[Temperature Logs API] Database error creating log:', {
      error: error.message,
      code: error.code,
      context: {
        endpoint: '/api/temperature-logs',
        operation: 'POST',
        table: 'temperature_logs',
      },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
