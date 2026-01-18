'use client';
import React from 'react';
import { Dish, DishCostData } from '../types';
import { Check } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useDishTableSort } from '../hooks/useDishTableSort';
import { DishTableRow } from './DishTableRow';

interface DishTableProps {
  dishes: Dish[];
  dishCosts: Map<string, DishCostData>;
  selectedDishes: Set<string>;
  highlightingRowId?: string | null;
  onSelectAll: () => void;
  onSelectDish: (dishId: string) => void;
  onPreviewDish: (dish: Dish) => void;
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dish: Dish) => void;
  sortField?: 'name' | 'selling_price' | 'cost' | 'profit_margin' | 'created';
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (
    field: 'name' | 'selling_price' | 'cost' | 'profit_margin' | 'created',
    direction: 'asc' | 'desc',
  ) => void;
  isSelectionMode?: boolean;
  onStartLongPress?: () => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

const DishTable = React.memo(function DishTable({
  dishes,
  dishCosts,
  selectedDishes,
  highlightingRowId = null,
  onSelectAll,
  onSelectDish,
  onPreviewDish,
  onEditDish,
  onDeleteDish,
  sortField = 'name',
  sortDirection = 'asc',
  onSortChange,
  isSelectionMode = false,
  onStartLongPress: _onStartLongPress,
  onCancelLongPress,
  onEnterSelectionMode,
}: DishTableProps) {
  const capitalizeDishName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const { handleColumnSort, getSortIcon } = useDishTableSort({
    sortField,
    sortDirection,
    onSortChange: onSortChange || (() => {}),
  });

  return (
    <div className="desktop:block hidden overflow-x-auto">
      <table className="min-w-full divide-y divide-[var(--muted)]">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              <button
                onClick={onSelectAll}
                className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
                aria-label={selectedDishes.size === dishes.length ? 'Deselect all' : 'Select all'}
              >
                {selectedDishes.size === dishes.length && dishes.length > 0 ? (
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
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('selling_price')}
                  className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
                  aria-label="Sort by selling price"
                >
                  Selling Price
                  {getSortIcon('selling_price')}
                </button>
              ) : (
                'Selling Price'
              )}
            </th>
            <th className="desktop:table-cell hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('cost')}
                  className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]"
                  aria-label="Sort by cost"
                >
                  Cost
                  {getSortIcon('cost')}
                </button>
              ) : (
                'Cost'
              )}
            </th>
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
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--muted)] bg-[var(--surface)]">
          {dishes.map(dish => (
            <DishTableRow
              key={dish.id}
              dish={dish}
              cost={dishCosts.get(dish.id)}
              selectedDishes={selectedDishes}
              isSelectionMode={isSelectionMode}
              isHighlighting={highlightingRowId === dish.id}
              onSelectDish={onSelectDish}
              onPreviewDish={onPreviewDish}
              onEditDish={onEditDish}
              onDeleteDish={onDeleteDish}
              capitalizeDishName={capitalizeDishName}
              onCancelLongPress={onCancelLongPress}
              onEnterSelectionMode={onEnterSelectionMode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default DishTable;
