/**
 * Helper to check if a recipe already exists.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface ExistingRecipeResult {
  recipe: unknown | null;
  error: unknown | null;
}

/**
 * Check if recipe already exists (handles both recipe_name and name columns).
 */
export async function checkExistingRecipe(name: string): Promise<ExistingRecipeResult> {
  if (!supabaseAdmin) {
    return { recipe: null, error: new Error('Database connection not available') };
  }

  // Try recipe_name first (newer schema)
  const { data: checkData, error: checkError } = await supabaseAdmin
    .from('recipes')
    .select('id, recipe_name, name')
    .ilike('recipe_name', name.trim());

  if (checkError && checkError.code === '42703') {
    // Column doesn't exist, try name (older schema)
    const { data: fallbackData, error: fallbackError } = await supabaseAdmin
      .from('recipes')
      .select('id, name')
      .ilike('name', name.trim());
    if (fallbackError && fallbackError.code !== '42703') {
      logger.error('[Recipes API] Error checking existing recipe (fallback):', {
        error: fallbackError.message,
        recipeName: name,
        context: { endpoint: '/api/recipes/helpers/checkExistingRecipe' },
      });
    }
    return {
      recipe: fallbackData && fallbackData.length > 0 ? fallbackData[0] : null,
      error: fallbackError,
    };
  }

  if (checkError && checkError.code !== '42703') {
    logger.error('[Recipes API] Error checking existing recipe:', {
      error: checkError.message,
      recipeName: name,
      context: { endpoint: '/api/recipes/helpers/checkExistingRecipe' },
    });
  }

  return {
    recipe: checkData && checkData.length > 0 ? checkData[0] : null,
    error: checkError,
  };
}
