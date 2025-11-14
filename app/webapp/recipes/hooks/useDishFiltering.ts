'use client';

import { useState, useMemo } from 'react';
import { Dish, DishCostData } from '../types';

export type DishSortField = 'name' | 'selling_price' | 'cost' | 'profit_margin' | 'created';

interface DishFilters {
  searchTerm: string;
  sortField: DishSortField;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

export function useDishFiltering(dishes: Dish[], dishCosts: Map<string, DishCostData>) {
  const [filters, setFilters] = useState<DishFilters>({
    searchTerm: '',
    sortField: 'name',
    sortDirection: 'asc',
    currentPage: 1,
    itemsPerPage: 20,
  });

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
          aValue = dishCosts.get(a.id)?.total_cost || 0;
          bValue = dishCosts.get(b.id)?.total_cost || 0;
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

  const paginatedDishes = useMemo(() => {
    const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
    const endIndex = startIndex + filters.itemsPerPage;
    return filteredAndSortedDishes.slice(startIndex, endIndex);
  }, [filteredAndSortedDishes, filters.currentPage, filters.itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedDishes.length / filters.itemsPerPage);

  const updateFilters = (updates: Partial<DishFilters>) => {
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
    filteredAndSortedDishes,
    paginatedDishes,
    totalPages,
  };
}
