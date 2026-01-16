import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Delete a cleaning task.
 *
 * @param {string} id - Cleaning task ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteCleaningTask(id: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { error } = await supabaseAdmin.from('cleaning_tasks').delete().eq('id', id);

  if (error) {
    logger.error('[Cleaning Tasks API] Database error deleting task:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/cleaning-tasks', operation: 'DELETE', taskId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
