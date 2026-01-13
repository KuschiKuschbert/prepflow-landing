import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Delete a cleaning area.
 *
 * @param {string} id - Cleaning area ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteCleaningArea(id: string): Promise<void> {
  if (!supabaseAdmin)
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);

  const { error } = await supabaseAdmin.from('cleaning_areas').delete().eq('id', id);

  if (error) {
    logger.error('[Cleaning Areas API] Database error deleting area:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/cleaning-areas', operation: 'DELETE', areaId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
