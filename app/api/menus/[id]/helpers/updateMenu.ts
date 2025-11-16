import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Update menu.
 *
 * @param {string} menuId - Menu ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated menu
 * @throws {Error} If update fails
 */
export async function updateMenu(
  menuId: string,
  updateData: {
    menu_name?: string;
    description?: string | null;
  },
) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  const { data: updatedMenu, error: updateError } = await supabaseAdmin
    .from('menus')
    .update(updateData)
    .eq('id', menuId)
    .select()
    .single();

  if (updateError) {
    logger.error('[Menus API] Database error updating menu:', {
      error: updateError.message,
      code: (updateError as any).code,
      context: { endpoint: '/api/menus/[id]', operation: 'PUT', menuId },
    });
    throw ApiErrorHandler.fromSupabaseError(updateError, 500);
  }

  return updatedMenu;
}
