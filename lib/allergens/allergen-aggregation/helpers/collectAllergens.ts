/**
 * Helper function to collect allergens from ingredient data
 * Handles null, undefined, empty arrays, and non-array values gracefully
 *
 * @param {Array<{ ingredients?: { allergens?: string[] } | null }>} items - Array of items with ingredient data
 * @returns {Set<string>} Set of allergen codes
 */
export function collectAllergensFromIngredients(
  items: Array<{ ingredients?: { allergens?: string[] } | null }>,
): Set<string> {
  const allergenSet = new Set<string>();

  items.forEach(item => {
    const ingredient = item.ingredients;
    if (
      ingredient?.allergens &&
      Array.isArray(ingredient.allergens) &&
      ingredient.allergens.length > 0
    ) {
      ingredient.allergens.forEach(allergen => {
        if (typeof allergen === 'string' && allergen.length > 0) {
          allergenSet.add(allergen);
        }
      });
    }
  });

  return allergenSet;
}

/**
 * Helper function to collect allergens from recipe data
 * Handles null, undefined, empty arrays, and non-array values gracefully
 *
 * @param {Array<{ recipes?: { allergens?: string[] } | null }>} items - Array of items with recipe data
 * @returns {Set<string>} Set of allergen codes
 */
export function collectAllergensFromRecipes(
  items: Array<{ recipes?: { allergens?: string[] } | null }>,
): Set<string> {
  const allergenSet = new Set<string>();

  items.forEach(item => {
    const recipe = item.recipes;
    if (recipe?.allergens && Array.isArray(recipe.allergens) && recipe.allergens.length > 0) {
      recipe.allergens.forEach(allergen => {
        if (typeof allergen === 'string' && allergen.length > 0) {
          allergenSet.add(allergen);
        }
      });
    }
  });

  return allergenSet;
}

