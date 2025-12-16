'use client';

import { useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';

export type COGSSortField = 'ingredient_name' | 'quantity' | 'cost';

interface UseCOGSTableSortOptions {
  sortField: COGSSortField;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: COGSSortField, direction: 'asc' | 'desc') => void;
}

export function useCOGSTableSort({
  sortField,
  sortDirection,
  onSortChange,
}: UseCOGSTableSortOptions) {
  const handleColumnSort = useCallback(
    (column: COGSSortField) => {
      if (sortField === column) {
        // Toggle direction if same column
        onSortChange(column, sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        // New column, default to ascending for name, descending for numeric
        const defaultOrder = column === 'ingredient_name' ? 'asc' : 'desc';
        onSortChange(column, defaultOrder);
      }
    },
    [sortField, sortDirection, onSortChange],
  );

  const getSortIcon = useCallback(
    (column: COGSSortField): React.ReactNode => {
      if (sortField !== column) {
        return null;
      }

      if (sortDirection === 'asc') {
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
    [sortField, sortDirection],
  );

  return {
    handleColumnSort,
    getSortIcon,
  };
}
