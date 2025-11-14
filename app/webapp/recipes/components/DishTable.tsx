'use client';

import React from 'react';
import { Dish, DishCostData } from '../types';
import { Edit, Trash2, Check } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { formatRecipeDate } from '../utils/formatDate';
import { useDishTableSort } from '../hooks/useDishTableSort';

interface DishTableProps {
  dishes: Dish[];
  dishCosts: Map<string, DishCostData>;
  selectedDishes: Set<string>;
  onSelectAll: () => void;
  onSelectDish: (dishId: string) => void;
  onPreviewDish: (dish: Dish) => void;
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dish: Dish) => void;
  sortField?: 'name' | 'selling_price' | 'cost' | 'profit_margin' | 'created';
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (field: 'name' | 'selling_price' | 'cost' | 'profit_margin' | 'created', direction: 'asc' | 'desc') => void;
}

const DishTable = React.memo(function DishTable({
  dishes,
  dishCosts,
  selectedDishes,
  onSelectAll,
  onSelectDish,
  onPreviewDish,
  onEditDish,
  onDeleteDish,
  sortField = 'name',
  sortDirection = 'asc',
  onSortChange,
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
    <div className="hidden overflow-x-auto tablet:block">
      <table className="min-w-full divide-y divide-[#2a2a2a]">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              <button
                onClick={onSelectAll}
                className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
                aria-label={selectedDishes.size === dishes.length ? 'Deselect all' : 'Select all'}
              >
                {selectedDishes.size === dishes.length && dishes.length > 0 ? (
                  <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                ) : (
                  <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('name')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by name"
                >
                  Name
                  {getSortIcon('name')}
                </button>
              ) : (
                'Name'
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('selling_price')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by selling price"
                >
                  Selling Price
                  {getSortIcon('selling_price')}
                </button>
              ) : (
                'Selling Price'
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('cost')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by cost"
                >
                  Cost
                  {getSortIcon('cost')}
                </button>
              ) : (
                'Cost'
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('profit_margin')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by profit margin"
                >
                  Profit Margin
                  {getSortIcon('profit_margin')}
                </button>
              ) : (
                'Profit Margin'
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              {onSortChange ? (
                <button
                  onClick={() => handleColumnSort('created')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by created date"
                >
                  Created
                  {getSortIcon('created')}
                </button>
              ) : (
                'Created'
              )}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
          {dishes.map(dish => {
            const cost = dishCosts.get(dish.id);
            return (
              <tr key={dish.id} className="transition-colors hover:bg-[#2a2a2a]/20">
                <td
                  className="px-6 py-4 text-sm font-medium whitespace-nowrap text-white"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => onSelectDish(dish.id)}
                    className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
                    aria-label={`${selectedDishes.has(dish.id) ? 'Deselect' : 'Select'} dish ${capitalizeDishName(dish.dish_name)}`}
                  >
                    {selectedDishes.has(dish.id) ? (
                      <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                    ) : (
                      <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
                    )}
                  </button>
                </td>
                <td
                  className="cursor-pointer px-6 py-4 text-sm font-medium text-white"
                  onClick={() => onPreviewDish(dish)}
                >
                  {capitalizeDishName(dish.dish_name)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  ${dish.selling_price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {cost ? `$${cost.total_cost.toFixed(2)}` : '—'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {cost ? (
                    <span
                      className={`font-semibold ${
                        cost.gross_profit_margin >= 30 ? 'text-green-400' : 'text-yellow-400'
                      }`}
                    >
                      {cost.gross_profit_margin.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {formatRecipeDate(dish.created_at)}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onPreviewDish(dish)}
                      className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
                      aria-label={`Preview dish ${capitalizeDishName(dish.dish_name)}`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => onEditDish(dish)}
                      className="text-gray-400 transition-colors hover:text-[#29E7CD]"
                      aria-label={`Edit dish ${capitalizeDishName(dish.dish_name)}`}
                    >
                      <Icon icon={Edit} size="sm" />
                    </button>
                    <button
                      onClick={() => onDeleteDish(dish)}
                      className="text-gray-400 transition-colors hover:text-red-400"
                      aria-label={`Delete dish ${capitalizeDishName(dish.dish_name)}`}
                    >
                      <Icon icon={Trash2} size="sm" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

export default DishTable;
