/**
 * Aggregate ingredients from dish and recipes
 * Combines direct dish ingredients with recipe ingredients
 */

import { logger } from '@/lib/logger';
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
  dishIngredients.forEach(di => {
    const ingredient = di.ingredient as Record<string, any> | undefined;
    if (ingredient) {
      const name = ingredient.ingredient_name || ingredient.name;
      if (name && typeof name === 'string') {
        ingredientNamesSet.add(name);
      }
    }
  });

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
