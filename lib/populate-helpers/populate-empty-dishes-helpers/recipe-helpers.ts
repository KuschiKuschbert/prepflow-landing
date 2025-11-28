/**
 * Recipe helper functions.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { IngredientMatch } from './types';
import { getDefaultIngredientsForDish } from './dish-ingredients';

/**
 * Get default ingredients for a recipe based on name patterns
 * Similar to dishes but with recipe-specific quantities
 */
export function getDefaultIngredientsForRecipe(
  recipeName: string,
  availableIngredients: Array<{ id: string; ingredient_name: string; unit: string }>,
): IngredientMatch[] {
  // Reuse dish logic since recipes and dishes have similar patterns
  return getDefaultIngredientsForDish(recipeName, availableIngredients);
}

/**
 * Check if a recipe has ingredients
 */
export async function recipeHasIngredients(recipeId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  const { data: recipeIngredients, error: riError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('id')
    .eq('recipe_id', recipeId)
    .limit(1);

  if (riError && riError.code !== 'PGRST116') {
    logger.warn('[recipeHasIngredients] Error checking recipe_ingredients:', {
      recipeId,
      error: riError.message,
    });
  }

  return (recipeIngredients && recipeIngredients.length > 0) || false;
}
