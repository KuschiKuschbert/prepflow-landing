import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Update dish ingredients by deleting existing and inserting new ones.
 *
 * @param {string} dishId - Dish ID
 * @param {Array} ingredients - Array of ingredient objects with ingredient_id, quantity, and unit
 * @throws {Error} If database connection is not available or update fails
 */
export async function updateDishIngredients(
  dishId: string,
  ingredients: Array<{ ingredient_id: string; quantity: number; unit: string }>,
) {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const { error: deleteError } = await supabaseAdmin
    .from('dish_ingredients')
    .delete()
    .eq('dish_id', dishId);
  if (deleteError) {
    logger.error('[Dishes API] Database error deleting dish ingredients:', {
      error: deleteError.message,
      code: deleteError.code,
      context: { dishId, operation: 'updateDishIngredients' },
    });
    throw ApiErrorHandler.fromSupabaseError(deleteError, 500);
  }

  if (ingredients.length > 0) {
    const dishIngredients = ingredients.map(i => ({
      dish_id: dishId,
      ingredient_id: i.ingredient_id,
      quantity: typeof i.quantity === 'string' ? parseFloat(i.quantity) : i.quantity,
      unit: i.unit,
    }));
    const { error: insertError } = await supabaseAdmin
      .from('dish_ingredients')
      .insert(dishIngredients);
    if (insertError) {
      logger.error('[Dishes API] Database error inserting dish ingredients:', {
        error: insertError.message,
        code: insertError.code,
        context: { dishId, operation: 'updateDishIngredients' },
      });
      throw ApiErrorHandler.fromSupabaseError(insertError, 500);
    }
  }
}
