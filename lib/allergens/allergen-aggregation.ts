/**
 * Allergen aggregation utilities
 * Aggregates allergens from ingredients up to recipe and dish level
 * Uses PostgreSQL JSONB operations for efficient aggregation
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getAllergenDisplayName, consolidateAllergens } from './australian-allergens';
import { invalidateDietaryCache } from '@/lib/dietary/dietary-aggregation';

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
      await supabaseAdmin.from('recipes').update({ allergens: [] }).eq('id', recipeId);
      return [];
    }

    // Collect all allergens from ingredients
    const allergenSet = new Set<string>();
    recipeIngredients.forEach(ri => {
      const ingredient = ri.ingredients as { allergens?: string[] } | null;
      // Handle null, undefined, empty arrays, and non-array values gracefully
      if (
        ingredient?.allergens &&
        Array.isArray(ingredient.allergens) &&
        ingredient.allergens.length > 0
      ) {
        ingredient.allergens.forEach(allergen => {
          // Only add valid string allergens
          if (typeof allergen === 'string' && allergen.length > 0) {
            allergenSet.add(allergen);
          }
        });
      }
    });

    // Consolidate allergens (map old codes to new and deduplicate)
    const allergens = consolidateAllergens(Array.from(allergenSet)).sort();

    // Cache the result
    await supabaseAdmin.from('recipes').update({ allergens }).eq('id', recipeId);

    // Invalidate dietary cache when allergens change (forces recalculation)
    await invalidateDietaryCache(recipeId, 'recipe');

    return allergens;
  } catch (err) {
    logger.error('[Allergen Aggregation] Error aggregating recipe allergens:', err);
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
    const allergensByRecipe: Record<string, Set<string>> = {};
    recipeIds.forEach(id => {
      allergensByRecipe[id] = new Set<string>();
    });

    recipeIngredients?.forEach(ri => {
      const ingredient = ri.ingredients as { allergens?: string[] } | null;
      // Handle null, undefined, empty arrays, and non-array values gracefully
      if (
        ingredient?.allergens &&
        Array.isArray(ingredient.allergens) &&
        ingredient.allergens.length > 0
      ) {
        const recipeId = ri.recipe_id as string;
        if (allergensByRecipe[recipeId]) {
          ingredient.allergens.forEach(allergen => {
            // Only add valid string allergens
            if (typeof allergen === 'string' && allergen.length > 0) {
              allergensByRecipe[recipeId].add(allergen);
            }
          });
        }
      }
    });

    // Convert Sets to arrays and cache results
    const result: Record<string, string[]> = {};
    const updates: Array<{ id: string; allergens: string[] }> = [];

    Object.entries(allergensByRecipe).forEach(([recipeId, allergenSet]) => {
      // Consolidate allergens (map old codes to new and deduplicate)
      const allergens = consolidateAllergens(Array.from(allergenSet)).sort();
      result[recipeId] = allergens;
      updates.push({ id: recipeId, allergens });
    });

    // Batch update cache in database
    if (updates.length > 0) {
      await Promise.all(
        updates.map(update =>
          supabaseAdmin!
            .from('recipes')
            .update({ allergens: update.allergens })
            .eq('id', update.id)
            .then(({ error }) => {
              if (error) {
                logger.error('[Allergen Aggregation] Failed to cache allergens:', {
                  recipeId: update.id,
                  error: error.message,
                });
              } else {
                // Invalidate dietary cache when allergens change
                invalidateDietaryCache(update.id, 'recipe').catch(err => {
                  logger.error('[Allergen Aggregation] Failed to invalidate dietary cache:', {
                    recipeId: update.id,
                    error: err instanceof Error ? err.message : String(err),
                  });
                });
              }
            }),
        ),
      );
    }

    return result;
  } catch (err) {
    logger.error('[Allergen Aggregation] Error batch aggregating recipe allergens:', err);
    return {};
  }
}

/**
 * Aggregate allergens for a single dish
 * Aggregates from both dish recipes and dish ingredients
 *
 * @param {string} dishId - Dish ID
 * @param {boolean} force - Force aggregation even if cached allergens exist
 * @returns {Promise<string[]>} Aggregated allergens
 */
