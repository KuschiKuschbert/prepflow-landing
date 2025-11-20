'use client';

import { IngredientTableFilterBar } from './IngredientTableFilterBar';
import { IngredientEmptyState } from './IngredientEmptyState';
import { type SortOption } from '../hooks/useIngredientFiltering';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}

interface IngredientTableEmptyStateProps {
  ingredients: Ingredient[];
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  categoryFilter: string;
  sortBy: SortOption;
  displayUnit: string;
  itemsPerPage: number;
  onSearchChange: (term: string) => void;
  onSupplierFilterChange: (supplier: string) => void;
  onStorageFilterChange: (storage: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onSortChange: (sort: SortOption) => void;
  onDisplayUnitChange: (unit: string) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onAddIngredient?: () => void;
  onImportCSV?: () => void;
  onExportCSV?: () => void;
}

export function IngredientTableEmptyState({
  ingredients,
  searchTerm,
  supplierFilter,
  storageFilter,
  categoryFilter,
  sortBy,
  displayUnit,
  itemsPerPage,
  onSearchChange,
  onSupplierFilterChange,
  onStorageFilterChange,
  onCategoryFilterChange,
  onSortChange,
  onDisplayUnitChange,
  onItemsPerPageChange,
  onAddIngredient,
  onImportCSV,
  onExportCSV,
}: IngredientTableEmptyStateProps) {
  return (
    <>
      <IngredientTableFilterBar
        ingredients={ingredients}
        searchTerm={searchTerm}
        supplierFilter={supplierFilter}
        storageFilter={storageFilter}
        categoryFilter={categoryFilter}
        sortBy={sortBy}
        displayUnit={displayUnit}
        itemsPerPage={itemsPerPage}
        onSearchChange={onSearchChange}
        onSupplierFilterChange={onSupplierFilterChange}
        onStorageFilterChange={onStorageFilterChange}
        onCategoryFilterChange={onCategoryFilterChange}
        onSortChange={onSortChange}
        onDisplayUnitChange={onDisplayUnitChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
      <IngredientEmptyState
        searchTerm={searchTerm}
        supplierFilter={supplierFilter}
        storageFilter={storageFilter}
        onAddIngredient={onAddIngredient}
        onImportCSV={onImportCSV}
        onExportCSV={onExportCSV}
      />
    </>
  );
}
