/**
 * Helper to update an existing recipe.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

export interface RecipeData {
  yield: number;
  yield_unit: string;
  category: string;
  description: string | null;
  instructions: string | null;
}

/**
 * Update an existing recipe.
 */
export async function updateRecipe(
  recipeId: number,
  recipeData: RecipeData,
): Promise<{ recipe: any; error: any }> {
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
      code: (updateError as any).code,
      context: { endpoint: '/api/recipes', operation: 'PUT', recipeId },
    });
  }

  return {
    recipe: updatedRecipe,
    error: updateError,
  };
}
