import { useMemo } from 'react';
import { Dish, Recipe, DishCostData } from '../../types';
import { useDishFiltering } from '../../hooks/useDishFiltering';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

interface UseDishesClientPaginationProps {
  dishes: Dish[];
  recipes: Recipe[];
  dishCosts: Map<string, DishCostData>;
}

export function useDishesClientPagination({
  dishes,
  recipes,
  dishCosts,
}: UseDishesClientPaginationProps) {
  const { filters, updateFilters } = useDishFiltering(dishes, dishCosts);

  // Combine dishes and recipes for unified display
  const allItems: UnifiedItem[] = useMemo(
    () => [
      ...dishes.map(d => ({ ...d, itemType: 'dish' as const })),
      ...recipes.map(r => ({ ...r, itemType: 'recipe' as const })),
    ],
    [dishes, recipes],
  );

  // Paginate unified items
  const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
  const endIndex = startIndex + filters.itemsPerPage;
  const paginatedItems = useMemo(
    () => allItems.slice(startIndex, endIndex),
    [allItems, startIndex, endIndex],
  );

  // Separate paginated dishes and recipes
  const paginatedDishesList = useMemo(() => {
    return paginatedItems.filter(item => item.itemType === 'dish') as (Dish & {
      itemType: 'dish';
    })[];
  }, [paginatedItems]);

  const paginatedRecipesList = useMemo(() => {
    return paginatedItems.filter(item => item.itemType === 'recipe') as (Recipe & {
      itemType: 'recipe';
    })[];
  }, [paginatedItems]);

  const totalPages = Math.ceil(allItems.length / filters.itemsPerPage);

  return {
    allItems,
    paginatedItems,
    paginatedDishesList,
    paginatedRecipesList,
    filters,
    updateFilters,
    totalPages,
  };
}
