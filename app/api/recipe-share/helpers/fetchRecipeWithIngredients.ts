import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Fetch recipe with ingredients for sharing.
 *
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<Object>} Recipe with ingredients
 * @throws {Error} If recipe not found
 */
export async function fetchRecipeWithIngredients(recipeId: string) {
  if (!supabaseAdmin)
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);

  const { data: recipe, error: recipeError } = await supabaseAdmin
    .from('recipes')
    .select(
      `
      *,
      recipe_ingredients (
        id,
        ingredient_id,
        quantity,
        unit,
        notes,
        ingredients (
          id,
          ingredient_name,
          name,
          unit,
          category
        )
      )
    `,
    )
    .eq('id', recipeId)
    .single();

  if (recipeError || !recipe) {
    const err = recipeError as { code?: string; message?: string };
    logger.error('Error fetching recipe:', {
      error: err.message,
      id: recipeId,
      code: err.code,
      context: { endpoint: '/api/recipe-share', operation: 'POST', recipeId },
    });
    throw ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404, {
      message: "couldn't find the specified recipe",
    });
  }

  return recipe;
}
