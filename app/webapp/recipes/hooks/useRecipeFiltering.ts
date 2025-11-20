'use client';

import { useMemo, useState } from 'react';
import { Recipe, RecipePriceData } from '../types';
import { filterRecipes } from '../utils/recipeFiltering';
import { sortRecipes } from '../utils/recipeSorting';

export type RecipeSortField =
  | 'name'
  | 'recommended_price'
  | 'profit_margin'
  | 'contributing_margin'
  | 'created';

export interface RecipeFilters {
  searchTerm: string;
  categoryFilter: string;
  excludeAllergens: string[];
  includeAllergens: string[];
  vegetarian: boolean;
  vegan: boolean;
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
    excludeAllergens: [],
    includeAllergens: [],
    vegetarian: false,
    vegan: false,
    sortField: 'name',
    sortDirection: 'asc',
    currentPage: 1,
    itemsPerPage: 20,
  });

  const filteredAndSortedRecipes = useMemo(() => {
    const filtered = filterRecipes(
      recipes,
      filters.searchTerm,
      filters.categoryFilter,
      filters.excludeAllergens,
      filters.includeAllergens,
      filters.vegetarian,
      filters.vegan,
    );
    return sortRecipes(filtered, recipePrices, filters.sortField, filters.sortDirection);
  }, [recipes, recipePrices, filters]);

  const paginatedRecipes = useMemo(() => {
    const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
    const endIndex = startIndex + filters.itemsPerPage;
    return filteredAndSortedRecipes.slice(startIndex, endIndex);
  }, [filteredAndSortedRecipes, filters.currentPage, filters.itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedRecipes.length / filters.itemsPerPage);

  const updateFilters = (updates: Partial<RecipeFilters>) => {
    const resetPageFields = [
      'searchTerm',
      'categoryFilter',
      'excludeAllergens',
      'includeAllergens',
      'vegetarian',
      'vegan',
      'sortField',
      'sortDirection',
    ];
    const shouldResetPage = Object.keys(updates).some(key => resetPageFields.includes(key));
    setFilters(prev => ({
      ...prev,
      ...updates,
      currentPage: shouldResetPage ? 1 : prev.currentPage,
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
