import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

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
 * @param {string} id - Cleaning task ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated cleaning task
 * @throws {Error} If update fails
 */
export async function updateCleaningTask(
  id: string,
  updateData: {
    status?: string;
    completed_date?: string | null;
    notes?: string | null;
    photo_url?: string | null;
  },
) {
  if (!supabaseAdmin)
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 503);

  const finalUpdateData: unknown = { ...updateData };
  if (updateData.status === 'completed' && !updateData.completed_date) {
    finalUpdateData.completed_date = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from('cleaning_tasks')
    .update(finalUpdateData)
    .eq('id', id)
    .select(CLEANING_AREAS_SELECT)
    .single();

  if (error) {
    logger.error('[Cleaning Tasks API] Database error updating task:', {
      error: error.message,
      code: (error as unknown).code,
      context: { endpoint: '/api/cleaning-tasks', operation: 'PUT', taskId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
