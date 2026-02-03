import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { Menu } from '../../types';

/**
 * Update menu.
 *
 * @param {string} menuId - Menu ID
 * @param {Partial<Menu>} updateData - Update data
 * @returns {Promise<Menu>} Updated menu
 * @throws {Error} If update fails
 */
export async function updateMenu(
  menuId: string,
  updateData: {
    menu_name?: string;
    description?: string | null;
  },
  userId: string,
): Promise<Menu> {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { data: updatedMenu, error: updateError } = await supabaseAdmin
    .from('menus')
    .update(updateData)
    .eq('id', menuId)
    .eq('user_id', userId)
    .select()
    .single();

  if (updateError) {
    const pgError = updateError as PostgrestError;
    logger.error('[Menus API] Database error updating menu:', {
      error: pgError.message,
      code: pgError.code,
      context: { endpoint: '/api/menus/[id]', operation: 'PUT', menuId },
    });
    throw ApiErrorHandler.fromSupabaseError(pgError, 500);
  }

  return updatedMenu as Menu;
}
