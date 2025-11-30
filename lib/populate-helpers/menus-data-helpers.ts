/**
 * Helper functions for menu data population (extracted to keep menus-data.ts under 150 lines)
 */

import { cleanSampleMenus } from '@/lib/sample-menus-clean';

/**
 * Create lookup maps for dishes and recipes
 */
export function createMenuLookupMaps(dishesData: any[], recipesData: any[]) {
  const dishMap = new Map<string, string>();
  if (dishesData) {
    dishesData.forEach(d => {
      const name = d.dish_name;
      if (name) {
        dishMap.set(name.toLowerCase().trim(), d.id);
        dishMap.set(name, d.id);
      }
    });
  }

  const recipeMap = new Map<string, string>();
  if (recipesData) {
    recipesData.forEach(r => {
      const name = r.recipe_name || r.name;
      if (name) {
        recipeMap.set(name.toLowerCase().trim(), r.id);
        recipeMap.set(name, r.id);
      }
    });
  }

  return { dishMap, recipeMap };
}

/**
 * Create menu map from menus data
 */
export function createMenuMap(menusData: any[]): Map<string, string> {
  const menuMap = new Map<string, string>();
  menusData.forEach(m => {
    const name = m.menu_name;
    if (name) {
      menuMap.set(name.toLowerCase().trim(), m.id);
      menuMap.set(name, m.id);
    }
  });
  return menuMap;
}

/**
 * Build menu_items insert data
 */
export function buildMenuItemsData(
  menuMap: Map<string, string>,
  dishMap: Map<string, string>,
  recipeMap: Map<string, string>,
): {
  data: Array<{
    menu_id: string;
    dish_id?: string;
    recipe_id?: string;
    category: string;
    position: number;
  }>;
  skipped: string[];
} {
  const menuItemsToInsert: Array<{
    menu_id: string;
    dish_id?: string;
    recipe_id?: string;
    category: string;
    position: number;
  }> = [];
  const skippedItems: string[] = [];

  for (const menuDef of cleanSampleMenus) {
    const menuId =
      menuMap.get(menuDef.menu_name.toLowerCase().trim()) || menuMap.get(menuDef.menu_name);
    if (!menuId) {
      skippedItems.push(`Menu "${menuDef.menu_name}" not found`);
      continue;
    }

    for (const itemDef of menuDef.items) {
      let dishId: string | undefined;
      let recipeId: string | undefined;

      if (itemDef.dish_name) {
        dishId =
          dishMap.get(itemDef.dish_name.toLowerCase().trim()) || dishMap.get(itemDef.dish_name);
        if (!dishId) {
          skippedItems.push(`${menuDef.menu_name} → dish "${itemDef.dish_name}"`);
          continue;
        }
      } else if (itemDef.recipe_name) {
        recipeId =
          recipeMap.get(itemDef.recipe_name.toLowerCase().trim()) ||
          recipeMap.get(itemDef.recipe_name);
        if (!recipeId) {
          skippedItems.push(`${menuDef.menu_name} → recipe "${itemDef.recipe_name}"`);
          continue;
        }
      } else {
        skippedItems.push(`${menuDef.menu_name} → item without dish_name or recipe_name`);
        continue;
      }

      menuItemsToInsert.push({
        menu_id: menuId,
        dish_id: dishId,
        recipe_id: recipeId,
        category: itemDef.category,
        position: itemDef.position,
      });
    }
  }

  return { data: menuItemsToInsert, skipped: skippedItems };
}


