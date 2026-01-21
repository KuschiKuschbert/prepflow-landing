import { useMemo } from 'react';

import { ExistingIngredient as Ingredient } from '../components/types';

export type SortOption =
  | 'name_asc'
  | 'name_desc'
  | 'brand_asc'
  | 'brand_desc'
  | 'pack_size_asc'
  | 'pack_size_desc'
  | 'cost_asc'
  | 'cost_desc'
  | 'supplier_asc'
  | 'supplier_desc'
  | 'stock_asc'
  | 'stock_desc';

interface UseIngredientFilteringProps {
  ingredients: Ingredient[];
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  categoryFilter: string;
  sortBy: SortOption;
}

export function useIngredientFiltering({
  ingredients,
  searchTerm,
  supplierFilter,
  storageFilter,
  categoryFilter,
  sortBy,
}: UseIngredientFilteringProps) {
  const filteredIngredients = useMemo(() => {
    const filtered = ingredients.filter(ingredient => {
      const matchesSearch =
        !searchTerm ||
        ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ingredient.brand && ingredient.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ingredient.supplier &&
          ingredient.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSupplier = !supplierFilter || ingredient.supplier === supplierFilter;
      const matchesStorage = !storageFilter || ingredient.storage_location === storageFilter;
      const matchesCategory = !categoryFilter || ingredient.category === categoryFilter;

      return matchesSearch && matchesSupplier && matchesStorage && matchesCategory;
    });

    filtered.sort((a, b) => {
      const [field, order] = sortBy.split('_');
      const isDesc = order === 'desc';
      switch (field) {
        case 'name':
          return isDesc
            ? b.ingredient_name.localeCompare(a.ingredient_name)
            : a.ingredient_name.localeCompare(b.ingredient_name);
        case 'brand':
          return isDesc
            ? (b.brand || '').localeCompare(a.brand || '')
            : (a.brand || '').localeCompare(b.brand || '');
        case 'pack':
          const aSize = parseFloat(a.pack_size || '0');
          const bSize = parseFloat(b.pack_size || '0');
          return isDesc ? bSize - aSize : aSize - bSize;
        case 'cost':
          return isDesc
            ? (b.cost_per_unit || 0) - (a.cost_per_unit || 0)
            : (a.cost_per_unit || 0) - (b.cost_per_unit || 0);
        case 'supplier':
          return isDesc
            ? (b.supplier || '').localeCompare(a.supplier || '')
            : (a.supplier || '').localeCompare(b.supplier || '');
        case 'stock':
          return isDesc
            ? (b.current_stock || 0) - (a.current_stock || 0)
            : (a.current_stock || 0) - (b.current_stock || 0);
        default:
          return 0;
      }
    });
    return filtered;
  }, [ingredients, searchTerm, supplierFilter, storageFilter, categoryFilter, sortBy]);
  return { filteredIngredients };
}
