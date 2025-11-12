'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { Store, MapPin, Type, DollarSign, ChevronDown } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useDebounce } from '@/hooks/useDebounce';
import { FilterDropdown } from './FilterDropdown';
import { ActiveFilterChips } from './ActiveFilterChips';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  supplier?: string;
  storage_location?: string;
  cost_per_unit: number;
}

interface ModernIngredientFiltersProps {
  ingredients: Ingredient[];
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  sortBy: 'name' | 'cost_asc' | 'cost_desc' | 'supplier';
  displayUnit: string;
  onSearchChange: (term: string) => void;
  onSupplierFilterChange: (supplier: string) => void;
  onStorageFilterChange: (storage: string) => void;
  onSortChange: (sort: 'name' | 'cost_asc' | 'cost_desc' | 'supplier') => void;
  onDisplayUnitChange: (unit: string) => void;
}

export default function ModernIngredientFilters({
  ingredients,
  searchTerm,
  supplierFilter,
  storageFilter,
  sortBy,
  displayUnit,
  onSearchChange,
  onSupplierFilterChange,
  onStorageFilterChange,
  onSortChange,
  onDisplayUnitChange,
}: ModernIngredientFiltersProps) {
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

  const sortOptions = [
    { value: 'name' as const, label: 'Name', icon: Type },
    { value: 'cost_asc' as const, label: 'Cost ↑', icon: DollarSign },
    { value: 'cost_desc' as const, label: 'Cost ↓', icon: DollarSign },
    { value: 'supplier' as const, label: 'Supplier', icon: Store },
  ];

  const currentSortOption = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-3 backdrop-blur-sm sm:p-4">
        <div className="relative w-full min-w-[200px] flex-1 sm:w-auto">
          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a]/80 px-10 py-2.5 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:border-[#29E7CD]/50 focus:bg-[#0a0a0a] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          />
          {localSearchTerm && (
            <button
              onClick={() => setLocalSearchTerm('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowSupplierMenu(false);
              setShowStorageMenu(false);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a]/80 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#1f1f1f] hover:text-[#29E7CD] sm:w-auto"
          >
            <Icon icon={currentSortOption.icon} size="sm" className="text-current" aria-hidden={true} />
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
              <div className="absolute top-full left-0 z-50 mt-2 w-48 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
                <div className="p-2">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        sortBy === option.value
                          ? 'bg-[#29E7CD]/20 text-[#29E7CD]'
                          : 'text-gray-300 hover:bg-[#2a2a2a]'
                      }`}
                    >
                      <Icon icon={option.icon} size="sm" className="text-current" aria-hidden={true} />
                      <span>{option.label}</span>
                      {sortBy === option.value && <span className="ml-auto text-[#29E7CD]">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative w-full sm:w-auto">
          <select
            value={displayUnit}
            onChange={e => onDisplayUnitChange(e.target.value)}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a]/80 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#1f1f1f] focus:border-[#29E7CD]/50 focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none sm:w-auto"
            title="Display unit"
          >
            <optgroup label="Weight">
              <option value="g">Grams (g)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="lb">Pounds (lb)</option>
            </optgroup>
            <optgroup label="Volume">
              <option value="ml">Milliliters (ml)</option>
              <option value="l">Liters (L)</option>
            </optgroup>
          </select>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-600/30 bg-gray-600/10 px-4 py-2.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-gray-500/50 hover:bg-gray-500/20 hover:text-white sm:w-auto"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <ActiveFilterChips
        searchTerm={searchTerm}
        supplierFilter={supplierFilter}
        storageFilter={storageFilter}
        onClearSearch={() => setLocalSearchTerm('')}
        onClearSupplier={() => onSupplierFilterChange('')}
        onClearStorage={() => onStorageFilterChange('')}
      />
    </div>
  );
}
