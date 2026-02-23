/**
 * Aggregate ingredients from dish and recipes
 * Combines direct dish ingredients with recipe ingredients.
 * Includes fallback when join returns empty but dish_ingredients rows exist.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { DishIngredient, DishRecipe } from '@/types/dish';

import { fetchDishIngredients } from '../../helpers/fetchDishIngredients';
import { fetchDishRecipes } from '../../helpers/fetchDishRecipes';
import { batchFetchRecipeIngredients } from './batchFetchRecipeIngredients';
import { extractInstructions } from './extractInstructions';

/**
 * Aggregate all ingredient names from dish and recipes
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<{ingredientNames: string[], recipeInstructions: string[]}>} Aggregated ingredient names and recipe instructions
 */
export async function aggregateDishIngredients(dishId: string): Promise<{
  ingredientNames: string[];
  recipeInstructions: string[];
}> {
  // Fetch dish ingredients
  let dishIngredients: DishIngredient[] = [];
  try {
    dishIngredients = await fetchDishIngredients(dishId);
  } catch (error) {
    logger.error('[Dish Image Generation] Failed to fetch dish ingredients:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
    });
  }

  // Fetch dish recipes
  let dishRecipes: DishRecipe[] = [];
  try {
    dishRecipes = await fetchDishRecipes(dishId);
  } catch (error) {
    logger.error('[Dish Image Generation] Failed to fetch dish recipes:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
    });
  }

  // Extract instructions
  const recipeInstructions = extractInstructions(dishRecipes);

  // Collect recipe IDs
  const recipeIds = dishRecipes.map(dr => dr.recipe_id || dr.id).filter((id): id is string => !!id);

  // Batch fetch recipe ingredients
  const recipeIngredientNamesSet = await batchFetchRecipeIngredients(recipeIds);

  // Aggregate all ingredient names
  const ingredientNamesSet = new Set<string>();

  // Add direct dish ingredients
  // fetchDishIngredients returns DishRelationIngredient with `ingredients` (plural);
  // types/dish DishIngredient uses `ingredient` (singular) - support both shapes
  dishIngredients.forEach(di => {
    const ingredient =
      (di as unknown as Record<string, unknown>).ingredients ??
      (di as unknown as Record<string, unknown>).ingredient;
    if (ingredient && typeof ingredient === 'object') {
      const ing = ingredient as Record<string, unknown>;
      const name = ing.ingredient_name ?? ing.name;
      if (name && typeof name === 'string') {
        ingredientNamesSet.add(name);
      }
    }
  });

  // Fallback: when join returns empty but dish_ingredients rows exist (e.g. orphaned refs)
  if (dishIngredients.length === 0 && supabaseAdmin) {
    const { data: rawRows } = await supabaseAdmin
      .from('dish_ingredients')
      .select('ingredient_id')
      .eq('dish_id', dishId);
    const ingredientIds = (rawRows || [])
      .map((r: { ingredient_id: string | null }) => r.ingredient_id)
      .filter((id): id is string => !!id);
    if (ingredientIds.length > 0) {
      const { data: ingredients } = await supabaseAdmin
        .from('ingredients')
        .select('id, ingredient_name, name')
        .in('id', ingredientIds);
      (ingredients || []).forEach((ing: { ingredient_name?: string; name?: string }) => {
        const name = ing.ingredient_name ?? ing.name;
        if (name && typeof name === 'string') ingredientNamesSet.add(name);
      });
      logger.dev('[Dish Image Generation] Fallback fetched ingredients by id:', {
        dishId,
        ingredientIdsCount: ingredientIds.length,
        namesFound: ingredients?.length ?? 0,
      });
    }
  }

  // Add ingredients from recipes
  recipeIngredientNamesSet.forEach(name => {
    ingredientNamesSet.add(name);
  });

  const ingredientNames = Array.from(ingredientNamesSet);

  logger.dev('[Dish Image Generation] Aggregated ingredients:', {
    dishId,
    directIngredientsCount: dishIngredients.length,
    recipesCount: dishRecipes.length,
    totalUniqueIngredients: ingredientNames.length,
  });

  return {
    ingredientNames,
    recipeInstructions,
  };
}
