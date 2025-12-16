'use client';

import { useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';

export type PerformanceSortField =
  | 'name'
  | 'number_sold'
  | 'popularity_percentage'
  | 'total_revenue'
  | 'total_cost'
  | 'total_profit'
  | 'gross_profit_percentage'
  | 'profit_category'
  | 'popularity_category'
  | 'menu_item_class';

interface UsePerformanceTableSortOptions {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
}

export function usePerformanceTableSort({
  sortBy,
  sortOrder,
  onSortChange,
}: UsePerformanceTableSortOptions) {
  const handleColumnSort = useCallback(
    (column: PerformanceSortField) => {
      if (sortBy === column) {
        // Toggle direction if same column
        onSortChange(column, sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        // New column, default to descending for most columns
        const defaultOrder = column === 'name' ? 'asc' : 'desc';
        onSortChange(column, defaultOrder);
      }
    },
    [sortBy, sortOrder, onSortChange],
  );

  const getSortIcon = useCallback(
    (column: PerformanceSortField): React.ReactNode => {
      if (sortBy !== column) {
        return null;
      }

      if (sortOrder === 'asc') {
        return React.createElement(Icon, {
          icon: ChevronUp,
          size: 'xs',
          className: 'ml-1 text-[var(--primary)]',
          'aria-hidden': true,
        });
      }

      return React.createElement(Icon, {
        icon: ChevronDown,
        size: 'xs',
        className: 'ml-1 text-[var(--primary)]',
        'aria-hidden': true,
      });
    },
    [sortBy, sortOrder],
  );

  return {
    handleColumnSort,
    getSortIcon,
  };
}
