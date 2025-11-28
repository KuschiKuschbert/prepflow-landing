/**
 * Allergen Overview Component
 * Displays all dishes/recipes with their allergens for compliance tracking
 */

'use client';

import { useState } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { TablePagination } from '@/components/ui/TablePagination';
import { useAllergenData } from './hooks/useAllergenData';
import { useAllergenFilters } from './hooks/useAllergenFilters';
import { useAllergenExport } from './hooks/useAllergenExport';
import { usePagination } from './hooks/usePagination';
import { ExportDropdown } from './components/ExportDropdown';
import { FilterBar } from './components/FilterBar';
import { AllergenTable } from './components/AllergenTable';
import { AllergenCards } from './components/AllergenCards';

export interface AllergenItem {
  id: string;
  name: string;
  description?: string;
  type: 'recipe' | 'dish';
  allergens: string[];
  allergenSources?: Record<string, string[]>; // allergen_code -> ingredient names
  menus: Array<{ menu_id: string; menu_name: string }>;
}

export function AllergenOverview() {
  const [selectedAllergenFilter, setSelectedAllergenFilter] = useState<string>('all');
  const { items, loading } = useAllergenData(selectedAllergenFilter);
  const {
    searchQuery,
    setSearchQuery,
    showOnlyWithAllergens,
    setShowOnlyWithAllergens,
    filteredItems,
    hasActiveFilters,
    clearFilters,
    getAllergenFilterName,
  } = useAllergenFilters(items, selectedAllergenFilter);

  const { exportLoading, handleExport } = useAllergenExport(selectedAllergenFilter);

  const { currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, totalPages, paginatedItems } =
    usePagination(filteredItems, 25);

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ExportDropdown exportLoading={exportLoading} onExport={handleExport} />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAllergenFilter={selectedAllergenFilter}
        onAllergenFilterChange={setSelectedAllergenFilter}
        showOnlyWithAllergens={showOnlyWithAllergens}
        onShowOnlyWithAllergensChange={setShowOnlyWithAllergens}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => {
          setSelectedAllergenFilter('all');
          clearFilters();
        }}
        getAllergenFilterName={getAllergenFilterName}
      />

      <div className="space-y-4">
        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          total={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          className="mb-4"
        />

        <div className="desktop:hidden block">
          <AllergenCards
            items={paginatedItems}
            hasActiveFilters={hasActiveFilters}
            totalItems={items.length}
            onClearFilters={clearFilters}
          />
        </div>

        <div className="desktop:block hidden">
          <AllergenTable
            items={paginatedItems}
            hasActiveFilters={hasActiveFilters}
            totalItems={items.length}
            onClearFilters={clearFilters}
          />
        </div>

        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          total={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          className="mt-4"
        />
      </div>
    </div>
  );
}
