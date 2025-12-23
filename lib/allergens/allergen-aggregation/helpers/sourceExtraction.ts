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

