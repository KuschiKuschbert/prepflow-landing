import { useMemo, useState } from 'react';
import { COGSCalculation } from '../types';

export type SortField = 'ingredient_name' | 'quantity' | 'cost';
export type SortDirection = 'asc' | 'desc';

interface UseCOGSSortingReturn {
  sortField: SortField;
  sortDirection: SortDirection;
  sortedCalculations: COGSCalculation[];
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

export function useCOGSSorting(calculations: COGSCalculation[]): UseCOGSSortingReturn {
  const [sortField, setSortField] = useState<SortField>('ingredient_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedCalculations = useMemo(() => {
    const sorted = [...calculations];
    sorted.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'ingredient_name':
          aValue = a.ingredientName.toLowerCase();
          bValue = b.ingredientName.toLowerCase();
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'cost':
          aValue = a.yieldAdjustedCost;
          bValue = b.yieldAdjustedCost;
          break;
        default:
          aValue = a.ingredientName.toLowerCase();
          bValue = b.ingredientName.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return sorted;
  }, [calculations, sortField, sortDirection]);

  const onSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  return {
    sortField,
    sortDirection,
    sortedCalculations,
    setSortField,
    setSortDirection,
    onSortChange,
  };
}
