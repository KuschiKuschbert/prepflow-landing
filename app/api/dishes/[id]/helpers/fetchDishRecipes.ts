/**
 * Helper for fetching dish recipes
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Fetches recipes for a dish
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<any[]>} Valid dish recipes
 */
export async function fetchDishRecipes(dishId: string): Promise<any[]> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  logger.dev('[fetchDishRecipes] Starting fetch for dishId:', { dishId });
  logger.dev('[fetchDishRecipes] Using supabaseAdmin:', { available: !!supabaseAdmin });

  // Fetch dish_recipes separately to avoid nested relation issues (same approach as audit endpoint)
  // Note: Using same query format as audit endpoint (select only recipe_id, quantity)
  const { data: dishRecipesData, error: dishRecipesError } = await supabaseAdmin
    .from('dish_recipes')
    .select('recipe_id, quantity')
    .eq('dish_id', dishId);

  logger.dev('[fetchDishRecipes] Query result:', {
    dishId,
    dishRecipesDataCount: dishRecipesData?.length || 0,
    dishRecipesData: JSON.stringify(dishRecipesData),
    error: dishRecipesError?.message,
    errorCode: (dishRecipesError as any)?.code,
  });

  // Log error if present (but don't fail the whole request)
  if (dishRecipesError) {
    logger.warn('[Dishes API] Error fetching dish recipes (non-fatal):', {
      error: dishRecipesError.message,
      code: (dishRecipesError as any).code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
    return [];
  }

  // Log raw query result for debugging
  logger.dev('[Dishes API] Raw dish_recipes query result:', {
    dishId,
    dishRecipesDataCount: dishRecipesData?.length || 0,
    dishRecipesData: dishRecipesData,
    hasError: !!dishRecipesError,
  });

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

  // Fetch recipe details - use 'name' column (database uses 'name', not 'recipe_name')
  const { data: recipesData, error: recipesError } = await supabaseAdmin
    .from('recipes')
    .select('id, name, description, yield, yield_unit')
    .in('id', recipeIds);

  if (recipesError) {
    logger.warn('[Dishes API] Error fetching recipe details (non-fatal):', {
      error: recipesError.message,
      code: (recipesError as any).code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
  }

  // Create a map of recipe_id -> recipe data
  // Handle both 'name' and 'recipe_name' columns (database uses 'name', but some code expects 'recipe_name')
  const recipesMap = new Map(
    (recipesData || []).map(r => {
      const recipeName = (r as any).recipe_name || (r as any).name || 'Unknown';
      return [
        r.id,
        {
          id: r.id,
          recipe_name: recipeName,
          name: recipeName, // Include both for compatibility
          description: r.description,
          yield: r.yield,
          yield_unit: r.yield_unit,
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
    .map((dr, index) => ({
      id: `temp-${index}`, // Generate temp ID since we don't fetch it
      recipe_id: dr.recipe_id,
      quantity: dr.quantity,
      recipes: recipesMap.get(dr.recipe_id),
    }));

  logger.dev('[Dishes API] Fetched dish recipes:', {
    dishId,
    count: validDishRecipes.length,
    recipeIds: recipeIds,
    foundRecipes: recipesData?.length || 0,
    sample: validDishRecipes[0],
  });

  return validDishRecipes;
}
