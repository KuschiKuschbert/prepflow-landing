/**
 * Hook for managing allergen filters
 */

import { useState, useCallback, useMemo } from 'react';
import type { AllergenItem } from '../types';

export function useAllergenFilters(items: AllergenItem[], selectedAllergenFilter: string) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyWithAllergens, setShowOnlyWithAllergens] = useState(false);

  // Filter items by search query and allergen filter
  const filterItems = useCallback(
    (itemsToFilter: AllergenItem[]) => {
      return itemsToFilter.filter(item => {
        const matchesSearch =
          !searchQuery ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesAllergenFilter =
          !showOnlyWithAllergens || (item.allergens && item.allergens.length > 0);

        return matchesSearch && matchesAllergenFilter;
      });
    },
    [searchQuery, showOnlyWithAllergens],
  );

  const filteredItems = useMemo(() => filterItems(items), [items, filterItems]);

  const hasActiveFilters: boolean = Boolean(
    searchQuery || selectedAllergenFilter !== 'all' || showOnlyWithAllergens,
  );

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setShowOnlyWithAllergens(false);
  }, []);

  const getAllergenFilterName = (value: string) => {
    const names: Record<string, string> = {
      gluten: 'Gluten-Free',
      milk: 'Dairy-Free',
      eggs: 'Egg-Free',
      nuts: 'Nut-Free',
      soy: 'Soy-Free',
      fish: 'Fish-Free',
      shellfish: 'Shellfish-Free',
      sesame: 'Sesame-Free',
    };
    return names[value] || value;
  };

  return {
    searchQuery,
    setSearchQuery,
    showOnlyWithAllergens,
    setShowOnlyWithAllergens,
    filteredItems,
    hasActiveFilters,
    clearFilters,
    getAllergenFilterName,
  };
}
