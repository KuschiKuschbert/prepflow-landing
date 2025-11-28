import { useMemo, useState } from 'react';
import { Dish, DishCostData, Recipe, RecipePriceData } from '../../types';
import { sortRecipes } from '../../utils/recipeSorting';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });
type UnifiedSortField =
  | 'name'
  | 'selling_price'
  | 'cost'
  | 'profit_margin'
  | 'created'
  | 'recommended_price'
  | 'contributing_margin';

interface UnifiedFilters {
  searchTerm: string;
  sortField: UnifiedSortField;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

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
  const [filters, setFilters] = useState<UnifiedFilters>({
    searchTerm: '',
    sortField: 'name',
    sortDirection: 'asc',
    currentPage: 1,
    itemsPerPage: 20,
  });

  const updateFilters = (updates: Partial<UnifiedFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      // Reset to page 1 when changing search or sort
      currentPage:
        updates.searchTerm !== undefined ||
        updates.sortField !== undefined ||
        updates.sortDirection !== undefined
          ? 1
          : prev.currentPage,
    }));
  };

  // Sort dishes
  const filteredAndSortedDishes = useMemo(() => {
    let filtered = dishes.filter(dish =>
      dish.dish_name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
    );

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

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
  }, [dishes, dishCosts, filters.searchTerm, filters.sortField, filters.sortDirection]);

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    // Filter by search term first
    let filtered = recipes.filter(recipe =>
      recipe.recipe_name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
    );

    // Map unified sort fields to recipe sort fields
    // Recipes don't have 'selling_price' or 'cost', so map those to 'recommended_price'
    const recipeSortField:
      | 'name'
      | 'recommended_price'
      | 'profit_margin'
      | 'contributing_margin'
      | 'created' =
      filters.sortField === 'recommended_price'
        ? 'recommended_price'
        : filters.sortField === 'contributing_margin'
          ? 'contributing_margin'
          : filters.sortField === 'profit_margin'
            ? 'profit_margin'
            : filters.sortField === 'created'
              ? 'created'
              : filters.sortField === 'selling_price'
                ? 'recommended_price' // Map selling_price to recommended_price for recipes
                : filters.sortField === 'cost'
                  ? 'recommended_price' // Map cost to recommended_price for recipes
                  : 'name'; // default to name

    return sortRecipes(filtered, recipePrices, recipeSortField, filters.sortDirection);
  }, [recipes, recipePrices, filters.searchTerm, filters.sortField, filters.sortDirection]);

  // Combine and sort unified items
  const allItems: UnifiedItem[] = useMemo(() => {
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
  }, [filteredAndSortedDishes, filteredAndSortedRecipes, filters.sortField, filters.sortDirection]);

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
