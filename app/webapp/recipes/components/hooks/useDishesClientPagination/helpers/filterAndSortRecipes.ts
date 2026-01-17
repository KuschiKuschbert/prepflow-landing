/**
 * Helper to filter and sort recipes.
 */

import type { Recipe, RecipePriceData } from '@/app/webapp/recipes/types';
import { sortRecipes } from '@/app/webapp/recipes/utils/recipeSorting';
import type { UnifiedFilters, UnifiedSortField } from './useFilterState';

/**
 * Map unified sort fields to recipe sort fields.
 */
function mapSortFieldToRecipeField(
  sortField: UnifiedSortField,
): 'name' | 'recommended_price' | 'profit_margin' | 'contributing_margin' | 'created' {
  if (sortField === 'recommended_price') return 'recommended_price';
  if (sortField === 'contributing_margin') return 'contributing_margin';
  if (sortField === 'profit_margin') return 'profit_margin';
  if (sortField === 'created') return 'created';
  if (sortField === 'selling_price') return 'recommended_price'; // Map selling_price to recommended_price for recipes
  if (sortField === 'cost') return 'recommended_price'; // Map cost to recommended_price for recipes
  return 'name'; // default to name
}

/**
 * Filter and sort recipes based on filters.
 */
export function filterAndSortRecipes(
  recipes: Recipe[],
  recipePrices: Record<string, RecipePriceData>,
  filters: UnifiedFilters,
): Recipe[] {
  // Filter by search term first
  const filtered = recipes.filter(recipe =>
    recipe.recipe_name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
  );

  // Map unified sort fields to recipe sort fields
  const recipeSortField = mapSortFieldToRecipeField(filters.sortField);

  return sortRecipes(filtered, recipePrices, recipeSortField, filters.sortDirection);
}
