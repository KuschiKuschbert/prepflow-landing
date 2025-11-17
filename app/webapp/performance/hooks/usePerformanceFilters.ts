'use client';

import { useMemo, useState } from 'react';
import { PerformanceFilters as PerformanceFiltersType, PerformanceItem } from '../types';
import { filterPerformanceItems } from '../utils/performanceFiltering';
import { sortPerformanceItems } from '../utils/performanceSorting';

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
    const filtered = filterPerformanceItems(performanceItems, filters);
    return sortPerformanceItems(filtered, filters.sortBy, filters.sortOrder);
  }, [performanceItems, filters]);

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
