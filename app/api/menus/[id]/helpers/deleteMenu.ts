import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Delete menu.
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteMenu(menuId: string, userId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { error } = await supabaseAdmin
    .from('menus')
    .delete()
    .eq('id', menuId)
    .eq('user_id', userId);

  if (error) {
    const pgError = error as PostgrestError;
    logger.error('[Menus API] Database error deleting menu:', {
      error: pgError.message,
      code: pgError.code,
      context: { endpoint: '/api/menus/[id]', operation: 'DELETE', menuId },
    });
    throw ApiErrorHandler.fromSupabaseError(pgError, 500);
  }
}
