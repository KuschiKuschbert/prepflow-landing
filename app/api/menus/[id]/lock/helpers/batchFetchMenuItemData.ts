/**
 * Batch Fetch Menu Item Data
 * Fetches all dishes and recipes in batch queries for efficient data loading
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { batchFetchDishes } from './batchFetchDishes';
import { batchFetchRecipes } from './batchFetchRecipes';
import { MenuItemData } from './types';

/**
 * Batch fetch all menu item data (dishes and recipes) upfront
 * Returns a cache Map for O(1) lookup during processing
 */
export async function batchFetchAllMenuItemData(
  supabase: SupabaseClient,
  menuItems: Array<{ id: string; dish_id?: string | null; recipe_id?: string | null }>,
): Promise<Map<string, MenuItemData>> {
  // Collect unique dish IDs and recipe IDs
  const dishIds = new Set<string>();
  const recipeIds = new Set<string>();

  for (const menuItem of menuItems) {
    if (menuItem.dish_id) {
      dishIds.add(menuItem.dish_id);
    }
    if (menuItem.recipe_id) {
      recipeIds.add(menuItem.recipe_id);
    }
  }

  logger.dev(`Batch fetching ${dishIds.size} dishes and ${recipeIds.size} recipes`);

  // Fetch all dishes and recipes in parallel
  const [dishMap, recipeMap] = await Promise.all([
    batchFetchDishes(supabase, Array.from(dishIds)),
    batchFetchRecipes(supabase, Array.from(recipeIds)),
  ]);

  // Combine into single cache map
  const cache = new Map<string, MenuItemData>();
  for (const [id, data] of dishMap) {
    cache.set(id, data);
  }
  for (const [id, data] of recipeMap) {
    cache.set(id, data);
  }

  logger.dev(
    `Created cache with ${cache.size} items (${dishMap.size} dishes, ${recipeMap.size} recipes)`,
  );
  return cache;
}

/**
 * Lookup menu item data from cache
 */
export function lookupMenuItemDataFromCache(
  cache: Map<string, MenuItemData>,
  menuItem: { id: string; dish_id?: string | null; recipe_id?: string | null },
): MenuItemData | null {
  if (menuItem.dish_id) {
    return cache.get(menuItem.dish_id) || null;
  }

  if (menuItem.recipe_id) {
    return cache.get(menuItem.recipe_id) || null;
  }

  logger.warn(`Menu item ${menuItem.id} has neither dish_id nor recipe_id`);
  return null;
}
