'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { FilterDropdown } from './FilterDropdown';
import { ActiveFilterChips } from './ActiveFilterChips';
import { type SortOption } from '../hooks/useIngredientFiltering';
import { Store, MapPin, Type, Tag, DollarSign, Package, ChevronDown } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

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
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showSupplierMenu, setShowSupplierMenu] = useState(false);
  const [showStorageMenu, setShowStorageMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSupplierMenu(false);
        setShowStorageMenu(false);
        setShowSortMenu(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

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

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'name_asc', label: 'Name ↑', icon: <Icon icon={Type} size="xs" className="text-current" /> },
    { value: 'name_desc', label: 'Name ↓', icon: <Icon icon={Type} size="xs" className="text-current" /> },
    { value: 'brand_asc', label: 'Brand ↑', icon: <Icon icon={Tag} size="xs" className="text-current" /> },
    { value: 'brand_desc', label: 'Brand ↓', icon: <Icon icon={Tag} size="xs" className="text-current" /> },
    { value: 'cost_asc', label: 'Cost ↑', icon: <Icon icon={DollarSign} size="xs" className="text-current" /> },
    { value: 'cost_desc', label: 'Cost ↓', icon: <Icon icon={DollarSign} size="xs" className="text-current" /> },
    { value: 'supplier_asc', label: 'Supplier ↑', icon: <Icon icon={Store} size="xs" className="text-current" /> },
    { value: 'supplier_desc', label: 'Supplier ↓', icon: <Icon icon={Store} size="xs" className="text-current" /> },
    { value: 'stock_asc', label: 'Stock ↑', icon: <Icon icon={Package} size="xs" className="text-current" /> },
    { value: 'stock_desc', label: 'Stock ↓', icon: <Icon icon={Package} size="xs" className="text-current" /> },
  ];

  const currentSortOption = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

  return (
    <div className="sticky top-0 z-30 border-b border-[#2a2a2a] bg-[#1f1f1f]/95 p-3 backdrop-blur-sm">
      {/* Search and Filters - Optimized Layout */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        {/* Search Bar - Flexible Width */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search ingredients..."
            value={localSearchTerm}
            onChange={e => setLocalSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-8 py-2 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:border-[#29E7CD]/50 focus:bg-[#0a0a0a] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          />
          {localSearchTerm && (
            <button
              onClick={() => setLocalSearchTerm('')}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
              aria-label="Clear search"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

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

        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowSupplierMenu(false);
              setShowStorageMenu(false);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#1f1f1f] hover:text-[#29E7CD]"
          >
            {currentSortOption.icon}
            <span className="truncate">{currentSortOption.label}</span>
            <Icon icon={ChevronDown} size="xs" className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} aria-hidden={true} />
          </button>
          {showSortMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSortMenu(false)}
                aria-hidden={true}
              />
              <div className="absolute top-full left-0 z-50 mt-1.5 w-44 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
                <div className="p-1.5">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                        sortBy === option.value
                          ? 'bg-[#29E7CD]/20 text-[#29E7CD]'
                          : 'text-gray-300 hover:bg-[#2a2a2a]'
                      }`}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                      {sortBy === option.value && <span className="ml-auto text-[#29E7CD]">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Display Unit Selector */}
        <select
          value={displayUnit}
          onChange={e => onDisplayUnitChange(e.target.value)}
          className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-2.5 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#1f1f1f] focus:border-[#29E7CD]/50 focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          title="Display unit"
        >
          <optgroup label="Weight">
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="oz">oz</option>
            <option value="lb">lb</option>
          </optgroup>
          <optgroup label="Volume">
            <option value="ml">ml</option>
            <option value="l">L</option>
          </optgroup>
        </select>

        {/* Items Per Page Selector */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="items-per-page" className="text-xs text-gray-400 whitespace-nowrap">
            Per page:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={e => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-2.5 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#1f1f1f] focus:border-[#29E7CD]/50 focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
            title="Items per page"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>

        {/* Clear All Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 rounded-lg border border-gray-600/30 bg-gray-600/10 px-2.5 py-2 text-xs font-medium text-gray-400 transition-all duration-200 hover:border-gray-500/50 hover:bg-gray-500/20 hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Clear ({activeFilterCount})</span>
          </button>
        )}
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
