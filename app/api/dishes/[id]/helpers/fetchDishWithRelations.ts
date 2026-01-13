import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { DishWithRelations } from '../../helpers/schemas';
import { fetchDishIngredients } from './fetchDishIngredients';
import { fetchDishRecipes } from './fetchDishRecipes';

/**
 * Fetch dish with recipes and ingredients.
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<DishWithRelations>} Dish with recipes and ingredients
 * @throws {Error} If dish not found or database error
 */
export async function fetchDishWithRelations(dishId: string): Promise<DishWithRelations> {
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

  // Fetch dish recipes and ingredients in parallel
  const [validDishRecipes, validDishIngredients] = await Promise.all([
    fetchDishRecipes(dishId),
    fetchDishIngredients(dishId),
  ]);

  return {
    ...dish,
    recipes: validDishRecipes,
    ingredients: validDishIngredients,
  } as DishWithRelations;
}
