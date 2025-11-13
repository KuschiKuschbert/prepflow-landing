import { useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { type SortOption } from './useIngredientFiltering';
import React from 'react';

export function useIngredientTableSort(
  sortBy: SortOption,
  onSortChange: (sort: SortOption) => void,
) {
  const handleColumnSort = useCallback(
    (column: 'name' | 'brand' | 'pack_size' | 'cost' | 'supplier' | 'stock') => {
      const currentAsc = `${column}_asc` as SortOption;
      const currentDesc = `${column}_desc` as SortOption;

      if (sortBy === currentAsc) {
        onSortChange(currentDesc);
      } else {
        onSortChange(currentAsc);
      }
    },
    [sortBy, onSortChange],
  );

  const getSortIcon = useCallback(
    (column: 'name' | 'brand' | 'pack_size' | 'cost' | 'supplier' | 'stock'): React.ReactNode => {
      const currentAsc = `${column}_asc` as SortOption;
      const currentDesc = `${column}_desc` as SortOption;

      if (sortBy === currentAsc) {
        return React.createElement(Icon, {
          icon: ChevronUp,
          size: 'xs',
          className: 'ml-1 text-[#29E7CD]',
        });
      }
      if (sortBy === currentDesc) {
        return React.createElement(Icon, {
          icon: ChevronDown,
          size: 'xs',
          className: 'ml-1 text-[#29E7CD]',
        });
      }
      return null;
    },
    [sortBy],
  );

  return {
    handleColumnSort,
    getSortIcon,
  };
}
