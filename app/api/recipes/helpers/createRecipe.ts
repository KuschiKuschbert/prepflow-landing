/**
 * Helper to create a new recipe.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

import { CreateRecipeInput, Recipe } from './schemas';

/**
 * Create a new recipe.
 */
export async function createRecipe(
  recipe_name: string,
  recipeData: CreateRecipeInput,
  userId: string,
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

  try {
    const { data, error } = await supabaseAdmin
      .from('recipes')
      .insert({ ...recipeData, user_id: userId }) // Fixed: Removed duplicate 'name' field
      .select()
      .single();

    if (error) {
      logger.error('[Recipes API] Database error creating recipe:', {
        error: error.message,
        code: error.code,
      });
    }

    return { recipe: data, error };
  } catch (insertErr) {
    logger.error('[Recipes API] Error during recipe insert:', insertErr);
    return {
      recipe: null,
      error: insertErr,
    };
  }
}
