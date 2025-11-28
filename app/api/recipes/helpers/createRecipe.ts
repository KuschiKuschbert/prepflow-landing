/**
 * Helper to create a new recipe.
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
 * Create a new recipe (handles both recipe_name and name columns).
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
    // Try recipe_name first (newer schema)
    const insertResult = await supabaseAdmin
      .from('recipes')
      .insert({ recipe_name: name.trim(), ...recipeData })
      .select()
      .single();

    if (insertResult.error && (insertResult.error as any).code === '42703') {
      // Column doesn't exist, try name (older schema)
      logger.warn('[Recipes API] recipe_name column not found, trying name column');
      const fallbackResult = await supabaseAdmin
        .from('recipes')
        .insert({ name: name.trim(), ...recipeData })
        .select()
        .single();
      return {
        recipe: fallbackResult.data,
        error: fallbackResult.error,
      };
    }

    return {
      recipe: insertResult.data,
      error: insertResult.error,
    };
  } catch (insertErr) {
    logger.error('[Recipes API] Error during recipe insert:', insertErr);
    return {
      recipe: null,
      error: insertErr,
    };
  }
}
