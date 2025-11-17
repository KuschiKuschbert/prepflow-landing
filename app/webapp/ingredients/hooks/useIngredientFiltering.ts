import { useMemo } from 'react';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  supplier?: string;
  storage_location?: string;
  cost_per_unit: number;
  current_stock?: number;
}

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
  sortBy: SortOption;
}

export function useIngredientFiltering({
  ingredients,
  searchTerm,
  supplierFilter,
  storageFilter,
  sortBy,
}: UseIngredientFilteringProps) {
  const filteredIngredients = useMemo(() => {
    let filtered = ingredients.filter(ingredient => {
      const matchesSearch =
        !searchTerm ||
        ingredient.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ingredient.brand && ingredient.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ingredient.supplier &&
          ingredient.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSupplier = !supplierFilter || ingredient.supplier === supplierFilter;
      const matchesStorage = !storageFilter || ingredient.storage_location === storageFilter;

      return matchesSearch && matchesSupplier && matchesStorage;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.ingredient_name.localeCompare(b.ingredient_name);
        case 'name_desc':
          return b.ingredient_name.localeCompare(a.ingredient_name);
        case 'brand_asc':
          return (a.brand || '').localeCompare(b.brand || '');
        case 'brand_desc':
          return (b.brand || '').localeCompare(a.brand || '');
        case 'pack_size_asc': {
          const aSize = parseFloat(a.pack_size || '0');
          const bSize = parseFloat(b.pack_size || '0');
          return aSize - bSize;
        }
        case 'pack_size_desc': {
          const aSize = parseFloat(a.pack_size || '0');
          const bSize = parseFloat(b.pack_size || '0');
          return bSize - aSize;
        }
        case 'cost_asc':
          return (a.cost_per_unit || 0) - (b.cost_per_unit || 0);
        case 'cost_desc':
          return (b.cost_per_unit || 0) - (a.cost_per_unit || 0);
        case 'supplier_asc':
          return (a.supplier || '').localeCompare(b.supplier || '');
        case 'supplier_desc':
          return (b.supplier || '').localeCompare(a.supplier || '');
        case 'stock_asc':
          return (a.current_stock || 0) - (b.current_stock || 0);
        case 'stock_desc':
          return (b.current_stock || 0) - (a.current_stock || 0);
        default:
          return 0;
      }
    });
    return filtered;
  }, [ingredients, searchTerm, supplierFilter, storageFilter, sortBy]);
  return { filteredIngredients };
}
