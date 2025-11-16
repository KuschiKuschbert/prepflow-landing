import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Fetch dish with recipes and ingredients.
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<Object>} Dish with recipes and ingredients
 * @throws {Error} If dish not found or database error
 */
export async function fetchDishWithRelations(dishId: string) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  // Fetch dish
  const { data: dish, error: dishError } = await supabaseAdmin
    .from('dishes')
    .select('*')
    .eq('id', dishId)
    .single();

  if (dishError) {
    logger.error('[Dishes API] Database error fetching dish:', {
      error: dishError.message,
      code: (dishError as any).code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
    throw ApiErrorHandler.fromSupabaseError(dishError, 404);
  }

  if (!dish) {
    throw ApiErrorHandler.createError('Dish not found', 'NOT_FOUND', 404, { dishId });
  }

  // Fetch dish recipes
  const { data: dishRecipes } = await supabaseAdmin
    .from('dish_recipes')
    .select(
      `
      id,
      recipe_id,
      quantity,
      recipes (
        id,
        name,
        description,
        yield,
        yield_unit
      )
    `,
    )
    .eq('dish_id', dishId);

  // Fetch dish ingredients
  const { data: dishIngredients } = await supabaseAdmin
    .from('dish_ingredients')
    .select(
      `
      id,
      ingredient_id,
      quantity,
      unit,
      ingredients (
        id,
        ingredient_name,
        cost_per_unit,
        cost_per_unit_incl_trim,
        trim_peel_waste_percentage,
        yield_percentage,
        unit,
        supplier_name,
        category
      )
    `,
    )
    .eq('dish_id', dishId);

  return {
    ...dish,
    recipes: dishRecipes || [],
    ingredients: dishIngredients || [],
  };
}
