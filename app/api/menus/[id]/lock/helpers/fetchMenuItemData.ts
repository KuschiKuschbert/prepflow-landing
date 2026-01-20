/**
 * Fetch Menu Item Data
 * Handles fetching both dishes and recipes with all nested ingredients
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

import { MenuItemData } from './types';

import { fetchDishData } from './fetchMenuItemData/fetchDish';
import { fetchRecipeData } from './fetchMenuItemData/fetchRecipe';

/**
 * Fetch menu item data (dish or recipe) with all nested ingredients
 * @param cache - Optional cache Map to lookup data from (avoids database query)
 */
export async function fetchMenuItemData(
  supabase: SupabaseClient,
  menuItem: { id: string; dish_id?: string | null; recipe_id?: string | null },
  cache?: Map<string, MenuItemData>,
): Promise<MenuItemData | null> {
  // If cache provided, try lookup first
  if (cache) {
    if (menuItem.dish_id) {
      const cached = cache.get(menuItem.dish_id);
      if (cached) {
        logger.dev(`Cache hit for dish ${menuItem.dish_id}`);
        return cached;
      }
    }

    if (menuItem.recipe_id) {
      const cached = cache.get(menuItem.recipe_id);
      if (cached) {
        logger.dev(`Cache hit for recipe ${menuItem.recipe_id}`);
        return cached;
      }
    }

    // Cache miss - fall through to database query
    logger.dev(`Cache miss for menu item ${menuItem.id}, querying database`);
  }

  // Fallback to database query (original behavior)
  if (menuItem.dish_id) {
    return await fetchDishData(supabase, menuItem.dish_id);
  }

  if (menuItem.recipe_id) {
    return await fetchRecipeData(supabase, menuItem.recipe_id);
  }

  logger.warn(`Menu item ${menuItem.id} has neither dish_id nor recipe_id`);
  return null;
}
