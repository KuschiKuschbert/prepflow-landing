/**
 * Helper to filter recipes by allergens and enrich with allergen data.
 */

import type { Recipe } from '@/app/webapp/recipes/types';

/**
 * Filter recipes by include allergens and enrich with allergen data.
 */
export async function filterRecipes(
  recipes: Recipe[],
  includeAllergens: string[],
): Promise<Recipe[]> {
  let filteredRecipes = recipes || [];

  // Filter by include allergens (client-side)
  if (includeAllergens.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe => {
      const recipeAllergens = (recipe.allergens as string[]) || [];
      return includeAllergens.some(allergen => recipeAllergens.includes(allergen));
    });
  }

  // Enrich recipes needing allergens
  const recipesNeedingAllergens = filteredRecipes.filter(
    r => !r.allergens || (Array.isArray(r.allergens) && r.allergens.length === 0),
  );

  if (recipesNeedingAllergens.length > 0) {
    const { batchAggregateRecipeAllergens } = await import('@/lib/allergens/allergen-aggregation');
    const recipeIds = recipesNeedingAllergens.map(r => r.id);
    const allergensByRecipe = await batchAggregateRecipeAllergens(recipeIds);
    filteredRecipes = filteredRecipes.map(recipe => {
      if (allergensByRecipe[recipe.id]) {
        return { ...recipe, allergens: allergensByRecipe[recipe.id] };
      }
      return recipe;
    });
  }

  // Map recipes to ensure recipe_name field exists
  return filteredRecipes.map(recipe => ({
    ...recipe,
    recipe_name: (recipe as any).name || (recipe as any).recipe_name,
  }));
}
