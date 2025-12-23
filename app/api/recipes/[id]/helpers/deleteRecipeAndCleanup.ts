import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Delete a recipe and clean up related references.
 *
 * @param {string} recipeId - Recipe ID to delete
 * @throws {Error} If deletion fails
 */
export async function deleteRecipeAndCleanup(recipeId: string) {
  if (!supabaseAdmin) throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);

  const { error: ingredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .delete()
    .eq('recipe_id', recipeId);
  if (ingredientsError) {
    logger.error('[RecipeDelete] Database error deleting recipe ingredients:', {
      error: ingredientsError.message,
      code: (ingredientsError as any).code,
      context: { endpoint: '/api/recipes/[id]', operation: 'DELETE', recipeId },
    });
    throw ApiErrorHandler.fromSupabaseError(ingredientsError, 500);
  }

  const { error: cleanupError } = await supabaseAdmin
    .from('menu_dishes')
    .update({ recipe_id: null })
    .eq('recipe_id', recipeId);
  if (cleanupError) {
    logger.warn('[RecipeDelete] Warning: Could not clean up menu_dishes references:', {
      error: cleanupError.message,
      context: { endpoint: '/api/recipes/[id]', operation: 'DELETE', recipeId },
    });
  }

  const { error: recipeError } = await supabaseAdmin.from('recipes').delete().eq('id', recipeId);
  if (recipeError) {
    logger.error('[RecipeDelete] Database error deleting recipe:', {
      error: recipeError.message,
      code: (recipeError as any).code,
      context: { endpoint: '/api/recipes/[id]', operation: 'DELETE', recipeId },
    });
    throw ApiErrorHandler.fromSupabaseError(recipeError, 500);
  }
}
