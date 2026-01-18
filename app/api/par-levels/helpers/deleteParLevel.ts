import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Delete a par level.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {string} id - Par level ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteParLevel(supabase: SupabaseClient, id: string): Promise<void> {


  // Check if par level exists
  const { data: existing, error: checkError } = await supabase
    .from('par_levels')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError || !existing) {
    throw ApiErrorHandler.createError('Par level not found', 'NOT_FOUND', 404);
  }

  const { error } = await supabase.from('par_levels').delete().eq('id', id);

  if (error) {
    logger.error('[Par Levels API] Database error deleting par level:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/par-levels', operation: 'DELETE', parLevelId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
