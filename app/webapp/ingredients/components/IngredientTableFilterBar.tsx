'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { FilterDropdown } from './FilterDropdown';
import { ActiveFilterChips } from './ActiveFilterChips';
import { IngredientSearchBar } from './IngredientSearchBar';
import { IngredientSortDropdown } from './IngredientSortDropdown';
import { DisplayUnitSelector } from './DisplayUnitSelector';
import { ItemsPerPageSelector } from './ItemsPerPageSelector';
import { ClearAllFiltersButton } from './ClearAllFiltersButton';
import { useFilterBarEffects } from '../hooks/useFilterBarEffects';
import { type SortOption } from '../hooks/useIngredientFiltering';
import { Store, MapPin } from 'lucide-react';

interface Ingredient {
  supplier?: string;
  storage_location?: string;
}

interface IngredientTableFilterBarProps {
  ingredients: Ingredient[];
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  sortBy: SortOption;
  displayUnit: string;
  itemsPerPage: number;
  onSearchChange: (term: string) => void;
  onSupplierFilterChange: (supplier: string) => void;
  onStorageFilterChange: (storage: string) => void;
  onSortChange: (sort: SortOption) => void;
  onDisplayUnitChange: (unit: string) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function IngredientTableFilterBar({
  ingredients,
  searchTerm,
  supplierFilter,
  storageFilter,
  sortBy,
  displayUnit,
  itemsPerPage,
  onSearchChange,
  onSupplierFilterChange,
  onStorageFilterChange,
  onSortChange,
  onDisplayUnitChange,
  onItemsPerPageChange,
}: IngredientTableFilterBarProps) {
  const [showSupplierMenu, setShowSupplierMenu] = useState(false);
  const [showStorageMenu, setShowStorageMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { localSearchTerm, setLocalSearchTerm } = useFilterBarEffects({
    searchTerm,
    onSearchChange,
    showSupplierMenu,
    showStorageMenu,
    showSortMenu,
    setShowSupplierMenu,
    setShowStorageMenu,
    setShowSortMenu,
  });

  const { uniqueSuppliers, uniqueStorageLocations } = useMemo(() => {
    const supplierSet = new Set<string>();
    const storageSet = new Set<string>();
    ingredients.forEach(ingredient => {
      if (ingredient.supplier) supplierSet.add(ingredient.supplier);
      if (ingredient.storage_location) storageSet.add(ingredient.storage_location);
    });
    return {
      uniqueSuppliers: Array.from(supplierSet).sort(),
      uniqueStorageLocations: Array.from(storageSet).sort(),
    };
  }, [ingredients]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (supplierFilter) count++;
    if (storageFilter) count++;
    return count;
  }, [searchTerm, supplierFilter, storageFilter]);

  const handleClearAll = useCallback(() => {
    setLocalSearchTerm('');
    onSearchChange('');
    onSupplierFilterChange('');
    onStorageFilterChange('');
  }, [onSearchChange, onSupplierFilterChange, onStorageFilterChange]);


  return (
    <div className="sticky top-0 z-30 border-b border-[#2a2a2a] bg-[#1f1f1f]/95 p-3 backdrop-blur-sm">
      {/* Search and Filters - Optimized Layout */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
        <IngredientSearchBar
          searchTerm={localSearchTerm}
          onSearchChange={setLocalSearchTerm}
          onClear={() => {
            setLocalSearchTerm('');
            onSearchChange('');
          }}
        />

        {/* Filter Buttons Row - Compact */}
        <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Supplier"
          icon={Store}
          value={supplierFilter}
          options={uniqueSuppliers}
          isOpen={showSupplierMenu}
          onToggle={() => {
            setShowSupplierMenu(!showSupplierMenu);
            setShowStorageMenu(false);
            setShowSortMenu(false);
          }}
          onChange={onSupplierFilterChange}
          activeColor="border-[#3B82F6]/50 bg-[#3B82F6]/10 text-[#3B82F6]"
          activeBg="bg-[#3B82F6]/20"
        />

        <FilterDropdown
          label="Storage"
          icon={MapPin}
          value={storageFilter}
          options={uniqueStorageLocations}
          isOpen={showStorageMenu}
          onToggle={() => {
            setShowStorageMenu(!showStorageMenu);
            setShowSupplierMenu(false);
            setShowSortMenu(false);
          }}
          onChange={onStorageFilterChange}
          activeColor="border-[#D925C7]/50 bg-[#D925C7]/10 text-[#D925C7]"
          activeBg="bg-[#D925C7]/20"
        />

        <IngredientSortDropdown
          sortBy={sortBy}
          onSortChange={onSortChange}
          isOpen={showSortMenu}
          onToggle={() => {
            setShowSortMenu(!showSortMenu);
            setShowSupplierMenu(false);
            setShowStorageMenu(false);
          }}
          onClose={() => setShowSortMenu(false)}
        />

        <DisplayUnitSelector displayUnit={displayUnit} onDisplayUnitChange={onDisplayUnitChange} />

        <ItemsPerPageSelector
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
        />

        <ClearAllFiltersButton activeFilterCount={activeFilterCount} onClearAll={handleClearAll} />
        </div>
      </div>

      {/* Active Filter Chips */}
      {(searchTerm || supplierFilter || storageFilter) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <ActiveFilterChips
            searchTerm={searchTerm}
            supplierFilter={supplierFilter}
            storageFilter={storageFilter}
            onClearSearch={() => {
              setLocalSearchTerm('');
              onSearchChange('');
            }}
            onClearSupplier={() => onSupplierFilterChange('')}
            onClearStorage={() => onStorageFilterChange('')}
          />
        </div>
      )}
    </div>
  );
}
