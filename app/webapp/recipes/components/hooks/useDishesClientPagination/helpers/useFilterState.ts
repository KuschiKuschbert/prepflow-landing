/**
 * Hook for managing filter state.
 */

import { useState } from 'react';

export type UnifiedSortField =
  | 'name'
  | 'selling_price'
  | 'cost'
  | 'profit_margin'
  | 'created'
  | 'recommended_price'
  | 'contributing_margin';

export interface UnifiedFilters {
  searchTerm: string;
  sortField: UnifiedSortField;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

/**
 * Hook for managing filter state.
 */
export function useFilterState() {
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

  return { filters, updateFilters };
}
