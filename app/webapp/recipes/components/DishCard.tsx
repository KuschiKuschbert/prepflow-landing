'use client';

import React from 'react';
import { Dish, DishCostData } from '@/lib/types/recipes';
import { Edit, Trash2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { formatRecipeDate } from '../utils/formatDate';
import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import { DietaryBadge } from '@/components/ui/DietaryBadge';

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
      className="cursor-pointer border-l-2 border-[var(--primary)]/30 bg-[var(--primary)]/2 p-4 transition-colors hover:bg-[var(--primary)]/5"
      onClick={e => {
        // Don't trigger if clicking on buttons or checkbox
        if ((e.target as HTMLElement).closest('button')) return;
        onPreviewDish(dish);
      }}
      title="Click to preview dish details"
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center">
          <button
            onClick={e => {
              e.stopPropagation();
              onSelectDish(dish.id);
            }}
            className="mr-3 flex items-center justify-center transition-colors hover:text-[var(--primary)]"
            aria-label={`${selectedDishes.has(dish.id) ? 'Deselect' : 'Select'} dish ${capitalizeDishName(dish.dish_name)}`}
            title={selectedDishes.has(dish.id) ? 'Deselect dish' : 'Select dish'}
          >
            {selectedDishes.has(dish.id) ? (
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
          <h3 className="text-sm font-medium text-[var(--foreground)]">
            {capitalizeDishName(dish.dish_name)}
          </h3>
        </div>
        <span
          className="text-xs text-[var(--foreground-subtle)]"
          title={`Created on ${formatRecipeDate(dish.created_at)}`}
        >
          {formatRecipeDate(dish.created_at)}
        </span>
      </div>

      <div className="mb-3 ml-7 space-y-1 text-xs text-[var(--foreground-subtle)]">
        <div title="The price customers pay for this dish">
          <span className="font-medium">Selling Price:</span>
          <span className="ml-1 font-semibold text-[var(--foreground)]">
            ${dish.selling_price.toFixed(2)}
          </span>
        </div>
        {dishCost && (
          <>
            <div title="Total cost of all ingredients in this dish">
              <span className="font-medium">Cost:</span>
              <span className="ml-1 font-semibold text-[var(--foreground)]">
                ${dishCost.total_cost.toFixed(2)}
              </span>
            </div>
            <div
              title={`Profit margin: ${dishCost.gross_profit_margin >= 30 ? 'Excellent' : 'Good'} - ${dishCost.gross_profit_margin >= 30 ? 'Target achieved' : 'Consider optimizing'}`}
            >
              <span className="font-medium">Profit Margin:</span>
              <span
                className={`ml-1 font-semibold ${
                  dishCost.gross_profit_margin >= 30
                    ? 'text-[var(--color-success)]'
                    : 'text-[var(--color-warning)]'
                }`}
              >
                {dishCost.gross_profit_margin.toFixed(1)}%
              </span>
            </div>
          </>
        )}
        {!dishCost && (
          <div
            className="text-xs text-[var(--foreground-subtle)] italic"
            title="Click Preview to see cost breakdown"
          >
            Cost calculation pending...
          </div>
        )}
      </div>

      {/* Allergens and Dietary Info */}
      {((dish.allergens?.length ?? 0) > 0 || dish.is_vegetarian || dish.is_vegan) && (
        <div className="mb-3 ml-7 space-y-2">
          {dish.allergens && dish.allergens.length > 0 && (
            <div>
              <span className="text-xs font-medium text-[var(--foreground-muted)]">Allergens:</span>
              <div className="mt-1">
                <AllergenDisplay allergens={dish.allergens} size="sm" showEmpty={false} />
              </div>
            </div>
          )}
          <DietaryBadge
            isVegetarian={dish.is_vegetarian}
            isVegan={dish.is_vegan}
            confidence={dish.dietary_confidence}
            size="sm"
          />
        </div>
      )}

      <div className="ml-7 flex gap-2">
        <button
          onClick={e => {
            e.stopPropagation();
            onPreviewDish(dish);
          }}
          className="rounded-lg bg-[var(--muted)]/50 px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          title="View full dish details and cost breakdown"
        >
          Preview
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onEditDish(dish);
          }}
          className="rounded-lg bg-[var(--muted)]/50 px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)]"
          aria-label={`Edit dish ${capitalizeDishName(dish.dish_name)}`}
          title="Edit dish in builder"
        >
          <Icon icon={Edit} size="xs" />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onDeleteDish(dish);
          }}
          className="rounded-lg bg-[var(--muted)]/50 px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--color-error)]"
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
