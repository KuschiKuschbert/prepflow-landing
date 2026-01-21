'use client';

import { type SortOption } from '../hooks/useIngredientFiltering';
import { IngredientEmptyState } from './IngredientEmptyState';
import { IngredientTableFilterBar } from './IngredientTableFilterBar';

import { ExistingIngredient as Ingredient } from './types';

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
