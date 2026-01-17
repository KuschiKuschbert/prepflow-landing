/**
 * Helper to filter and sort dishes.
 */

import type { Dish, DishCostData } from '@/app/webapp/recipes/types';
import type { UnifiedFilters } from './useFilterState';

/**
 * Filter and sort dishes based on filters.
 */
export function filterAndSortDishes(
  dishes: Dish[],
  dishCosts: Map<string, DishCostData>,
  filters: UnifiedFilters,
): Dish[] {
  const filtered = dishes.filter(dish =>
    dish.dish_name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
  );

  filtered.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (filters.sortField) {
      case 'name':
        aValue = a.dish_name.toLowerCase();
        bValue = b.dish_name.toLowerCase();
        break;
      case 'selling_price':
        aValue = a.selling_price;
        bValue = b.selling_price;
        break;
      case 'cost':
      case 'contributing_margin':
        // Both 'cost' and 'contributing_margin' now sort by contributing margin
        aValue = dishCosts.get(a.id)?.contributingMargin || 0;
        bValue = dishCosts.get(b.id)?.contributingMargin || 0;
        break;
      case 'profit_margin':
        aValue = dishCosts.get(a.id)?.gross_profit_margin || 0;
        bValue = dishCosts.get(b.id)?.gross_profit_margin || 0;
        break;
      case 'created':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      default:
        // For recipe-only fields, dishes sort by name
        aValue = a.dish_name.toLowerCase();
        bValue = b.dish_name.toLowerCase();
    }

    if (filters.sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
}
