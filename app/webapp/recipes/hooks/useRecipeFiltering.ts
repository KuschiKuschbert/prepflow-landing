'use client';

import { useState, useMemo } from 'react';
import { Recipe, RecipePriceData } from '../types';

export type RecipeSortField = 'name' | 'recommended_price' | 'profit_margin' | 'contributing_margin' | 'created';

interface RecipeFilters {
  searchTerm: string;
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
    sortField: 'name',
    sortDirection: 'asc',
    currentPage: 1,
    itemsPerPage: 20,
  });

  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
    );

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'recommended_price':
          aValue = recipePrices[a.id]?.recommendedPrice || 0;
          bValue = recipePrices[b.id]?.recommendedPrice || 0;
          break;
        case 'profit_margin':
          aValue = recipePrices[a.id]?.gross_profit_margin || 0;
          bValue = recipePrices[b.id]?.gross_profit_margin || 0;
          break;
        case 'contributing_margin':
          aValue = recipePrices[a.id]?.contributingMargin || 0;
          bValue = recipePrices[b.id]?.contributingMargin || 0;
          break;
        case 'created':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (filters.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [recipes, recipePrices, filters.searchTerm, filters.sortField, filters.sortDirection]);

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
      // Reset to page 1 when changing search or sort
      currentPage:
        updates.searchTerm !== undefined ||
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
