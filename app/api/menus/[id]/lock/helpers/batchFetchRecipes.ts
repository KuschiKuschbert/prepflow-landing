/**
 * Batch Fetch Recipes Helper
 * Fetches recipes with nested ingredients
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { MenuItemData, RawRecipeResult } from './types';

/**
 * Batch fetch all recipes with nested ingredients
 */
export async function batchFetchRecipes(
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

  // Cast the result to our defined type since Supabase types are generic
  const rawRecipes = (recipes || []) as unknown as RawRecipeResult[];

  for (const recipe of rawRecipes) {
    // Handle both recipe_name and name columns
    const recipeName = recipe.recipe_name || recipe.name || 'Unknown Recipe';

    const ingredients =
      recipe.recipe_ingredients?.map(ri => ({
        name: ri.ingredients?.ingredient_name || 'Unknown Ingredient',
        quantity: Number(ri.quantity) || 0,
        unit: ri.unit || '',
        source: 'direct',
      })) || [];

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
