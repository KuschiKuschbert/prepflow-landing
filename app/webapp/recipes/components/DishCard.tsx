'use client';

import React from 'react';
import { Dish, DishCostData } from '../types';
import { Edit, Trash2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { formatRecipeDate } from '../utils/formatDate';

interface DishCardProps {
  dish: Dish;
  dishCost?: DishCostData;
  selectedDishes: Set<string>;
  onSelectDish: (dishId: string) => void;
  onPreviewDish: (dish: Dish) => void;
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dish: Dish) => void;
}

const DishCard = React.memo(function DishCard({
  dish,
  dishCost,
  selectedDishes,
  onSelectDish,
  onPreviewDish,
  onEditDish,
  onDeleteDish,
}: DishCardProps) {
  const capitalizeDishName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div
      className="border-l-2 border-[#29E7CD]/30 bg-[#29E7CD]/2 p-4 transition-colors hover:bg-[#29E7CD]/5 cursor-pointer"
      onClick={(e) => {
        // Don't trigger if clicking on buttons or checkbox
        if ((e.target as HTMLElement).closest('button')) return;
        onPreviewDish(dish);
      }}
      title="Click to preview dish details"
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectDish(dish.id);
            }}
            className="mr-3 flex items-center justify-center transition-colors hover:text-[#29E7CD]"
            aria-label={`${selectedDishes.has(dish.id) ? 'Deselect' : 'Select'} dish ${capitalizeDishName(dish.dish_name)}`}
            title={selectedDishes.has(dish.id) ? 'Deselect dish' : 'Select dish'}
          >
            {selectedDishes.has(dish.id) ? (
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
          <h3 className="text-sm font-medium text-white">
            {capitalizeDishName(dish.dish_name)}
          </h3>
        </div>
        <span className="text-xs text-gray-500" title={`Created on ${formatRecipeDate(dish.created_at)}`}>{formatRecipeDate(dish.created_at)}</span>
      </div>

      <div className="mb-3 ml-7 space-y-1 text-xs text-gray-500">
        <div title="The price customers pay for this dish">
          <span className="font-medium">Selling Price:</span>
          <span className="ml-1 font-semibold text-white">${dish.selling_price.toFixed(2)}</span>
        </div>
        {dishCost && (
          <>
            <div title="Total cost of all ingredients in this dish">
              <span className="font-medium">Cost:</span>
              <span className="ml-1 font-semibold text-white">
                ${dishCost.total_cost.toFixed(2)}
              </span>
            </div>
            <div title={`Profit margin: ${dishCost.gross_profit_margin >= 30 ? 'Excellent' : 'Good'} - ${dishCost.gross_profit_margin >= 30 ? 'Target achieved' : 'Consider optimizing'}`}>
              <span className="font-medium">Profit Margin:</span>
              <span
                className={`ml-1 font-semibold ${
                  dishCost.gross_profit_margin >= 30 ? 'text-green-400' : 'text-yellow-400'
                }`}
              >
                {dishCost.gross_profit_margin.toFixed(1)}%
              </span>
            </div>
          </>
        )}
        {!dishCost && (
          <div className="text-xs text-gray-600 italic" title="Click Preview to see cost breakdown">
            Cost calculation pending...
          </div>
        )}
      </div>

      <div className="ml-7 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreviewDish(dish);
          }}
          className="rounded-lg bg-[#2a2a2a]/50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          title="View full dish details and cost breakdown"
        >
          Preview
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditDish(dish);
          }}
          className="rounded-lg bg-[#2a2a2a]/50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
          aria-label={`Edit dish ${capitalizeDishName(dish.dish_name)}`}
          title="Edit dish in builder"
        >
          <Icon icon={Edit} size="xs" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteDish(dish);
          }}
          className="rounded-lg bg-[#2a2a2a]/50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-red-400"
          aria-label={`Delete dish ${capitalizeDishName(dish.dish_name)}`}
          title="Delete this dish"
        >
          <Icon icon={Trash2} size="xs" />
        </button>
      </div>
    </div>
  );
});

export default DishCard;
