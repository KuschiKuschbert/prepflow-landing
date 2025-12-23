import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { consolidateAllergens } from '../australian-allergens';
import { collectAllergensFromIngredients } from './collectAllergens';
import { cacheRecipeAllergens } from './cacheAllergens';
import { groupAllergensByRecipe, processAndCacheBatchAllergens } from './batchProcessRecipeAllergens';

/**
 * Aggregate allergens for a single recipe
 * Checks cache first, then aggregates from ingredients if needed
 *
 * @param {string} recipeId - Recipe ID
 * @param {boolean} force - Force aggregation even if cached allergens exist
 * @returns {Promise<string[]>} Aggregated allergens
 */
export async function aggregateRecipeAllergens(
  recipeId: string,
  force: boolean = false,
): Promise<string[]> {
  if (!supabaseAdmin) {
    logger.error('[Allergen Aggregation] Supabase admin client not available');
    return [];
  }

  try {
    // Check if recipe has cached allergens
    const { data: recipe, error: recipeError } = await supabaseAdmin
      .from('recipes')
      .select('allergens')
      .eq('id', recipeId)
      .single();

    if (recipeError) {
      logger.error('[Allergen Aggregation] Failed to fetch recipe:', {
        recipeId,
        error: recipeError.message,
      });
      return [];
    }

    // Return cached allergens if available and not forcing
    if (
      !force &&
      recipe?.allergens &&
      Array.isArray(recipe.allergens) &&
      recipe.allergens.length > 0
    ) {
      return recipe.allergens;
    }

    // Fetch all ingredients in recipe
    const { data: recipeIngredients, error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        ingredient_id,
        ingredients (
          allergens
        )
      `,
      )
      .eq('recipe_id', recipeId);

    if (ingredientsError) {
      logger.error('[Allergen Aggregation] Failed to fetch recipe ingredients:', {
        recipeId,
        error: ingredientsError.message,
      });
      return [];
    }

    if (!recipeIngredients || recipeIngredients.length === 0) {
      // No ingredients, cache empty array
      await cacheRecipeAllergens(recipeId, []);
      return [];
    }

    // Collect, consolidate, and cache allergens
    const allergenSet = collectAllergensFromIngredients(recipeIngredients);
    const allergens = consolidateAllergens(Array.from(allergenSet)).sort();
    await cacheRecipeAllergens(recipeId, allergens);

    return allergens;
  } catch (err) {
    logger.error('[Allergen Aggregation] Error aggregating recipe allergens:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { recipeId, operation: 'aggregateRecipeAllergens' },
    });
    return [];
  }
}

/**
 * Batch aggregate allergens for multiple recipes
 * Uses single query for efficiency
 */
export async function batchAggregateRecipeAllergens(
  recipeIds: string[],
): Promise<Record<string, string[]>> {
  if (!supabaseAdmin || recipeIds.length === 0) {
    return {};
  }

  try {
    // Fetch all recipe ingredients for multiple recipes in single query
    const { data: recipeIngredients, error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        recipe_id,
        ingredient_id,
        ingredients (
          allergens
        )
      `,
      )
      .in('recipe_id', recipeIds);

    if (ingredientsError) {
      logger.error('[Allergen Aggregation] Failed to batch fetch recipe ingredients:', {
        recipeIds,
        error: ingredientsError.message,
      });
      return {};
    }

    // Group by recipe_id and aggregate allergens
    const allergensByRecipe = groupAllergensByRecipe(recipeIngredients || [], recipeIds);

    // Process and cache results
    const result = await processAndCacheBatchAllergens(allergensByRecipe);

    return result;
  } catch (err) {
    logger.error('[Allergen Aggregation] Error batch aggregating recipe allergens:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { recipeIds, operation: 'batchAggregateRecipeAllergens' },
    });
    return {};
  }
}
