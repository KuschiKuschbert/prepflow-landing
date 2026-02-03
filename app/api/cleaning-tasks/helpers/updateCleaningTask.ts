import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { CleaningTaskJoinResult, UpdateCleaningTaskInput } from './types';

const CLEANING_AREAS_SELECT = `
  *,
  cleaning_areas (
    id,
    area_name,
    description,
    cleaning_frequency
  ),
  kitchen_sections:section_id (
    id,
    section_name,
    description
  )
`;

/**
 * Update a cleaning task.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {string} id - Cleaning task ID
 * @param {UpdateCleaningTaskInput} updateData - Update data
 * @returns {Promise<CleaningTaskJoinResult>} Updated cleaning task
 * @throws {Error} If update fails
 */
export async function updateCleaningTask(
  supabase: SupabaseClient,
  id: string,
  updateData: UpdateCleaningTaskInput,
  userId: string,
): Promise<CleaningTaskJoinResult> {
  const finalUpdateData: Record<string, unknown> = { ...updateData };
  if (updateData.status === 'completed' && !updateData.completed_date) {
    finalUpdateData.completed_date = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('cleaning_tasks')
    .update(finalUpdateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select(CLEANING_AREAS_SELECT)
    .single();

  if (error) {
    logger.error('[Cleaning Tasks API] Database error updating task:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/cleaning-tasks', operation: 'PUT', taskId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data as CleaningTaskJoinResult;
}
