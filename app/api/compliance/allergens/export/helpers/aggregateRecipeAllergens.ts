/**
 * Recipe allergen aggregation helper
 */

import { batchAggregateRecipeAllergens } from '@/lib/allergens/allergen-aggregation';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getRecipeIngredientSources } from './dataFetchers';

export interface RecipeAllergenData {
  allergensByRecipe: Record<string, string[]>;
  recipeIngredientSources: Record<string, Record<string, string[]>>;
}

interface InputRecipe {
  id: string;
  name?: string;
}

/**
 * Aggregates allergens for recipes
 *
 * @param {InputRecipe[]} recipes - Array of recipe objects
 * @returns {Promise<RecipeAllergenData>} Aggregated allergen data
 */
export async function aggregateRecipeAllergens(
  recipes: InputRecipe[],
): Promise<RecipeAllergenData> {
  // Batch aggregate allergens for recipes
  let allergensByRecipe: Record<string, string[]> = {};
  try {
    const recipeIds = (recipes || []).map(r => r.id);
    allergensByRecipe = await batchAggregateRecipeAllergens(recipeIds);
  } catch (err) {
    logger.warn('[Allergen Export] Error batch aggregating recipe allergens:', err);
  }

  if (!supabaseAdmin) {
    logger.error('[Allergen Export] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Fetch ingredient sources for recipes
  // Fetch ingredient sources for recipes
  const recipeIds = (recipes || []).map(r => r.id);
  const recipeIngredientSources = await getRecipeIngredientSources(recipeIds);

  return { allergensByRecipe, recipeIngredientSources };
}
