import { Recipe } from '../types';

export function filterRecipes(
  recipes: Recipe[],
  searchTerm: string,
  categoryFilter?: string,
  excludeAllergens?: string[],
  includeAllergens?: string[],
  vegetarian?: boolean,
  vegan?: boolean,
): Recipe[] {
  let filtered = recipes;

  // Filter by category
  if (categoryFilter) {
    filtered = filtered.filter(recipe => recipe.category === categoryFilter);
  }

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(recipe =>
      recipe.recipe_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  // Filter by excluded allergens (recipes that don't contain these allergens)
  if (excludeAllergens && excludeAllergens.length > 0) {
    filtered = filtered.filter(recipe => {
      const recipeAllergens = recipe.allergens || [];
      return !excludeAllergens.some(allergen => recipeAllergens.includes(allergen));
    });
  }

  // Filter by included allergens (recipes that contain at least one of these allergens)
  if (includeAllergens && includeAllergens.length > 0) {
    filtered = filtered.filter(recipe => {
      const recipeAllergens = recipe.allergens || [];
      return includeAllergens.some(allergen => recipeAllergens.includes(allergen));
    });
  }

  // Filter by vegetarian
  if (vegetarian === true) {
    filtered = filtered.filter(recipe => recipe.is_vegetarian === true);
  }

  // Filter by vegan
  if (vegan === true) {
    filtered = filtered.filter(recipe => recipe.is_vegan === true);
  }

  return filtered;
}
