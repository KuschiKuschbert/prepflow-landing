import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { DishRelationRecipe } from '../../helpers/schemas';

/**
 * Fetches recipes for a dish
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<DishRelationRecipe[]>} Valid dish recipes
 */
export async function fetchDishRecipes(dishId: string): Promise<DishRelationRecipe[]> {
  if (!supabaseAdmin) {
    logger.error('[Dishes API] Database connection not available for fetchDishRecipes');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Fetch dish_recipes separately
  const { data: dishRecipesData, error: dishRecipesError } = await supabaseAdmin
    .from('dish_recipes')
    .select('recipe_id, quantity')
    .eq('dish_id', dishId);

  if (dishRecipesError) {
    logger.warn('[Dishes API] Error fetching dish recipes (non-fatal):', {
      error: dishRecipesError.message,
      code: dishRecipesError.code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
    return [];
  }

  if (!dishRecipesData || dishRecipesData.length === 0) {
    return [];
  }

  // Fetch recipe details separately
  const recipeIds = dishRecipesData.map(dr => dr.recipe_id).filter(Boolean);
  if (recipeIds.length === 0) {
    return [];
  }

  const { data: recipesData, error: recipesError } = await supabaseAdmin
    .from('recipes')
    .select('id, name, description, yield, yield_unit, instructions')
    .in('id', recipeIds);

  if (recipesError) {
    logger.warn('[Dishes API] Error fetching recipe details (non-fatal):', {
      error: recipesError.message,
      code: recipesError.code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
  }

interface FetchRecipeResult {
  id: string;
  name: string;
  recipe_name?: string; // Potential legacy field
  description: string | null;
  yield: number | null;
  yield_unit: string | null;
  instructions: string | null;
}

  const recipesMap = new Map();
  ((recipesData as unknown as FetchRecipeResult[]) || []).forEach(r => {
    const recipeName = r.recipe_name || r.name || 'Unknown';
    recipesMap.set(r.id, {
      id: r.id,
      recipe_name: recipeName,
      name: recipeName,
      description: r.description,
      yield: r.yield,
      yield_unit: r.yield_unit,
      instructions: r.instructions,
    });
  });

  const validDishRecipes: DishRelationRecipe[] = dishRecipesData
    .filter(dr => recipesMap.has(dr.recipe_id))
    .map((dr, index) => ({
      id: `temp-${index}`,
      recipe_id: dr.recipe_id,
      quantity: dr.quantity || 1,
      recipes: recipesMap.get(dr.recipe_id),
    }));

  return validDishRecipes;
}
