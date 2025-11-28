/**
 * Helper to check if a recipe already exists.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export interface ExistingRecipeResult {
  recipe: any | null;
  error: any | null;
}

/**
 * Check if recipe already exists (handles both recipe_name and name columns).
 */
export async function checkExistingRecipe(name: string): Promise<ExistingRecipeResult> {
  if (!supabaseAdmin) {
    return { recipe: null, error: new Error('Database connection not available') };
  }

  // Try recipe_name first (newer schema)
  const checkResult = await supabaseAdmin
    .from('recipes')
    .select('id, recipe_name, name')
    .ilike('recipe_name', name.trim());

  if (checkResult.error && (checkResult.error as any).code === '42703') {
    // Column doesn't exist, try name (older schema)
    const fallbackResult = await supabaseAdmin
      .from('recipes')
      .select('id, name')
      .ilike('name', name.trim());
    return {
      recipe: fallbackResult.data && fallbackResult.data.length > 0 ? fallbackResult.data[0] : null,
      error: fallbackResult.error,
    };
  }

  return {
    recipe: checkResult.data && checkResult.data.length > 0 ? checkResult.data[0] : null,
    error: checkResult.error,
  };
}
