'use client';

import { useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';

export type RecipeSortField = 'name' | 'recommended_price' | 'profit_margin' | 'contributing_margin' | 'created';

interface UseRecipeTableSortOptions {
  sortField: RecipeSortField;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: RecipeSortField, direction: 'asc' | 'desc') => void;
}

export function useRecipeTableSort({
  sortField,
  sortDirection,
  onSortChange,
}: UseRecipeTableSortOptions) {
  const handleColumnSort = useCallback(
    (column: RecipeSortField) => {
      if (sortField === column) {
        // Toggle direction if same column
        onSortChange(column, sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        // New column, default to ascending for name/created, descending for numeric
        const defaultOrder = column === 'name' || column === 'created' ? 'asc' : 'desc';
        onSortChange(column, defaultOrder);
      }
    },
    [sortField, sortDirection, onSortChange],
  );

  const getSortIcon = useCallback(
    (column: RecipeSortField): React.ReactNode => {
      if (sortField !== column) {
        return null;
      }

      if (sortDirection === 'asc') {
        return React.createElement(Icon, {
          icon: ChevronUp,
          size: 'xs',
          className: 'ml-1 text-[#29E7CD]',
          'aria-hidden': true,
        });
      }

      return React.createElement(Icon, {
        icon: ChevronDown,
        size: 'xs',
        className: 'ml-1 text-[#29E7CD]',
        'aria-hidden': true,
      });
    },
    [sortField, sortDirection],
  );

  return {
    handleColumnSort,
    getSortIcon,
  };
}
