/**
 * Helper to combine dishes and recipes into unified items.
 */

import type { Dish, Recipe } from '@/lib/types/recipes';
import type { UnifiedFilters } from './useFilterState';

export type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

/**
 * Combine dishes and recipes into unified items.
 * Filters by itemType when not 'all'.
 */
export function combineItems(
  filteredAndSortedDishes: Dish[],
  filteredAndSortedRecipes: Recipe[],
  filters: UnifiedFilters,
): UnifiedItem[] {
  const dishItems: UnifiedItem[] =
    filters.itemType === 'recipe'
      ? []
      : filteredAndSortedDishes.map(d => ({
          ...d,
          itemType: 'dish' as const,
        }));
  const recipeItems: UnifiedItem[] =
    filters.itemType === 'dish'
      ? []
      : filteredAndSortedRecipes.map(r => ({
          ...r,
          itemType: 'recipe' as const,
        }));

  const combined =
    filters.itemType === 'all' ? [...dishItems, ...recipeItems] : [...dishItems, ...recipeItems];

  // Sort by name if sortField is 'name', otherwise keep separate groups (dishes first, then recipes)
  if (filters.sortField === 'name' && combined.length > 0) {
    return [...combined].sort((a, b) => {
      const aName = (a.itemType === 'dish' ? a.dish_name || '' : a.recipe_name || '').toLowerCase();
      const bName = (b.itemType === 'dish' ? b.dish_name || '' : b.recipe_name || '').toLowerCase();
      return filters.sortDirection === 'asc'
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    });
  }

  return combined;
}
