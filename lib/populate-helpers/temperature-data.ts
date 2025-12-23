/**
 * Helper functions for populating temperature data
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import { cleanSampleEquipment } from '@/lib/sample-equipment-clean';
import { generateTemperatureLogs } from '@/lib/temperature-log-generator';
import { logger } from '@/lib/logger';

interface PopulateResults {
  cleaned: number;
  populated: Array<{ table: string; count: number }>;
  errors: Array<{ table: string; error: string }>;
}

/**
 * Populate temperature equipment and logs
 */
export async function populateTemperatureData(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
  countryCode: string,
) {
  const { data: equipmentData, error: equipmentError } = await supabaseAdmin
    .from('temperature_equipment')
    .insert(cleanSampleEquipment)
    .select();

  if (equipmentError) {
    results.errors.push({ table: 'temperature_equipment', error: equipmentError.message });
    return;
  }

  results.populated.push({ table: 'temperature_equipment', count: equipmentData?.length || 0 });

  // Generate Temperature Logs
  if (equipmentData && equipmentData.length > 0) {
    try {
      const temperatureLogs = generateTemperatureLogs({
        equipment: equipmentData.map(eq => ({
          id: eq.id,
          name: eq.name,
          equipment_type: eq.equipment_type,
          min_temp_celsius: eq.min_temp_celsius,
          max_temp_celsius: eq.max_temp_celsius,
          is_active: eq.is_active,
        })),
        countryCode,
        days: 30,
        logsPerDay: 4,
        includeOutOfRange: true,
        outOfRangePercentage: 0.08,
      });

      if (temperatureLogs.length > 0) {
        const batchSize = 50;
        let insertedCount = 0;
        for (let i = 0; i < temperatureLogs.length; i += batchSize) {
          const batch = temperatureLogs.slice(i, i + batchSize);
          const { error: logsError } = await supabaseAdmin.from('temperature_logs').insert(
            batch.map(log => ({
              log_date: log.log_date,
              log_time: log.log_time,
              temperature_type: log.temperature_type,
              temperature_celsius: log.temperature_celsius,
              location: log.location,
              notes: log.notes,
              logged_by: log.logged_by,
              equipment_id: log.equipment_id || null,
            })),
          );

          if (logsError) {
            results.errors.push({ table: 'temperature_logs', error: logsError.message });
            break;
          } else {
            insertedCount += batch.length;
          }
        }

        if (insertedCount > 0) {
          results.populated.push({ table: 'temperature_logs', count: insertedCount });
        }
      }
    } catch (logsErr) {
      logger.error('[temperature-data.ts] Error in catch block:', {
      error: logsErr instanceof Error ? logsErr.message : String(logsErr),
      stack: logsErr instanceof Error ? logsErr.stack : undefined,
    });

      results.errors.push({
        table: 'temperature_logs',
        error: logsErr instanceof Error ? logsErr.message : 'Unknown error',
      });
    }
  }
}
