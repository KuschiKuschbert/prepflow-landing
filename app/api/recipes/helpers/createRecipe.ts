/**
 * Helper to create a new recipe.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface RecipeData {
  yield: number;
  yield_unit: string;
  description: string | null;
  instructions: string | null;
}

/**
 * Create a new recipe.
 */
export async function createRecipe(
  name: string,
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

  try {
    const { data, error } = await supabaseAdmin
      .from('recipes')
      .insert({ name: name.trim(), ...recipeData })
      .select()
      .single();

    if (error) {
      logger.error('[Recipes API] Database error creating recipe:', {
        error: error.message,
        code: (error as any).code,
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
