import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Update dish recipes by deleting existing and inserting new ones.
 *
 * @throws {Error} If database connection is not available or update fails
 */
export async function updateDishRecipes(
  dishId: string,
  recipes: Array<{ recipe_id: string; quantity?: number }>,
) {
  if (!supabaseAdmin)
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);

  const { error: deleteError } = await supabaseAdmin
    .from('dish_recipes')
    .delete()
    .eq('dish_id', dishId);
  if (deleteError) {
    logger.error('[Dishes API] Database error deleting dish recipes:', {
      error: deleteError.message,
      code: deleteError.code,
      context: { dishId, operation: 'updateDishRecipes' },
    });
    throw ApiErrorHandler.fromSupabaseError(deleteError, 500);
  }

  if (recipes.length > 0) {
    const dishRecipes = recipes.map(r => ({
      dish_id: dishId,
      recipe_id: r.recipe_id,
      quantity: r.quantity || 1,
    }));
    const { error: insertError } = await supabaseAdmin.from('dish_recipes').insert(dishRecipes);
    if (insertError) {
      logger.error('[Dishes API] Database error inserting dish recipes:', {
        error: insertError.message,
        code: insertError.code,
        context: { dishId, operation: 'updateDishRecipes' },
      });
      throw ApiErrorHandler.fromSupabaseError(insertError, 500);
    }
  }
}
