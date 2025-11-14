'use client';

import { useState, useMemo } from 'react';
import { PerformanceItem, PerformanceFilters as PerformanceFiltersType } from '../types';

export function usePerformanceFilters(performanceItems: PerformanceItem[]) {
  const [filters, setFilters] = useState<PerformanceFiltersType>({
    searchTerm: '',
    sortBy: 'gross_profit_percentage',
    sortOrder: 'desc',
    currentPage: 1,
    itemsPerPage: 20,
    menuItemClass: [],
  });

  const filteredAndSortedItems = useMemo(() => {
    let filtered = performanceItems.filter(item => {
      // Search filter
      const matchesSearch = item.name.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Menu item class filter
      const matchesClass =
        !filters.menuItemClass ||
        filters.menuItemClass.length === 0 ||
        filters.menuItemClass.includes(item.menu_item_class);

      return matchesSearch && matchesClass;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'number_sold':
          aValue = a.number_sold;
          bValue = b.number_sold;
          break;
        case 'popularity_percentage':
          aValue = a.popularity_percentage;
          bValue = b.popularity_percentage;
          break;
        case 'total_revenue':
          aValue = (a.selling_price * a.number_sold) / 1.1;
          bValue = (b.selling_price * b.number_sold) / 1.1;
          break;
        case 'total_cost':
          aValue = a.food_cost * a.number_sold;
          bValue = b.food_cost * b.number_sold;
          break;
        case 'total_profit':
          aValue = a.gross_profit * a.number_sold;
          bValue = b.gross_profit * b.number_sold;
          break;
        case 'gross_profit_percentage':
          aValue = a.gross_profit_percentage;
          bValue = b.gross_profit_percentage;
          break;
        case 'profit_category':
          aValue = a.profit_category;
          bValue = b.profit_category;
          break;
        case 'popularity_category':
          aValue = a.popularity_category;
          bValue = b.popularity_category;
          break;
        case 'menu_item_class':
          aValue = a.menu_item_class;
          bValue = b.menu_item_class;
          break;
        default:
          aValue = a.gross_profit_percentage;
          bValue = b.gross_profit_percentage;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [performanceItems, filters.searchTerm, filters.sortBy, filters.sortOrder, filters.menuItemClass]);

  const paginatedItems = useMemo(() => {
    const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
    const endIndex = startIndex + filters.itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, endIndex);
  }, [filteredAndSortedItems, filters.currentPage, filters.itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / filters.itemsPerPage);

  const updateFilters = (updates: Partial<PerformanceFiltersType>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      // Reset to page 1 when changing search, sort, or filters
      currentPage:
        updates.searchTerm !== undefined ||
        updates.sortBy !== undefined ||
        updates.sortOrder !== undefined ||
        updates.menuItemClass !== undefined
          ? 1
          : prev.currentPage,
    }));
  };

  return {
    filters,
    updateFilters,
    filteredAndSortedItems,
    paginatedItems,
    totalPages,
  };
}
