'use client';

import React from 'react';
import { Dish, DishCostData } from '../types';
import { Edit, Trash2, Check, Eye } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { formatRecipeDate } from '../utils/formatDate';
import { useLongPress } from '@/app/webapp/ingredients/hooks/useLongPress';

interface DishTableRowProps {
  dish: Dish;
  cost?: DishCostData;
  selectedDishes: Set<string>;
  isSelectionMode: boolean;
  isHighlighting?: boolean;
  onSelectDish: (dishId: string) => void;
  onPreviewDish: (dish: Dish) => void;
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dish: Dish) => void;
  capitalizeDishName: (name: string) => string;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

export function DishTableRow({
  dish,
  cost,
  selectedDishes,
  isSelectionMode,
  isHighlighting = false,
  onSelectDish,
  onPreviewDish,
  onEditDish,
  onDeleteDish,
  capitalizeDishName,
  onCancelLongPress,
  onEnterSelectionMode,
}: DishTableRowProps) {
  const isSelected = selectedDishes.has(dish.id);

  const longPressHandlers = useLongPress({
    onLongPress: () => {
      if (!isSelectionMode) {
        onEnterSelectionMode?.();
        if (!isSelected) onSelectDish(dish.id);
      }
    },
    onCancel: onCancelLongPress,
    delay: 500,
  });

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }

    if (isSelectionMode) {
      e.preventDefault();
      e.stopPropagation();
      onSelectDish(dish.id);
    } else {
      onPreviewDish(dish);
    }
  };

  return (
    <tr
      className={`border-l-2 border-[#29E7CD]/30 bg-[#29E7CD]/2 transition-colors ${
        isSelectionMode ? 'cursor-pointer' : 'cursor-pointer hover:bg-[#29E7CD]/5'
      } ${isSelected && isSelectionMode ? 'bg-[#29E7CD]/10' : ''}`}
      onClick={handleRowClick}
      title={isSelectionMode ? 'Tap to select' : 'Click to preview dish'}
      onTouchStart={isSelectionMode ? undefined : longPressHandlers.onTouchStart}
      onTouchMove={isSelectionMode ? undefined : longPressHandlers.onTouchMove}
      onTouchEnd={isSelectionMode ? undefined : longPressHandlers.onTouchEnd}
    >
      <td
        className="px-6 py-4 text-sm font-medium whitespace-nowrap text-white"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => onSelectDish(dish.id)}
          className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
          aria-label={`${isSelected ? 'Deselect' : 'Select'} dish ${capitalizeDishName(dish.dish_name)}`}
        >
          {isSelected ? (
            <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
          ) : (
            <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
          )}
        </button>
      </td>
      <td
        className={`px-6 py-4 text-sm font-medium text-white transition-all duration-300 ${
          !isSelectionMode ? 'cursor-pointer' : ''
        } ${
          isHighlighting
            ? 'border-l-4 border-[#29E7CD] bg-[#29E7CD]/10 animate-[highlightPulse_0.5s_ease-in-out]'
            : ''
        }`}
        onClick={!isSelectionMode ? () => onPreviewDish(dish) : undefined}
      >
        {capitalizeDishName(dish.dish_name)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-300">
        ${dish.selling_price.toFixed(2)}
      </td>
      <td className="hidden px-6 py-4 text-sm text-gray-300 lg:table-cell">
        {cost ? `$${cost.total_cost.toFixed(2)}` : '—'}
      </td>
      <td className="hidden px-6 py-4 text-sm lg:table-cell">
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
      <td className="hidden px-6 py-4 text-sm text-gray-400 lg:table-cell">
        {formatRecipeDate(dish.created_at)}
      </td>
      <td className="px-6 py-4 text-sm font-medium">
        <div className="flex gap-2">
          <button
            onClick={() => onPreviewDish(dish)}
            className="text-gray-400 transition-colors hover:text-[#29E7CD]"
            aria-label={`Preview dish ${capitalizeDishName(dish.dish_name)}`}
            title="Preview full details"
          >
            <Icon icon={Eye} size="sm" aria-hidden={true} />
          </button>
          <button
            onClick={() => onEditDish(dish)}
            className="text-gray-400 transition-colors hover:text-[#29E7CD]"
            aria-label={`Edit dish ${capitalizeDishName(dish.dish_name)}`}
            title="Edit dish"
          >
            <Icon icon={Edit} size="sm" aria-hidden={true} />
          </button>
          <button
            onClick={() => onDeleteDish(dish)}
            className="text-gray-400 transition-colors hover:text-red-400"
            aria-label={`Delete dish ${capitalizeDishName(dish.dish_name)}`}
            title="Delete dish"
          >
            <Icon icon={Trash2} size="sm" aria-hidden={true} />
          </button>
        </div>
      </td>
    </tr>
  );
}
