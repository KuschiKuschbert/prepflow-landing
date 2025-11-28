/**
 * Helper to fetch menu item names.
 */

import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fetch menu item names and create a map.
 */
export async function fetchMenuItemNames(
  supabase: SupabaseClient,
  menuItemIds: string[],
): Promise<Map<string, string>> {
  const { data: menuItemsWithNames } = await supabase
    .from('menu_items')
    .select(
      `
      id,
      dish_id,
      recipe_id,
      dishes (
        dish_name
      ),
      recipes (
        name,
        recipe_name
      )
    `,
    )
    .in('id', menuItemIds);

  const menuItemNameMap = new Map<string, string>();
  if (menuItemsWithNames) {
    menuItemsWithNames.forEach((item: any) => {
      const recipeName = item.recipes?.recipe_name || item.recipes?.name || null;
      const name = item.dishes?.dish_name || recipeName || 'Unknown Item';
      menuItemNameMap.set(item.id, name);
    });
  }

  return menuItemNameMap;
}
