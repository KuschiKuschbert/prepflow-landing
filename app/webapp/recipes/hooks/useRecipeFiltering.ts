'use client';

import { useMemo, useState } from 'react';
import { Recipe, RecipePriceData } from '../types';
import { filterRecipes } from '../utils/recipeFiltering';
import { sortRecipes } from '../utils/recipeSorting';

export type RecipeSortField = 'name' | 'recommended_price' | 'profit_margin' | 'contributing_margin' | 'created';

interface RecipeFilters {
  searchTerm: string;
  categoryFilter: string;
  sortField: RecipeSortField;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

export function useRecipeFiltering(
  recipes: Recipe[],
  recipePrices: Record<string, RecipePriceData>,
) {
  const [filters, setFilters] = useState<RecipeFilters>({
    searchTerm: '',
    categoryFilter: '',
    sortField: 'name',
    sortDirection: 'asc',
    currentPage: 1,
    itemsPerPage: 20,
  });

  const filteredAndSortedRecipes = useMemo(() => {
    const filtered = filterRecipes(recipes, filters.searchTerm, filters.categoryFilter);
    return sortRecipes(filtered, recipePrices, filters.sortField, filters.sortDirection);
  }, [
    recipes,
    recipePrices,
    filters.searchTerm,
    filters.categoryFilter,
    filters.sortField,
    filters.sortDirection,
  ]);

  const paginatedRecipes = useMemo(() => {
    const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
    const endIndex = startIndex + filters.itemsPerPage;
    return filteredAndSortedRecipes.slice(startIndex, endIndex);
  }, [filteredAndSortedRecipes, filters.currentPage, filters.itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedRecipes.length / filters.itemsPerPage);

  const updateFilters = (updates: Partial<RecipeFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      // Reset to page 1 when changing search, category, or sort
      currentPage:
        updates.searchTerm !== undefined ||
        updates.categoryFilter !== undefined ||
        updates.sortField !== undefined ||
        updates.sortDirection !== undefined
          ? 1
          : prev.currentPage,
    }));
  };

  return {
    filters,
    updateFilters,
    filteredAndSortedRecipes,
    paginatedRecipes,
    totalPages,
  };
}
