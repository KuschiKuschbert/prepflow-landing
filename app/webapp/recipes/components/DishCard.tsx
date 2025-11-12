'use client';

import React from 'react';
import { Dish, DishCostData } from '../types';
import { Edit, Trash2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

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
    <div className="p-4 transition-colors hover:bg-[#2a2a2a]/20">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center">
          <button
            onClick={() => onSelectDish(dish.id)}
            className="mr-3 flex items-center justify-center transition-colors hover:text-[#29E7CD]"
            aria-label={`${selectedDishes.has(dish.id) ? 'Deselect' : 'Select'} dish ${capitalizeDishName(dish.dish_name)}`}
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
          <h3
            className="cursor-pointer text-sm font-medium text-white"
            onClick={() => onPreviewDish(dish)}
          >
            {capitalizeDishName(dish.dish_name)}
          </h3>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(dish.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="mb-3 ml-7 space-y-1 text-xs text-gray-500">
        <div>
          <span className="font-medium">Selling Price:</span>
          <span className="ml-1 font-semibold text-white">${dish.selling_price.toFixed(2)}</span>
        </div>
        {dishCost && (
          <>
            <div>
              <span className="font-medium">Cost:</span>
              <span className="ml-1 font-semibold text-white">
                ${dishCost.total_cost.toFixed(2)}
              </span>
            </div>
            <div>
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
      </div>

      <div className="ml-7 flex gap-2">
        <button
          onClick={() => onPreviewDish(dish)}
          className="rounded-lg bg-[#2a2a2a]/50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
        >
          Preview
        </button>
        <button
          onClick={() => onEditDish(dish)}
          className="rounded-lg bg-[#2a2a2a]/50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
          aria-label={`Edit dish ${capitalizeDishName(dish.dish_name)}`}
        >
          <Icon icon={Edit} size="xs" />
        </button>
        <button
          onClick={() => onDeleteDish(dish)}
          className="rounded-lg bg-[#2a2a2a]/50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-red-400"
          aria-label={`Delete dish ${capitalizeDishName(dish.dish_name)}`}
        >
          <Icon icon={Trash2} size="xs" />
        </button>
      </div>
    </div>
  );
});

export default DishCard;
