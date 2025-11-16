import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Fetch menu with items.
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<Object>} Menu with items
 * @throws {Error} If menu not found
 */
export async function fetchMenuWithItems(menuId: string) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  // Fetch menu
  const { data: menu, error: menuError } = await supabaseAdmin
    .from('menus')
    .select('*')
    .eq('id', menuId)
    .single();

  if (menuError || !menu) {
    logger.error('[Menus API] Menu not found:', {
      error: menuError?.message,
      code: (menuError as any)?.code,
      context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
    });
    throw ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404, {
      message: 'The requested menu could not be found',
    });
  }

  // Fetch menu items with dishes and recipes
  const { data: menuItems, error: itemsError } = await supabaseAdmin
    .from('menu_items')
    .select(
      `
      id,
      dish_id,
      recipe_id,
      category,
      position,
      dishes (
        id,
        dish_name,
        description,
        selling_price
      ),
      recipes (
        id,
        name,
        description,
        yield
      )
    `,
    )
    .eq('menu_id', menuId)
    .order('category')
    .order('position');

  if (itemsError) {
    logger.error('[Menus API] Database error fetching menu items:', {
      error: itemsError.message,
      code: (itemsError as any).code,
      context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
    });
    throw ApiErrorHandler.fromSupabaseError(itemsError, 500);
  }

  return {
    ...menu,
    items: menuItems || [],
  };
}
