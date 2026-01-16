/**
 * Menu items fetching helper for allergen export
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface MenuItem {
  menu_id: string;
  menu_name: string;
}

interface MenuItemRow {
  menu_id: string;
  dish_id?: string;
  recipe_id?: string;
  menus?: { id: string; menu_name?: string }[];
}

/**
 * Fetches menu items mapping for dishes and recipes
 *
 * @returns {Promise<Record<string, MenuItem[]>>} Map of item ID to menu items
 */
export async function fetchMenuItemsMap(): Promise<Record<string, MenuItem[]>> {
  if (!supabaseAdmin) {
    logger.error('[Allergen Export] Database connection not available for fetchMenuItemsMap');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const menuItemsMap: Record<string, MenuItem[]> = {};
  try {
    const { data: menuItems, error: menuItemsError } = await supabaseAdmin
      .from('menu_items')
      .select('menu_id, dish_id, recipe_id, menus(id, menu_name)');

    if (!menuItemsError && menuItems) {
      (menuItems as MenuItemRow[]).forEach(item => {
        const itemId = item.dish_id || item.recipe_id;
        const menus = item.menus || [];
        if (itemId && menus.length > 0) {
          if (!menuItemsMap[itemId]) {
            menuItemsMap[itemId] = [];
          }
          menus.forEach(menu => {
            if (!menuItemsMap[itemId].some(m => m.menu_id === menu.id)) {
              menuItemsMap[itemId].push({
                menu_id: menu.id,
                menu_name: menu.menu_name || 'Unknown Menu',
              });
            }
          });
        }
      });
    }
  } catch (err) {
    logger.warn('[Allergen Export] Error fetching menu items:', err);
  }
  return menuItemsMap;
}
