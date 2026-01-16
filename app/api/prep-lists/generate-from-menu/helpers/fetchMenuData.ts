import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

import { MenuItemData } from '../types';

export async function fetchMenuData(
  menuId: string,
): Promise<{ menu: { id: string; menu_name: string } | null; menuItems: MenuItemData[] }> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Fetch menu
  const { data: menu, error: menuError } = await supabaseAdmin
    .from('menus')
    .select('id, menu_name')
    .eq('id', menuId)
    .single();

  if (menuError || !menu) {
    if (menuError) {
      logger.error('[Prep Lists API] Error fetching menu:', {
        error: menuError.message,
        menuId,
        context: { endpoint: '/api/prep-lists/generate-from-menu', operation: 'fetchMenuData' },
      });
    }
    throw ApiErrorHandler.createError('Menu not found', 'DATABASE_ERROR', 500);
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
      dishes (
        id,
        dish_name,
        description,
        kitchen_section_id
      ),
      recipes (
        id,
        name,
        description,
        yield,
        instructions
      )
    `,
    )
    .eq('menu_id', menuId);

  if (itemsError) {
    logger.error('[Prep Lists API] Error fetching menu items:', {
      error: itemsError.message,
      menuId,
      context: { endpoint: '/api/prep-lists/generate-from-menu', operation: 'fetchMenuData' },
    });
    throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
  }

  return { menu, menuItems: menuItems || [] };
}
