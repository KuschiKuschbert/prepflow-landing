'use client';

import { Icon } from '@/components/ui/Icon';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IngredientTableRow } from './IngredientTableRow';
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

interface IngredientTableDesktopProps {
  ingredients: Ingredient[];
  displayUnit: string;
  selectedIngredients: Set<string>;
  totalFiltered?: number;
  sortBy: SortOption;
  onSelectIngredient: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  deletingId: string | null;
  isSelectionMode: boolean;
  onStartLongPress?: () => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
  handleColumnSort: (
    column: 'name' | 'brand' | 'pack_size' | 'cost' | 'supplier' | 'stock',
  ) => void;
  getSortIcon: (
    column: 'name' | 'brand' | 'pack_size' | 'cost' | 'supplier' | 'stock',
  ) => React.ReactNode;
}

export function IngredientTableDesktop({
  ingredients,
  displayUnit,
  selectedIngredients,
  totalFiltered,
  sortBy,
  onSelectIngredient,
  onSelectAll,
  onEdit,
  handleDelete,
  deletingId,
  isSelectionMode,
  onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
  handleColumnSort,
  getSortIcon,
}: IngredientTableDesktopProps) {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
          <tr>
            <th className="hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase lg:table-cell">
              <button
                onClick={() => {
                  const allSelected =
                    totalFiltered !== undefined
                      ? selectedIngredients.size === totalFiltered && totalFiltered > 0
                      : selectedIngredients.size === ingredients.length && ingredients.length > 0;
                  onSelectAll(!allSelected);
                  if (!allSelected && onEnterSelectionMode) {
                    onEnterSelectionMode();
                  }
                }}
                className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
                aria-label={
                  totalFiltered !== undefined &&
                  selectedIngredients.size === totalFiltered &&
                  totalFiltered > 0
                    ? 'Deselect all'
                    : 'Select all'
                }
              >
                {(
                  totalFiltered !== undefined
                    ? selectedIngredients.size === totalFiltered && totalFiltered > 0
                    : selectedIngredients.size === ingredients.length && ingredients.length > 0
                ) ? (
                  <svg
                    className="h-4 w-4 text-[#29E7CD]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              <button
                onClick={() => handleColumnSort('name')}
                className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
              >
                Name
                {getSortIcon('name')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              <button
                onClick={() => handleColumnSort('brand')}
                className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
              >
                Brand
                {getSortIcon('brand')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              <button
                onClick={() => handleColumnSort('pack_size')}
                className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
              >
                Pack Size
                {getSortIcon('pack_size')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              <button
                onClick={() => handleColumnSort('cost')}
                className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
              >
                Cost/Unit
                {getSortIcon('cost')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              <button
                onClick={() => handleColumnSort('supplier')}
                className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
              >
                Supplier
                {getSortIcon('supplier')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              <button
                onClick={() => handleColumnSort('stock')}
                className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
              >
                Stock
                {getSortIcon('stock')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a]">
          {ingredients.map(ingredient => (
            <IngredientTableRow
              key={ingredient.id}
              ingredient={ingredient}
              displayUnit={displayUnit}
              selectedIngredients={selectedIngredients}
              onSelectIngredient={onSelectIngredient}
              onEdit={onEdit}
              onDelete={handleDelete}
              deletingId={deletingId}
              isSelectionMode={isSelectionMode}
              onStartLongPress={onStartLongPress}
              onCancelLongPress={onCancelLongPress}
              onEnterSelectionMode={onEnterSelectionMode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
