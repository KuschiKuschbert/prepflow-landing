import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Create a temperature log entry.
 *
 * @param {Object} logData - Temperature log data
 * @returns {Promise<Object>} Created log entry
 * @throws {Error} If creation fails
 */
export async function createTemperatureLog(logData: {
  equipment_id?: string | null;
  log_date?: string;
  log_time?: string;
  temperature_type?: string;
  temperature_celsius: number;
  location?: string | null;
  notes?: string | null;
  logged_by?: string;
}) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  // If equipment_id is provided, fetch equipment details
  let temperatureType = logData.temperature_type;
  let equipmentLocation = logData.location;

  if (logData.equipment_id) {
    const { data: equipment } = await supabaseAdmin
      .from('temperature_equipment')
      .select('equipment_type, location, name')
      .eq('id', logData.equipment_id)
      .single();

    if (equipment) {
      temperatureType = temperatureType || equipment.equipment_type;
      equipmentLocation = equipmentLocation || equipment.location || equipment.name;
    }
  }

  const { data, error } = await supabaseAdmin
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
      code: (error as any).code,
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
