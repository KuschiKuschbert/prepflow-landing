'use client';

import { useTranslation } from '@/lib/useTranslation';
import { BarChart3 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

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

interface IngredientFiltersProps {
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

export default function IngredientFilters({
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
}: IngredientFiltersProps) {
  const { t } = useTranslation();

  // Get unique suppliers and storage locations for filter options
  const uniqueSuppliers = Array.from(
    new Set(ingredients.map(i => i.supplier).filter(Boolean)),
  ).sort();
  const uniqueStorageLocations = Array.from(
    new Set(ingredients.map(i => i.storage_location).filter(Boolean)),
  ).sort();

  return (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-[var(--foreground-secondary)]">Show costs per:</label>
          <select
            value={displayUnit}
            onChange={e => onDisplayUnitChange(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
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
      </div>

      {/* Search and Filter Controls */}
      <div className="tablet:p-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow">
        <div className="desktop:grid-cols-4 grid grid-cols-1 gap-4">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">🔍 Search</label>
            <input
              type="text"
              placeholder="Search ingredients&hellip;"
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder-gray-500 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            />
          </div>

          {/* Supplier Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">🏪 Supplier</label>
            <select
              value={supplierFilter}
              onChange={e => onSupplierFilterChange(e.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            >
              <option value="">All Suppliers</option>
              {uniqueSuppliers.map(supplier => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
          </div>

          {/* Storage Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">📍 Storage</label>
            <select
              value={storageFilter}
              onChange={e => onStorageFilterChange(e.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            >
              <option value="">All Locations</option>
              {uniqueStorageLocations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="mb-2 block flex items-center gap-1 text-sm font-medium text-[var(--foreground-secondary)]">
              <Icon icon={BarChart3} size="xs" className="text-[var(--primary)]" aria-hidden={true} />
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e =>
                onSortChange(e.target.value as 'name' | 'cost_asc' | 'cost_desc' | 'supplier')
              }
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            >
              <option value="name">Name</option>
              <option value="cost_asc">Cost (Low to High)</option>
              <option value="cost_desc">Cost (High to Low)</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        {(searchTerm || supplierFilter || storageFilter) && (
          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[var(--foreground-muted)]">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-2 py-1 text-xs font-medium text-[var(--primary)]">
                  Search: &quot;{searchTerm}&quot;
                </span>
              )}
              {supplierFilter && (
                <span className="inline-flex items-center rounded-full border border-[var(--color-info)]/20 bg-[var(--color-info)]/10 px-2 py-1 text-xs font-medium text-[var(--color-info)]">
                  Supplier: {supplierFilter}
                </span>
              )}
              {storageFilter && (
                <span className="inline-flex items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-2 py-1 text-xs font-medium text-[var(--accent)]">
                  Storage: {storageFilter}
                </span>
              )}
              <button
                onClick={() => {
                  onSearchChange('');
                  onSupplierFilterChange('');
                  onStorageFilterChange('');
                }}
                className="inline-flex items-center rounded-full border border-gray-600/20 bg-gray-600/10 px-2 py-1 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:border-gray-500/40 hover:text-[var(--foreground)]"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
