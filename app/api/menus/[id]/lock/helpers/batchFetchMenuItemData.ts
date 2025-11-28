/**
 * Batch Fetch Menu Item Data
 * Fetches all dishes and recipes in batch queries for efficient data loading
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { MenuItemData } from './fetchMenuItemData';

/**
 * Batch fetch all dishes with nested ingredients and sub-recipes
 */
async function batchFetchDishes(
  supabase: SupabaseClient,
  dishIds: string[],
): Promise<Map<string, MenuItemData>> {
  if (dishIds.length === 0) {
    return new Map();
  }

  const { data: dishes, error } = await supabase
    .from('dishes')
    .select(
      `
      id,
      dish_name,
      description,
      dish_ingredients (
        quantity,
        unit,
        ingredients (
          ingredient_name
        )
      ),
      dish_recipes (
        quantity,
        recipes (
          id,
          name,
          description,
          yield,
          yield_unit,
          instructions,
          recipe_ingredients (
            quantity,
            unit,
            ingredients (
              ingredient_name
            )
          )
        )
      )
    `,
    )
    .in('id', dishIds);

  if (error) {
    logger.error('Failed to batch fetch dishes:', error);
    return new Map();
  }

  const dishMap = new Map<string, MenuItemData>();

  for (const dish of dishes || []) {
    // Extract direct ingredients
    const directIngredients =
      dish.dish_ingredients?.map((di: any) => ({
        name: di.ingredients?.ingredient_name || 'Unknown Ingredient',
        quantity: Number(di.quantity) || 0,
        unit: di.unit || '',
        source: 'direct',
      })) || [];

    // Extract sub-recipes with their ingredients
    const subRecipes: Array<{
      name: string;
      recipeId: string;
      quantity: number;
      yield: number;
      yieldUnit: string;
      ingredients: Array<{ name: string; quantity: number; unit: string; source: string }>;
      instructions?: string;
    }> = [];
    if (dish.dish_recipes) {
      for (const dr of dish.dish_recipes) {
        const recipe = dr.recipes as any;
        if (!recipe || !Array.isArray(recipe.recipe_ingredients)) continue;

        // Handle both recipe_name and name columns
        const recipeName = recipe.recipe_name || recipe.name || 'Unknown Recipe';

        const recipeIngredients = recipe.recipe_ingredients.map((ri: any) => ({
          name: ri.ingredients?.ingredient_name || 'Unknown Ingredient',
          quantity: Number(ri.quantity) || 0,
          unit: ri.unit || '',
          source: `recipe:${recipeName}`,
        }));

        subRecipes.push({
          name: recipeName,
          recipeId: recipe.id,
          quantity: Number(dr.quantity) || 1,
          yield: Number(recipe.yield) || 1,
          yieldUnit: recipe.yield_unit || 'servings',
          ingredients: recipeIngredients,
          instructions: recipe.instructions || undefined,
        });
      }
    }

    dishMap.set(dish.id, {
      id: dish.id,
      name: dish.dish_name,
      description: dish.description || undefined,
      type: 'dish',
      baseYield: 1,
      yieldUnit: 'serving',
      directIngredients,
      subRecipes,
      instructions: undefined,
    });
  }

  logger.dev(`Batch fetched ${dishMap.size} dishes`);
  return dishMap;
}

/**
 * Batch fetch all recipes with nested ingredients
 */
async function batchFetchRecipes(
  supabase: SupabaseClient,
  recipeIds: string[],
): Promise<Map<string, MenuItemData>> {
  if (recipeIds.length === 0) {
    return new Map();
  }

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(
      `
      id,
      name,
      description,
      yield,
      yield_unit,
      instructions,
      recipe_ingredients (
        quantity,
        unit,
        ingredients (
          ingredient_name
        )
      )
    `,
    )
    .in('id', recipeIds);

  if (error) {
    logger.error('Failed to batch fetch recipes:', error);
    return new Map();
  }

  const recipeMap = new Map<string, MenuItemData>();

  for (const recipe of recipes || []) {
    const ingredients =
      recipe.recipe_ingredients?.map((ri: any) => ({
        name: ri.ingredients?.ingredient_name || 'Unknown Ingredient',
        quantity: Number(ri.quantity) || 0,
        unit: ri.unit || '',
        source: 'direct',
      })) || [];

    // Handle both recipe_name and name columns
    const recipeName = (recipe as any).recipe_name || (recipe as any).name || 'Unknown Recipe';

    recipeMap.set(recipe.id, {
      id: recipe.id,
      name: recipeName,
      description: recipe.description || undefined,
      type: 'recipe',
      baseYield: Number(recipe.yield) || 1,
      yieldUnit: recipe.yield_unit || 'servings',
      directIngredients: ingredients,
      subRecipes: [],
      instructions: recipe.instructions || undefined,
    });
  }

  logger.dev(`Batch fetched ${recipeMap.size} recipes`);
  return recipeMap;
}

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
