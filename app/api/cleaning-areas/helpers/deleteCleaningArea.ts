import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Delete a cleaning area.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {string} id - Cleaning area ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteCleaningArea(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await supabase.from('cleaning_areas').delete().eq('id', id);

  if (error) {
    logger.error('[Cleaning Areas API] Database error deleting area:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/cleaning-areas', operation: 'DELETE', areaId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
