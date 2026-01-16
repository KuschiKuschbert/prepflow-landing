import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { EnrichedDish } from '@/types/dish';
import { DishRecord } from '../../types';

import { fetchDishIngredients } from './fetchDishIngredients';
import { fetchDishRecipes } from './fetchDishRecipes';

/**
 * Fetch dish with recipes and ingredients.
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<EnrichedDish>} Dish with recipes and ingredients
 * @throws {Error} If dish not found or database error
 */
export async function fetchDishWithRelations(dishId: string): Promise<EnrichedDish> {

  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Fetch dish
  const { data: dish, error: dishError } = await supabaseAdmin
    .from('dishes')
    .select('*')
    .eq('id', dishId)
    .single();

  if (dishError) {
    logger.error('[Dishes API] Database error fetching dish:', {
      error: dishError.message,
      code: dishError.code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
    throw ApiErrorHandler.fromSupabaseError(dishError, 404);
  }

  if (!dish) {
    throw ApiErrorHandler.createError('Dish not found', 'NOT_FOUND', 404, { dishId });
  }

  // Fetch dish recipes
  const validDishRecipes = await fetchDishRecipes(dishId);

  logger.dev('[fetchDishWithRelations] After fetchDishRecipes:', {
    dishId,
    validDishRecipesCount: validDishRecipes.length,
    validDishRecipes: JSON.stringify(validDishRecipes),
  });

  // Fetch dish ingredients
  const validDishIngredients = await fetchDishIngredients(dishId);

  // Log additional debug info for ingredients
  const dishData = dish as unknown as DishRecord;
  logger.debug('[Dishes API] Fetched dish:', {
    dishId,
    dishName: dishData.dish_name,
    recipeCount: validDishRecipes.length,
    ingredientCount: validDishIngredients.length,
    recipes: validDishRecipes,
  });


  return {
    ...dish,
    recipes: validDishRecipes,
    ingredients: validDishIngredients,
  } as EnrichedDish;

}
