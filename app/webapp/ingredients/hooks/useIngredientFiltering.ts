import { useMemo } from 'react';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  supplier?: string;
  storage_location?: string;
  cost_per_unit: number;
}

interface UseIngredientFilteringProps {
  ingredients: Ingredient[];
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  sortBy: 'name' | 'cost_asc' | 'cost_desc' | 'supplier';
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

    // Sort ingredients
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.ingredient_name.localeCompare(b.ingredient_name);
        case 'cost_asc':
          return (a.cost_per_unit || 0) - (b.cost_per_unit || 0);
        case 'cost_desc':
          return (b.cost_per_unit || 0) - (a.cost_per_unit || 0);
        case 'supplier':
          return (a.supplier || '').localeCompare(b.supplier || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [ingredients, searchTerm, supplierFilter, storageFilter, sortBy]);

  return { filteredIngredients };
}
