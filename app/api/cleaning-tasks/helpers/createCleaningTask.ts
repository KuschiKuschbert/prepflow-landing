import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

const CLEANING_AREAS_SELECT = `
  *,
  cleaning_areas (
    id,
    area_name,
    description,
    frequency_days
  )
`;

/**
 * Create a cleaning task.
 *
 * @param {Object} taskData - Cleaning task data
 * @returns {Promise<Object>} Created cleaning task
 * @throws {Error} If creation fails
 */
export async function createCleaningTask(taskData: {
  area_id: string;
  assigned_date: string;
  notes?: string | null;
}) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  const { data, error } = await supabaseAdmin
    .from('cleaning_tasks')
    .insert({
      area_id: taskData.area_id,
      assigned_date: taskData.assigned_date,
      notes: taskData.notes || null,
      status: 'pending',
    })
    .select(CLEANING_AREAS_SELECT)
    .single();

  if (error) {
    logger.error('[Cleaning Tasks API] Database error creating task:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/cleaning-tasks', operation: 'POST', table: 'cleaning_tasks' },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
