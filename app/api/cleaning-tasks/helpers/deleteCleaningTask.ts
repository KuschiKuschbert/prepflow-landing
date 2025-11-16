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
  if (!supabaseAdmin) throw new Error('Database connection not available');

  const { error } = await supabaseAdmin.from('cleaning_tasks').delete().eq('id', id);

  if (error) {
    logger.error('[Cleaning Tasks API] Database error deleting task:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/cleaning-tasks', operation: 'DELETE', taskId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
