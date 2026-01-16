/**
 * Fetch Menu Item Data
 * Handles fetching both dishes and recipes with all nested ingredients
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

export interface MenuItemIngredient {
  name: string;
  quantity: number;
  unit: string;
  source?: string; // 'direct' | 'recipe:recipe_name'
}

export interface MenuItemSubRecipe {
  name: string;
  recipeId: string;
  quantity: number; // Quantity of recipe servings needed
  yield: number; // Recipe's yield (servings)
  yieldUnit: string;
  ingredients: MenuItemIngredient[];
  instructions?: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  type: 'dish' | 'recipe';
  baseYield: number; // Yield for this dish/recipe
  yieldUnit: string;
  directIngredients: MenuItemIngredient[];
  subRecipes: MenuItemSubRecipe[];
  instructions?: string;
}

export interface RawIngredientJoin {
  ingredient_name: string;
}

export interface RawRecipeIngredientJoin {
  quantity: number | string | null;
  unit: string | null;
  ingredients: RawIngredientJoin | null;
}

export interface RawRecipeResult {
  id: string;
  name: string;
  recipe_name?: string;
  description: string | null;
  yield: number | null;
  yield_unit: string | null;
  instructions: string | null;
  recipe_ingredients: RawRecipeIngredientJoin[];
}

export interface RawDishIngredientJoin {
  quantity: number | string | null;
  unit: string | null;
  ingredients: RawIngredientJoin | null;
}

export interface RawDishRecipeJoin {
  quantity: number | string | null;
  recipes: RawRecipeResult | null;
}

export interface RawDishResult {
  id: string;
  dish_name: string;
  description: string | null;
  dish_ingredients: RawDishIngredientJoin[];
  dish_recipes: RawDishRecipeJoin[];
}

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
