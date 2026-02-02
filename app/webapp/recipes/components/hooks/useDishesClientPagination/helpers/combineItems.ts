/**
 * Helper to combine dishes and recipes into unified items.
 */

import type { Dish, Recipe } from '@/lib/types/recipes';
import type { UnifiedFilters } from './useFilterState';

export type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

/**
 * Combine dishes and recipes into unified items.
 */
export function combineItems(
  filteredAndSortedDishes: Dish[],
  filteredAndSortedRecipes: Recipe[],
  filters: UnifiedFilters,
): UnifiedItem[] {
  const dishItems: UnifiedItem[] = filteredAndSortedDishes.map(d => ({
    ...d,
    itemType: 'dish' as const,
  }));
  const recipeItems: UnifiedItem[] = filteredAndSortedRecipes.map(r => ({
    ...r,
    itemType: 'recipe' as const,
  }));

  // Combine and sort by name if sortField is 'name', otherwise keep separate groups
  if (filters.sortField === 'name') {
    return [...dishItems, ...recipeItems].sort((a, b) => {
      const aName = (a.itemType === 'dish' ? a.dish_name : a.recipe_name).toLowerCase();
      const bName = (b.itemType === 'dish' ? b.dish_name : b.recipe_name).toLowerCase();
      return filters.sortDirection === 'asc'
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    });
  }

  // For other sort fields, keep dishes and recipes separate (they have different sort fields)
  // Dishes first, then recipes
  return [...dishItems, ...recipeItems];
}
