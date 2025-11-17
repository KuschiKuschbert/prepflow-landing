import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';

/**
 * Delete a par level.
 *
 * @param {string} id - Par level ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteParLevel(id: string): Promise<void> {
  const supabaseAdmin = createSupabaseAdmin();

  // Check if par level exists
  const { data: existing, error: checkError } = await supabaseAdmin
    .from('par_levels')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError || !existing) {
    throw ApiErrorHandler.createError('Par level not found', 'NOT_FOUND', 404);
  }

  const { error } = await supabaseAdmin.from('par_levels').delete().eq('id', id);

  if (error) {
    logger.error('[Par Levels API] Database error deleting par level:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/par-levels', operation: 'DELETE', parLevelId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
