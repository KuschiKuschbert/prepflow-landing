import { batchAggregateRecipeAllergens } from '@/lib/allergens/allergen-aggregation';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface RecipeAggregationResult {
  total: number;
  aggregated: number;
  results: Record<string, string[]>;
}

/**
 * Fetches all recipes and forces allergen re-aggregation.
 */
export async function reAggregateRecipes(): Promise<RecipeAggregationResult> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // Fetch all recipe IDs
  const { data: recipes, error: recipesError } = await supabaseAdmin.from('recipes').select('id');

  if (recipesError) {
    logger.error('[Re-aggregate All Allergens API] Error fetching recipes:', {
      error: recipesError.message,
      code: recipesError.code,
      context: { endpoint: '/api/allergens/re-aggregate-all', operation: 'POST' },
    });
    throw new Error('Failed to fetch recipes');
  }

  const recipeIds = (recipes || []).map(r => r.id);
  const result: RecipeAggregationResult = {
    total: recipeIds.length,
    aggregated: 0,
    results: {},
  };

  if (recipeIds.length > 0) {
    try {
      result.results = await batchAggregateRecipeAllergens(recipeIds);
      result.aggregated = Object.keys(result.results).length;
      logger.dev(
        `[Re-aggregate All Allergens API] Successfully re-aggregated allergens for ${result.aggregated} recipes`,
      );
    } catch (err) {
      logger.error('[Re-aggregate All Allergens API] Error batch aggregating recipe allergens:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        context: {
          endpoint: '/api/allergens/re-aggregate-all',
          operation: 'batchAggregateRecipeAllergens',
          recipeCount: recipeIds.length,
        },
      });
    }
  }

  return result;
}
