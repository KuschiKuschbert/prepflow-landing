import { useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';

export type SortDirection = 'asc' | 'desc';

export interface UseTableSortOptions<T extends string> {
  sortField: T;
  sortDirection: SortDirection;
  onSortChange: (field: T, direction: SortDirection) => void;
}

export function useTableSort<T extends string>({
  sortField,
  sortDirection,
  onSortChange,
}: UseTableSortOptions<T>) {
  const handleColumnSort = useCallback(
    (column: T) => {
      if (sortField === column) {
        // Toggle direction if same column
        onSortChange(column, sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        // New column, default to ascending
        onSortChange(column, 'asc');
      }
    },
    [sortField, sortDirection, onSortChange],
  );

  const getSortIcon = useCallback(
    (column: T): React.ReactNode => {
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