export async function aggregateDishAllergens(
  dishId: string,
  force: boolean = false,
): Promise<string[]> {
  if (!supabaseAdmin) {
    logger.error('[Allergen Aggregation] Supabase admin client not available');
    return [];
  }

  try {
    // Check if dish has cached allergens
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('allergens')
      .eq('id', dishId)
      .single();

    if (dishError) {
      // Dishes table might not exist, return empty
      return [];
    }

    // Return cached allergens if available and not forcing
    if (!force && dish?.allergens && Array.isArray(dish.allergens) && dish.allergens.length > 0) {
      return dish.allergens;
    }

    const allergenSet = new Set<string>();

    // Fetch allergens from dish recipes
    const { data: dishRecipes, error: recipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        recipe_id,
        recipes (
          allergens
        )
      `,
      )
      .eq('dish_id', dishId);

    if (!recipesError && dishRecipes) {
      dishRecipes.forEach(dr => {
        const recipe = dr.recipes as { allergens?: string[] } | null;
        // Handle null, undefined, empty arrays, and non-array values gracefully
        if (recipe?.allergens && Array.isArray(recipe.allergens) && recipe.allergens.length > 0) {
          recipe.allergens.forEach(allergen => {
            // Only add valid string allergens
            if (typeof allergen === 'string' && allergen.length > 0) {
              allergenSet.add(allergen);
            }
          });
        }
      });
    }

    // Fetch allergens from dish ingredients
    const { data: dishIngredients, error: ingredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        ingredient_id,
        ingredients (
          allergens
        )
      `,
      )
      .eq('dish_id', dishId);

    if (!ingredientsError && dishIngredients) {
      dishIngredients.forEach(di => {
        const ingredient = di.ingredients as { allergens?: string[] } | null;
        // Handle null, undefined, empty arrays, and non-array values gracefully
        if (
          ingredient?.allergens &&
          Array.isArray(ingredient.allergens) &&
          ingredient.allergens.length > 0
        ) {
          ingredient.allergens.forEach(allergen => {
            // Only add valid string allergens
            if (typeof allergen === 'string' && allergen.length > 0) {
              allergenSet.add(allergen);
            }
          });
        }
      });
    }

    // Consolidate allergens (map old codes to new and deduplicate)
    const allergens = consolidateAllergens(Array.from(allergenSet)).sort();

    // Cache the result
    await supabaseAdmin.from('dishes').update({ allergens }).eq('id', dishId);

    // Invalidate dietary cache when allergens change (forces recalculation)
    await invalidateDietaryCache(dishId, 'dish');

    return allergens;
  } catch (err) {
    logger.error('[Allergen Aggregation] Error aggregating dish allergens:', err);
    return [];
  }
}

/**
 * Get display names for allergen codes
 */
export function getAllergenDisplayNames(allergenCodes: string[]): string[] {
  return allergenCodes.map(code => getAllergenDisplayName(code));
}

/**
 * Extract allergen sources from ingredients
 * Maps allergen codes to ingredient names
 *
 * @param {Array<{ ingredient_name: string; allergens?: string[] }>} ingredients - Array of ingredients with allergen data
 * @returns {Record<string, string[]>} Map of allergen codes to ingredient names
 */
export function extractAllergenSources(
  ingredients: Array<{ ingredient_name: string; allergens?: string[] }>,
): Record<string, string[]> {
  const sources: Record<string, string[]> = {};

  ingredients.forEach(ingredient => {
    if (!ingredient.allergens || !Array.isArray(ingredient.allergens)) return;

    ingredient.allergens.forEach(allergen => {
      if (typeof allergen === 'string' && allergen.length > 0) {
        if (!sources[allergen]) {
          sources[allergen] = [];
        }
        if (!sources[allergen].includes(ingredient.ingredient_name)) {
          sources[allergen].push(ingredient.ingredient_name);
        }
      }
    });
  });

  return sources;
}

/**
 * Merge allergen sources from multiple sources
 * Combines multiple allergen source records, deduplicating ingredient names
 *
 * @param {...Record<string, string[]>} sources - Multiple allergen source records to merge
 * @returns {Record<string, string[]>} Merged allergen sources
 */
export function mergeAllergenSources(
  ...sources: Record<string, string[]>[]
): Record<string, string[]> {
  const merged: Record<string, string[]> = {};

  sources.forEach(source => {
    Object.entries(source).forEach(([allergen, ingredientNames]) => {
      if (!merged[allergen]) {
        merged[allergen] = [];
      }
      ingredientNames.forEach(name => {
        if (!merged[allergen].includes(name)) {
          merged[allergen].push(name);
        }
      });
    });
  });

  return merged;
}
