/**
 * Helper functions for populating cleaning data
 */

import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { cleanSampleCleaningAreas, cleanSampleCleaningTasks } from '@/lib/sample-cleaning-clean';

interface PopulateResults {
  cleaned: number;
  populated: Array<{ table: string; count: number }>;
  errors: Array<{ table: string; error: string }>;
}

/**
 * Populate cleaning data
 */
export async function populateCleaningData(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
) {
  const { data: cleaningAreasData, error: cleaningAreasError } = await supabaseAdmin
    .from('cleaning_areas')
    .insert(cleanSampleCleaningAreas)
    .select();

  if (cleaningAreasError) {
    results.errors.push({ table: 'cleaning_areas', error: cleaningAreasError.message });
    logger.error('Error inserting cleaning_areas:', cleaningAreasError);
    return;
  }

  results.populated.push({ table: 'cleaning_areas', count: cleaningAreasData?.length || 0 });

  // Cleaning Tasks
  if (cleaningAreasData) {
    const areaMap = new Map(cleaningAreasData.map(a => [a.area_name, a.id]));
    const tasksToInsert = cleanSampleCleaningTasks.map(task => ({
      task_name: task.task_name,
      description: task.description,
      // Use frequency_type (DB column name), not estimated_duration_minutes (doesn't exist)
      frequency_type: (task as Record<string, unknown>).frequency_type || task.frequency || 'Daily',
      area_id: areaMap.get('Kitchen Floor'),
    }));

    const { error: tasksError } = await supabaseAdmin.from('cleaning_tasks').insert(tasksToInsert);

    if (tasksError) {
      results.errors.push({ table: 'cleaning_tasks', error: tasksError.message });
      logger.error('Error inserting cleaning_tasks:', tasksError);
    } else {
      results.populated.push({ table: 'cleaning_tasks', count: tasksToInsert.length });
    }
  }
}
