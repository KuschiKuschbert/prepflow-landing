import { useState, useMemo } from 'react';
import { MenuItem } from '../types';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'position';

interface UseCategorySortProps {
  items: MenuItem[];
  defaultSort?: SortOption;
}

export function useCategorySort({ items, defaultSort = 'position' }: UseCategorySortProps) {
  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);

  const sortedItems = useMemo(() => {
    const itemsCopy = [...items];

    switch (sortBy) {
      case 'name-asc': {
        return itemsCopy.sort((a, b) => {
          const nameA = (a.dishes?.dish_name || a.recipes?.recipe_name || '').toLowerCase();
          const nameB = (b.dishes?.dish_name || b.recipes?.recipe_name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
      }
      case 'name-desc': {
        return itemsCopy.sort((a, b) => {
          const nameA = (a.dishes?.dish_name || a.recipes?.recipe_name || '').toLowerCase();
          const nameB = (b.dishes?.dish_name || b.recipes?.recipe_name || '').toLowerCase();
          return nameB.localeCompare(nameA);
        });
      }
      case 'price-asc': {
        return itemsCopy.sort((a, b) => {
          const priceA =
            a.actual_selling_price ?? a.recommended_selling_price ?? a.dishes?.selling_price ?? 0;
          const priceB =
            b.actual_selling_price ?? b.recommended_selling_price ?? b.dishes?.selling_price ?? 0;
          return priceA - priceB;
        });
      }
      case 'price-desc': {
        return itemsCopy.sort((a, b) => {
          const priceA =
            a.actual_selling_price ?? a.recommended_selling_price ?? a.dishes?.selling_price ?? 0;
          const priceB =
            b.actual_selling_price ?? b.recommended_selling_price ?? b.dishes?.selling_price ?? 0;
          return priceB - priceA;
        });
      }
      case 'position':
      default: {
        return itemsCopy.sort((a, b) => a.position - b.position);
      }
    }
  }, [items, sortBy]);

  return {
    sortBy,
    setSortBy,
    sortedItems,
  };
}
