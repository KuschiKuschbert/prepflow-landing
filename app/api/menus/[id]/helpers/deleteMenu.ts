import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Delete menu.
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteMenu(menuId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { error } = await supabaseAdmin.from('menus').delete().eq('id', menuId);

  if (error) {
    logger.error('[Menus API] Database error deleting menu:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/menus/[id]', operation: 'DELETE', menuId },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
