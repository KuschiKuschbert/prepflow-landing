import { logger } from '@/lib/logger';
import { consolidateAllergens } from '../../australian-allergens';
import { cacheRecipeAllergens } from './cacheAllergens';

/**
 * Process batch recipe allergens and group by recipe ID
 *
 * @param {Array<{ recipe_id: string; ingredients?: { allergens?: string[] } | null }>} recipeIngredients - Recipe ingredients with allergen data
 * @param {string[]} recipeIds - Recipe IDs to process
 * @returns {Record<string, string[]>} Map of recipe IDs to allergen arrays
 */
export function groupAllergensByRecipe(
  recipeIngredients: Array<{
    recipe_id: string;
    ingredients?: { allergens?: string[] } | null;
  }>,
  recipeIds: string[],
): Record<string, Set<string>> {
  const allergensByRecipe: Record<string, Set<string>> = {};
  recipeIds.forEach(id => {
    allergensByRecipe[id] = new Set<string>();
  });

  recipeIngredients.forEach(ri => {
    const ingredient = ri.ingredients;
    if (
      ingredient?.allergens &&
      Array.isArray(ingredient.allergens) &&
      ingredient.allergens.length > 0
    ) {
      const recipeId = ri.recipe_id as string;
      if (allergensByRecipe[recipeId]) {
        ingredient.allergens.forEach(allergen => {
          if (typeof allergen === 'string' && allergen.length > 0) {
            allergensByRecipe[recipeId].add(allergen);
          }
        });
      }
    }
  });

  return allergensByRecipe;
}

/**
 * Process and cache batch recipe allergens
 *
 * @param {Record<string, Set<string>>} allergensByRecipe - Map of recipe IDs to allergen sets
 * @returns {Promise<Record<string, string[]>>} Map of recipe IDs to consolidated allergen arrays
 */
export async function processAndCacheBatchAllergens(
  allergensByRecipe: Record<string, Set<string>>,
): Promise<Record<string, string[]>> {
  const result: Record<string, string[]> = {};
  const updates: Array<{ id: string; allergens: string[] }> = [];

  Object.entries(allergensByRecipe).forEach(([recipeId, allergenSet]) => {
    const allergens = consolidateAllergens(Array.from(allergenSet)).sort();
    result[recipeId] = allergens;
    updates.push({ id: recipeId, allergens });
  });

  // Batch update cache in database
  if (updates.length > 0) {
    await Promise.all(
      updates.map(update =>
        cacheRecipeAllergens(update.id, update.allergens).catch(err => {
          logger.error('[Allergen Aggregation] Failed to cache allergens:', {
            recipeId: update.id,
            error: err instanceof Error ? err.message : String(err),
          });
        }),
      ),
    );
  }

  return result;
}
