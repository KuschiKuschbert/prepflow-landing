import { useMemo } from 'react';
import { Dish, DishCostData, Recipe, RecipePriceData } from '@/lib/types/recipes';
import { useFilterState } from './useDishesClientPagination/helpers/useFilterState';
import { filterAndSortDishes } from './useDishesClientPagination/helpers/filterAndSortDishes';
import { filterAndSortRecipes } from './useDishesClientPagination/helpers/filterAndSortRecipes';
import { combineItems } from './useDishesClientPagination/helpers/combineItems';
import { paginateItems } from './useDishesClientPagination/helpers/paginateItems';

interface UseDishesClientPaginationProps {
  dishes: Dish[];
  recipes: Recipe[];
  dishCosts: Map<string, DishCostData>;
  recipePrices?: Record<string, RecipePriceData>;
}

export function useDishesClientPagination({
  dishes,
  recipes,
  dishCosts,
  recipePrices = {},
}: UseDishesClientPaginationProps) {
  const { filters, updateFilters } = useFilterState();

  // Filter and sort dishes
  const filteredAndSortedDishes = useMemo(
    () => filterAndSortDishes(dishes, dishCosts, filters),
    [dishes, dishCosts, filters],
  );

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(
    () => filterAndSortRecipes(recipes, recipePrices, filters),
    [recipes, recipePrices, filters],
  );

  // Combine and sort unified items
  const allItems = useMemo(
    () => combineItems(filteredAndSortedDishes, filteredAndSortedRecipes, filters),
    [filteredAndSortedDishes, filteredAndSortedRecipes, filters],
  );

  // Paginate unified items
  const { paginatedItems, paginatedDishesList, paginatedRecipesList, totalPages } = useMemo(
    () => paginateItems(allItems, filters.currentPage, filters.itemsPerPage),
    [allItems, filters.currentPage, filters.itemsPerPage],
  );

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
