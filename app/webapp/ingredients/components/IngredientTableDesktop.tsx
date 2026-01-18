'use client';
import { Icon } from '@/components/ui/Icon';
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
    <div className="desktop:block hidden overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20">
          <tr>
            <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
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
                className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
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
                    className="h-4 w-4 text-[var(--primary)]"
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
                  <div className="h-4 w-4 rounded border border-[var(--border)] bg-[var(--background)] transition-colors hover:border-[var(--primary)]/50" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              <button
                onClick={() => handleColumnSort('name')}
                className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
              >
                Name
                {getSortIcon('name')}
              </button>
            </th>
            <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              <button
                onClick={() => handleColumnSort('brand')}
                className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
              >
                Brand
                {getSortIcon('brand')}
              </button>
            </th>
            <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              <button
                onClick={() => handleColumnSort('pack_size')}
                className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
              >
                Pack Size
                {getSortIcon('pack_size')}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              <button
                onClick={() => handleColumnSort('cost')}
                className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
              >
                Cost/Unit
                {getSortIcon('cost')}
              </button>
            </th>
            <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              <button
                onClick={() => handleColumnSort('supplier')}
                className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
              >
                Supplier
                {getSortIcon('supplier')}
              </button>
            </th>
            <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              <button
                onClick={() => handleColumnSort('stock')}
                className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
              >
                Stock
                {getSortIcon('stock')}
              </button>
            </th>
            <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--muted)]">
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
