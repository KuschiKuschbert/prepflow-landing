'use client';

import { Icon } from '@/components/ui/Icon';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo } from 'react';
import { Dish, DishCostData, Recipe, RecipePriceData } from '../types';
import { UnifiedItem, UnifiedSortField } from './types';
import { UnifiedTableRow } from './UnifiedTableRow';

interface UnifiedTableProps {
  items: UnifiedItem[];
  dishCosts: Map<string, DishCostData>;
  recipePrices: Record<string, RecipePriceData>;
  selectedItems: Set<string>;
  highlightingRowId: string | null;
  highlightingRowType: 'recipe' | 'dish' | null;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  isSelectionMode: boolean;
  capitalizeRecipeName: (name: string) => string;
  capitalizeDishName: (name: string) => string;
  onSelectAll: () => void;
  onSelectItem: (itemId: string) => void;
  onPreviewDish: (dish: Dish) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onEditDish: (dish: Dish) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteDish: (dish: Dish) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  onSortChange?: (field: string, direction: 'asc' | 'desc') => void;
  onStartLongPress: () => void;
  onCancelLongPress: () => void;
  onEnterSelectionMode: () => void;
}

export function UnifiedTable({
  items,
  dishCosts,
  recipePrices,
  selectedItems,
  highlightingRowId,
  highlightingRowType,
  sortField,
  sortDirection,
  isSelectionMode,
  capitalizeRecipeName,
  capitalizeDishName,
  onSelectAll,
  onSelectItem,
  onPreviewDish,
  onPreviewRecipe,
  onEditDish,
  onEditRecipe,
  onDeleteDish,
  onDeleteRecipe,
  onSortChange,
  onStartLongPress: _onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: UnifiedTableProps) {
  const allSelected = items.length > 0 && items.every(item => selectedItems.has(item.id));

  // Memoize items with pre-calculated values to prevent recalculation on every render
  const itemsWithCalculations = useMemo(() => {
    return items.map(item => {
      const dishCost = item.itemType === 'dish' ? dishCosts.get(item.id) : undefined;
      const recipePrice = item.itemType === 'recipe' ? recipePrices[item.id] : undefined;
      const isHighlighting =
        (item.itemType === 'dish' &&
          highlightingRowType === 'dish' &&
          highlightingRowId === item.id) ||
        (item.itemType === 'recipe' &&
          highlightingRowType === 'recipe' &&
          highlightingRowId === item.id);

      return {
        ...item,
        dishCost,
        recipePrice,
        isHighlighting,
      };
    });
  }, [items, dishCosts, recipePrices, highlightingRowId, highlightingRowType]);

  const handleColumnSort = (field: UnifiedSortField) => {
    if (!onSortChange) return;
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(field, newDirection);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <Icon icon={ChevronUp} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
    ) : (
      <Icon icon={ChevronDown} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
    );
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="desktop:block hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--muted)]">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20">
            <tr>
              {/* Checkbox */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                <button
                  onClick={onSelectAll}
                  className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
                  aria-label={allSelected ? 'Deselect all' : 'Select all'}
                >
                  {allSelected ? (
                    <Icon
                      icon={Check}
                      size="sm"
                      className="text-[var(--primary)]"
                      aria-hidden={true}
                    />
                  ) : (
                    <div className="h-4 w-4 rounded border border-[var(--border)] bg-[var(--background)] transition-colors hover:border-[var(--primary)]/50" />
                  )}
                </button>
              </th>

              {/* Type */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Type
              </th>

              {/* Name */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                {onSortChange ? (
                  <button
                    onClick={() => handleColumnSort('name')}
                    className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
                    aria-label="Sort by name"
                  >
                    Name
                    {getSortIcon('name')}
                  </button>
                ) : (
                  'Name'
                )}
              </th>

              {/* Price */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                {onSortChange ? (
                  <button
                    onClick={() => {
                      // Use selling_price as default, but show icon for either field
                      const field =
                        sortField === 'recommended_price' ? 'recommended_price' : 'selling_price';
                      handleColumnSort(field as UnifiedSortField);
                    }}
                    className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
                    aria-label="Sort by price"
                  >
                    Price
                    {getSortIcon('selling_price') || getSortIcon('recommended_price')}
                  </button>
                ) : (
                  'Price'
                )}
              </th>

              {/* Contributing Margin */}
              <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                {onSortChange ? (
                  <button
                    onClick={() => {
                      // Use contributing_margin for both dishes and recipes
                      const field =
                        sortField === 'contributing_margin'
                          ? 'contributing_margin'
                          : 'contributing_margin';
                      handleColumnSort(field as UnifiedSortField);
                    }}
                    className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
                    aria-label="Sort by contributing margin"
                  >
                    Contributing Margin
                    {getSortIcon('contributing_margin')}
                  </button>
                ) : (
                  'Contributing Margin'
                )}
              </th>

              {/* Profit Margin */}
              <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                {onSortChange ? (
                  <button
                    onClick={() => handleColumnSort('profit_margin')}
                    className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
                    aria-label="Sort by profit margin"
                  >
                    Profit Margin
                    {getSortIcon('profit_margin')}
                  </button>
                ) : (
                  'Profit Margin'
                )}
              </th>

              {/* Created */}
              <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                {onSortChange ? (
                  <button
                    onClick={() => handleColumnSort('created')}
                    className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
                    aria-label="Sort by created date"
                  >
                    Created
                    {getSortIcon('created')}
                  </button>
                ) : (
                  'Created'
                )}
              </th>

              {/* Actions */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--muted)] bg-[var(--surface)]">
            {itemsWithCalculations.map(item => {
              return (
                <UnifiedTableRow
                  key={`${item.itemType}-${item.id}`}
                  item={item}
                  dishCost={item.dishCost}
                  recipePrice={item.recipePrice}
                  selectedItems={selectedItems}
                  isSelectionMode={isSelectionMode}
                  isHighlighting={item.isHighlighting}
                  onSelectItem={onSelectItem}
                  onPreviewDish={onPreviewDish}
                  onPreviewRecipe={onPreviewRecipe}
                  onEditDish={onEditDish}
                  onEditRecipe={onEditRecipe}
                  onDeleteDish={onDeleteDish}
                  onDeleteRecipe={onDeleteRecipe}
                  capitalizeRecipeName={capitalizeRecipeName}
                  capitalizeDishName={capitalizeDishName}
                  onCancelLongPress={onCancelLongPress}
                  onEnterSelectionMode={onEnterSelectionMode}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
