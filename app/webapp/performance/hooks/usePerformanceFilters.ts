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
  });

  const filteredAndSortedItems = useMemo(() => {
    let filtered = performanceItems.filter(item =>
      item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
    );

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'gross_profit_percentage':
          aValue = a.gross_profit_percentage;
          bValue = b.gross_profit_percentage;
          break;
        case 'number_sold':
          aValue = a.number_sold;
          bValue = b.number_sold;
          break;
        case 'popularity_percentage':
          aValue = a.popularity_percentage;
          bValue = b.popularity_percentage;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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
  }, [performanceItems, filters.searchTerm, filters.sortBy, filters.sortOrder]);

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
      // Reset to page 1 when changing search or sort
      currentPage:
        updates.searchTerm !== undefined ||
        updates.sortBy !== undefined ||
        updates.sortOrder !== undefined
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
