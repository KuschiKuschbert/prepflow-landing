'use client';

import { useState } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { IngredientTableRow } from './IngredientTableRow';
import { IngredientTableFilterBar } from './IngredientTableFilterBar';

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

interface IngredientTableWithFiltersProps {
  ingredients: Ingredient[];
  displayUnit: string;
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  sortBy: 'name' | 'cost_asc' | 'cost_desc' | 'supplier';
  selectedIngredients: Set<string>;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => Promise<void>;
  onSelectIngredient: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onSearchChange: (term: string) => void;
  onSupplierFilterChange: (supplier: string) => void;
  onStorageFilterChange: (storage: string) => void;
  onSortChange: (sort: 'name' | 'cost_asc' | 'cost_desc' | 'supplier') => void;
  onDisplayUnitChange: (unit: string) => void;
  loading?: boolean;
}

export default function IngredientTableWithFilters({
  ingredients,
  displayUnit,
  searchTerm,
  supplierFilter,
  storageFilter,
  sortBy,
  selectedIngredients,
  onEdit,
  onDelete,
  onSelectIngredient,
  onSelectAll,
  onSearchChange,
  onSupplierFilterChange,
  onStorageFilterChange,
  onSortChange,
  onDisplayUnitChange,
  loading = false,
}: IngredientTableWithFiltersProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  const filteredIngredients = ingredients;

  if (filteredIngredients.length === 0 && !loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
        <IngredientTableFilterBar
          ingredients={ingredients}
          searchTerm={searchTerm}
          supplierFilter={supplierFilter}
          storageFilter={storageFilter}
          sortBy={sortBy}
          displayUnit={displayUnit}
          onSearchChange={onSearchChange}
          onSupplierFilterChange={onSupplierFilterChange}
          onStorageFilterChange={onStorageFilterChange}
          onSortChange={onSortChange}
          onDisplayUnitChange={onDisplayUnitChange}
        />

        {/* Empty State */}
        <div className="p-12 text-center">
          <div className="mb-4 text-gray-400">
            <svg className="mx-auto mb-4 h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="mb-2 text-xl font-semibold text-white">No Ingredients Found</h3>
            <p className="text-gray-400">
              {searchTerm || supplierFilter || storageFilter
                ? 'Try adjusting your filters to see more results.'
                : 'Start by adding your first ingredient to get started.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
      <IngredientTableFilterBar
        ingredients={ingredients}
        searchTerm={searchTerm}
        supplierFilter={supplierFilter}
        storageFilter={storageFilter}
        sortBy={sortBy}
        displayUnit={displayUnit}
        onSearchChange={onSearchChange}
        onSupplierFilterChange={onSupplierFilterChange}
        onStorageFilterChange={onStorageFilterChange}
        onSortChange={onSortChange}
        onDisplayUnitChange={onDisplayUnitChange}
      />

      {/* Table Header */}
      <div className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Ingredients ({filteredIngredients.length})
          </h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={
                  selectedIngredients.size === filteredIngredients.length &&
                  filteredIngredients.length > 0
                }
                onChange={e => onSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-[#2a2a2a] bg-[#2a2a2a] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
                aria-label="Select all ingredients"
                aria-describedby="select-all-description"
              />
              <span id="select-all-description">Select All</span>
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <label className="sr-only">
                  <input
                    type="checkbox"
                    checked={
                      selectedIngredients.size === filteredIngredients.length &&
                      filteredIngredients.length > 0
                    }
                    onChange={e => onSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-[#2a2a2a] bg-[#2a2a2a] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
                    aria-label="Select all ingredients in table"
                  />
                  Select All
                </label>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Pack Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Cost/Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {filteredIngredients.map(ingredient => (
              <IngredientTableRow
                key={ingredient.id}
                ingredient={ingredient}
                displayUnit={displayUnit}
                selectedIngredients={selectedIngredients}
                onSelectIngredient={onSelectIngredient}
                onEdit={onEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
