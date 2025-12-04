/**
 * Helper for invalidating and re-aggregating allergen caches
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Invalidates and re-aggregates allergen caches for affected recipes and dishes
 *
 * @param {any[]} ingredients - Processed ingredients
 * @returns {Promise<void>}
 */
export async function invalidateAndReaggregate(ingredients: any[]): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  const { invalidateRecipesWithIngredient, invalidateDishesWithIngredient } =
    await import('@/lib/allergens/cache-invalidation');
  const { batchAggregateRecipeAllergens } = await import('@/lib/allergens/allergen-aggregation');
  const { aggregateDishAllergens } = await import('@/lib/allergens/allergen-aggregation');

  // Collect all affected recipe and dish IDs
  const affectedRecipeIds = new Set<string>();
  const affectedDishIds = new Set<string>();

  // Invalidate caches and collect affected IDs
  await Promise.all(
    ingredients.map(async ingredient => {
      // Invalidate caches
      await Promise.all([
        invalidateRecipesWithIngredient(ingredient.id),
        invalidateDishesWithIngredient(ingredient.id),
      ]);

      // Find all recipes using this ingredient
      const { data: recipeIngredients } = await supabaseAdmin!
        .from('recipe_ingredients')
        .select('recipe_id')
        .eq('ingredient_id', ingredient.id);
      if (recipeIngredients) {
        recipeIngredients.forEach(ri => affectedRecipeIds.add(ri.recipe_id));
      }

      // Find all dishes using this ingredient
      const { data: dishIngredients } = await supabaseAdmin!
        .from('dish_ingredients')
        .select('dish_id')
        .eq('ingredient_id', ingredient.id);
      if (dishIngredients) {
        dishIngredients.forEach(di => affectedDishIds.add(di.dish_id));
      }
    }),
  );

  // Re-aggregate allergens for all affected recipes and dishes
  logger.dev(
    `[Detect Missing Allergens API] Re-aggregating allergens for ${affectedRecipeIds.size} recipes and ${affectedDishIds.size} dishes`,
  );

  // Batch aggregate recipes
  if (affectedRecipeIds.size > 0) {
    try {
      await batchAggregateRecipeAllergens(Array.from(affectedRecipeIds));
      logger.dev(
        `[Detect Missing Allergens API] Successfully re-aggregated allergens for ${affectedRecipeIds.size} recipes`,
      );
    } catch (err) {
      logger.error('[Detect Missing Allergens API] Error batch aggregating recipe allergens:', err);
    }
  }

  // Aggregate dishes (in parallel, but one by one since no batch function)
  if (affectedDishIds.size > 0) {
    try {
      await Promise.all(
        Array.from(affectedDishIds).map(dishId => aggregateDishAllergens(dishId, true)),
      );
      logger.dev(
        `[Detect Missing Allergens API] Successfully re-aggregated allergens for ${affectedDishIds.size} dishes`,
      );
    } catch (err) {
      logger.error('[Detect Missing Allergens API] Error aggregating dish allergens:', err);
    }
  }
}
