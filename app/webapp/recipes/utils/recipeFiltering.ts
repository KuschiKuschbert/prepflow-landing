import { Recipe } from '../types';

export function filterRecipes(
  recipes: Recipe[],
  searchTerm: string,
  categoryFilter?: string,
): Recipe[] {
  let filtered = recipes;

  // Filter by category
  if (categoryFilter) {
    filtered = filtered.filter(recipe => recipe.category === categoryFilter);
  }

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  return filtered;
}
