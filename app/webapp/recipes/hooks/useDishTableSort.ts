'use client';

import { useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';

export type DishSortField = 'name' | 'selling_price' | 'cost' | 'profit_margin' | 'created';

interface UseDishTableSortOptions {
  sortField: DishSortField;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: DishSortField, direction: 'asc' | 'desc') => void;
}

export function useDishTableSort({
  sortField,
  sortDirection,
  onSortChange,
}: UseDishTableSortOptions) {
  const handleColumnSort = useCallback(
    (column: DishSortField) => {
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
    (column: DishSortField): React.ReactNode => {
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
