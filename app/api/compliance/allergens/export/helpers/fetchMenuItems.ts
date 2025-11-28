/**
 * Menu items fetching helper for allergen export
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface MenuItem {
  menu_id: string;
  menu_name: string;
}

/**
 * Fetches menu items mapping for dishes and recipes
 *
 * @returns {Promise<Record<string, MenuItem[]>>} Map of item ID to menu items
 */
export async function fetchMenuItemsMap(): Promise<Record<string, MenuItem[]>> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  const menuItemsMap: Record<string, MenuItem[]> = {};
  try {
    const { data: menuItems, error: menuItemsError } = await supabaseAdmin
      .from('menu_items')
      .select('menu_id, dish_id, recipe_id, menus(id, menu_name)');

    if (!menuItemsError && menuItems) {
      menuItems.forEach((item: any) => {
        const itemId = item.dish_id || item.recipe_id;
        const menu = item.menus;
        if (itemId && menu) {
          if (!menuItemsMap[itemId]) {
            menuItemsMap[itemId] = [];
          }
          if (!menuItemsMap[itemId].some(m => m.menu_id === menu.id)) {
            menuItemsMap[itemId].push({
              menu_id: menu.id,
              menu_name: menu.menu_name || 'Unknown Menu',
            });
          }
        }
      });
    }
  } catch (err) {
    logger.warn('[Allergen Export] Error fetching menu items:', err);
  }
  return menuItemsMap;
}
