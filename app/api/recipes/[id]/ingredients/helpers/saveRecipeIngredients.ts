import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Save recipe ingredients (with optional update mode).
 *
 * @param {string} recipeId - Recipe ID
 * @param {Array} ingredients - Ingredients array
 * @param {boolean} isUpdate - If true, delete existing ingredients first
 * @returns {Promise<Array>} Saved recipe ingredients
 * @throws {Error} If save fails
 */
export async function saveRecipeIngredients(
  recipeId: string,
  ingredients: any[],
  isUpdate: boolean,
): Promise<any[]> {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  // If updating, delete existing ingredients first
  if (isUpdate) {
    const { error: deleteError } = await supabaseAdmin
      .from('recipe_ingredients')
      .delete()
      .eq('recipe_id', recipeId);

    if (deleteError) {
      logger.error('[Recipes API] Database error deleting existing ingredients:', {
        error: deleteError.message,
        code: (deleteError as any).code,
        context: { endpoint: '/api/recipes/[id]/ingredients', operation: 'POST', recipeId },
      });
      throw ApiErrorHandler.fromSupabaseError(deleteError, 500);
    }
  }

  // Insert new ingredients
  const recipeIngredientInserts = ingredients.map(ing => ({
    recipe_id: recipeId,
    ingredient_id: ing.ingredient_id,
    quantity: ing.quantity,
    unit: ing.unit,
  }));

  const { data, error: ingredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .insert(recipeIngredientInserts)
    .select();

  if (ingredientsError) {
    logger.error('[Recipes API] Database error saving recipe ingredients:', {
      error: ingredientsError.message,
      code: (ingredientsError as any).code,
      context: { endpoint: '/api/recipes/[id]/ingredients', operation: 'POST', recipeId },
    });
    throw ApiErrorHandler.fromSupabaseError(ingredientsError, 500);
  }

  return data || [];
}
