import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Delete a cleaning task.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {string} id - Cleaning task ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteCleaningTask(
  supabase: SupabaseClient,
  id: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from('cleaning_tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    logger.error('[Cleaning Tasks API] Database error deleting task:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/cleaning-tasks', operation: 'DELETE', taskId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
