'use client';

import { useTranslation } from '@/lib/useTranslation';

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
  onDisplayUnitChange
}: IngredientFiltersProps) {
  const { t } = useTranslation();

  // Get unique suppliers and storage locations for filter options
  const uniqueSuppliers = Array.from(new Set(ingredients.map(i => i.supplier).filter(Boolean))).sort();
  const uniqueStorageLocations = Array.from(new Set(ingredients.map(i => i.storage_location).filter(Boolean))).sort();

  return (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="bg-[#1f1f1f] p-4 rounded-lg border border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-300">Display costs in:</label>
          <select
            value={displayUnit}
            onChange={(e) => onDisplayUnitChange(e.target.value)}
            className="px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
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
              <option value="tsp">Teaspoons (tsp)</option>
              <option value="tbsp">Tablespoons (tbsp)</option>
              <option value="cup">Cups</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-[#1f1f1f] p-4 sm:p-6 rounded-lg shadow border border-[#2a2a2a]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🔍 Search
            </label>
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD] placeholder-gray-500"
            />
          </div>

          {/* Supplier Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🏪 Supplier
            </label>
            <select
              value={supplierFilter}
              onChange={(e) => onSupplierFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
            >
              <option value="">All Suppliers</option>
              {uniqueSuppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>

          {/* Storage Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📍 Storage
            </label>
            <select
              value={storageFilter}
              onChange={(e) => onStorageFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
            >
              <option value="">All Locations</option>
              {uniqueStorageLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📊 Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'name' | 'cost_asc' | 'cost_desc' | 'supplier')}
              className="w-full px-3 py-2 border border-[#2a2a2a] bg-[#0a0a0a] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#29E7CD]"
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
          <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#29E7CD]/10 text-[#29E7CD] border border-[#29E7CD]/20">
                  Search: "{searchTerm}"
                </span>
              )}
              {supplierFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                  Supplier: {supplierFilter}
                </span>
              )}
              {storageFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#D925C7]/10 text-[#D925C7] border border-[#D925C7]/20">
                  Storage: {storageFilter}
                </span>
              )}
              <button
                onClick={() => {
                  onSearchChange('');
                  onSupplierFilterChange('');
                  onStorageFilterChange('');
                }}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600/10 text-gray-400 hover:text-white border border-gray-600/20 hover:border-gray-500/40 transition-colors"
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
