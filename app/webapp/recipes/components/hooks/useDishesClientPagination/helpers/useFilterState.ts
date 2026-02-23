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

export type UnifiedItemTypeFilter = 'all' | 'dish' | 'recipe';

export interface UnifiedFilters {
  searchTerm: string;
  sortField: UnifiedSortField;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
  itemType: UnifiedItemTypeFilter;
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
    itemType: 'all',
  });

  const updateFilters = (updates: Partial<UnifiedFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      // Reset to page 1 when changing search, sort, or item type
      currentPage:
        updates.searchTerm !== undefined ||
        updates.sortField !== undefined ||
        updates.sortDirection !== undefined ||
        updates.itemType !== undefined
          ? 1
          : (updates.currentPage ?? prev.currentPage),
    }));
  };

  return { filters, updateFilters };
}
