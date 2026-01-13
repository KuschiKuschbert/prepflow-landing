/**
 * Helper for fetching dish recipes
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { DishRecipe } from '@/types/dish';
import { RecipeRecord } from '../../types';

/**
 * Fetches recipes for a dish
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<DishRecipe[]>} Valid dish recipes
 */
export async function fetchDishRecipes(dishId: string): Promise<DishRecipe[]> {
  if (!supabaseAdmin) {
    logger.error('[Dishes API] Database connection not available for fetchDishRecipes');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  logger.dev('[fetchDishRecipes] Starting fetch for dishId:', { dishId });
  logger.dev('[fetchDishRecipes] Using supabaseAdmin:', { available: !!supabaseAdmin });

  // Fetch dish_recipes separately to avoid nested relation issues (same approach as audit endpoint)
  const { data: dishRecipesData, error: dishRecipesError } = await supabaseAdmin
    .from('dish_recipes')
    .select('recipe_id, quantity')
    .eq('dish_id', dishId);

  // Log error if present (but don't fail the whole request)
  if (dishRecipesError) {
    logger.warn('[Dishes API] Error fetching dish recipes (non-fatal):', {
      error: dishRecipesError.message,
      code: dishRecipesError.code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
    return [];
  }

  if (!dishRecipesData || dishRecipesData.length === 0) {
    logger.dev('[Dishes API] No dish_recipes found for dish:', { dishId });
    return [];
  }

  // Fetch recipe details separately
  const recipeIds = dishRecipesData.map(dr => dr.recipe_id).filter(Boolean);
  if (recipeIds.length === 0) {
    logger.warn('[Dishes API] No valid recipe_ids found in dish_recipes:', { dishId });
    return [];
  }

  // Fetch recipe details - use both 'name' and 'recipe_name' column (database uses 'name', not 'recipe_name')
  const { data: recipesData, error: recipesError } = await supabaseAdmin
    .from('recipes')
    .select('id, name, recipe_name, description, yield, yield_unit, instructions')
    .in('id', recipeIds);

  if (recipesError) {
    logger.warn('[Dishes API] Error fetching recipe details (non-fatal):', {
      error: recipesError.message,
      code: recipesError.code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
  }

  // Create a map of recipe_id -> recipe data
  const recipesMap = new Map<string, any>(
    (recipesData || []).map(r => {
      const recipeRecord = r as unknown as RecipeRecord;
      return [
        r.id,
        {
          id: r.id,
          name: recipeRecord.name || '',
          recipe_name: recipeRecord.recipe_name || '',
          description: r.description,
          yield: r.yield,
          yield_unit: r.yield_unit,
          instructions: r.instructions,
        },
      ];
    }),
  );

  // Combine dish_recipes with recipe data
  const validDishRecipes = dishRecipesData
    .filter(dr => {
      const hasRecipe = recipesMap.has(dr.recipe_id);
      if (!hasRecipe && dr.recipe_id) {
        logger.warn('[Dishes API] dish_recipes entry references non-existent recipe:', {
          dishId,
          recipeId: dr.recipe_id,
        });
      }
      return hasRecipe;
    })
    .map((dr, index) => {
      const recipeData = recipesMap.get(dr.recipe_id);
      return {
        id: `temp-${index}`,
        dish_id: dishId,
        recipe_id: dr.recipe_id,
        quantity: typeof dr.quantity === 'string' ? parseFloat(dr.quantity) : dr.quantity,
        recipes: recipeData,
      };
    });

  return validDishRecipes as unknown as DishRecipe[];
}
