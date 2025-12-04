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
  if (!supabaseAdmin) throw new Error('Database connection not available');

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
    logger.error('[Recipe Share API] Error fetching recipe:', {
      error: recipeError?.message,
      code: (recipeError as any)?.code,
      context: { endpoint: '/api/recipe-share', operation: 'POST', recipeId },
    });
    throw ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404, {
      message: "couldn't find the specified recipe",
    });
  }

  return recipe;
}
