import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { Recipe, UpdateRecipeInput } from './schemas';

/**
 * Update an existing recipe.
 */
export async function updateRecipe(
  recipeId: string | number,
  recipeData: UpdateRecipeInput,
): Promise<{ recipe: Recipe | null; error: unknown }> {
  if (!supabaseAdmin) {
    return {
      recipe: null,
      error: ApiErrorHandler.createError(
        'Database connection not available',
        'DATABASE_ERROR',
        500,
      ),
    };
  }

  const { data: updatedRecipe, error: updateError } = await supabaseAdmin
    .from('recipes')
    .update({ ...recipeData, updated_at: new Date().toISOString() })
    .eq('id', recipeId)
    .select()
    .single();

  if (updateError) {
    logger.error('[Recipes API] Database error updating recipe:', {
      error: updateError.message,
      code: updateError.code,
      context: { endpoint: '/api/recipes', operation: 'PUT', recipeId },
    });
  }

  return {
    recipe: updatedRecipe as Recipe | null,
    error: updateError,
  };
}
