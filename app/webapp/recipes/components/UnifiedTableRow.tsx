'use client';

import { useLongPress } from '@/app/webapp/ingredients/hooks/useLongPress';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Check, Edit, Eye, Trash2 } from 'lucide-react';
import React from 'react';
import { Dish, DishCostData, Recipe, RecipePriceData } from '../types';
import { formatRecipeDate } from '../utils/formatDate';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

interface UnifiedTableRowProps {
  item: UnifiedItem;
  dishCost?: DishCostData;
  recipePrice?: RecipePriceData;
  selectedItems: Set<string>;
  isSelectionMode: boolean;
  isHighlighting?: boolean;
  onSelectItem: (itemId: string) => void;
  onPreviewDish: (dish: Dish) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onEditDish: (dish: Dish) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteDish: (dish: Dish) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  capitalizeRecipeName: (name: string) => string;
  capitalizeDishName: (name: string) => string;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

export function UnifiedTableRow({
  item,
  dishCost,
  recipePrice,
  selectedItems,
  isSelectionMode,
  isHighlighting = false,
  onSelectItem,
  onPreviewDish,
  onPreviewRecipe,
  onEditDish,
  onEditRecipe,
  onDeleteDish,
  onDeleteRecipe,
  capitalizeRecipeName,
  capitalizeDishName,
  onCancelLongPress,
  onEnterSelectionMode,
}: UnifiedTableRowProps) {
  const isSelected = selectedItems.has(item.id);
  const isDish = item.itemType === 'dish';
  const dish = isDish ? (item as Dish) : null;
  const recipe = !isDish ? (item as Recipe) : null;

  const longPressHandlers = useLongPress({
    onLongPress: () => {
      if (!isSelectionMode) {
        onEnterSelectionMode?.();
        if (!isSelected) onSelectItem(item.id);
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
      onSelectItem(item.id);
    } else {
      if (isDish && dish) {
        onPreviewDish(dish);
      } else if (recipe) {
        onPreviewRecipe(recipe);
      }
    }
  };

  const borderColor = isDish ? 'border-[#29E7CD]/30' : 'border-[#3B82F6]/30';
  const bgColor = isDish ? 'bg-[#29E7CD]/2' : 'bg-[#3B82F6]/2';
  const hoverColor = isDish ? 'hover:bg-[#29E7CD]/5' : 'hover:bg-[#3B82F6]/5';
  const selectedColor = isDish ? 'bg-[#29E7CD]/10' : 'bg-[#3B82F6]/10';

  const itemName =
    isDish && dish
      ? capitalizeDishName(dish.dish_name)
      : recipe
        ? capitalizeRecipeName(recipe.recipe_name)
        : '';

  return (
    <tr
      className={`border-l-2 ${borderColor} ${bgColor} transition-colors ${
        isSelectionMode ? 'cursor-pointer' : `cursor-pointer ${hoverColor}`
      } ${isSelected && isSelectionMode ? selectedColor : ''}`}
      onClick={handleRowClick}
      title={isSelectionMode ? 'Tap to select' : `Click to preview ${isDish ? 'dish' : 'recipe'}`}
      onTouchStart={isSelectionMode ? undefined : longPressHandlers.onTouchStart}
      onTouchMove={isSelectionMode ? undefined : longPressHandlers.onTouchMove}
      onTouchEnd={isSelectionMode ? undefined : longPressHandlers.onTouchEnd}
    >
      {/* Checkbox */}
      <td
        className="px-6 py-4 text-sm font-medium whitespace-nowrap text-white"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => onSelectItem(item.id)}
          className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
          aria-label={`${isSelected ? 'Deselect' : 'Select'} ${isDish ? 'dish' : 'recipe'} ${itemName}`}
        >
          {isSelected ? (
            <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
          ) : (
            <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
          )}
        </button>
      </td>

      {/* Type Badge */}
      <td className="px-6 py-4 text-sm">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isDish
              ? 'border border-[#29E7CD]/20 bg-[#29E7CD]/10 text-[#29E7CD]'
              : 'border border-[#3B82F6]/20 bg-[#3B82F6]/10 text-[#3B82F6]'
          }`}
        >
          {isDish ? 'Dish' : 'Recipe'}
        </span>
      </td>

      {/* Name */}
      <td
        className={`px-6 py-4 text-sm font-medium text-white transition-all duration-300 ${
          !isSelectionMode ? 'cursor-pointer' : ''
        } ${
          isHighlighting
            ? 'animate-[highlightPulse_0.5s_ease-in-out] border-l-4 border-[#29E7CD] bg-[#29E7CD]/10'
            : ''
        }`}
        onClick={
          !isSelectionMode
            ? () =>
                isDish && dish ? onPreviewDish(dish) : recipe ? onPreviewRecipe(recipe) : undefined
            : undefined
        }
      >
        {itemName}
      </td>

      {/* Price (Recommended Price for both dishes and recipes) */}
      <td
        className={`px-6 py-4 text-sm whitespace-nowrap text-gray-300 ${!isSelectionMode ? 'cursor-pointer' : ''}`}
        onClick={
          !isSelectionMode
            ? () =>
                isDish && dish ? onPreviewDish(dish) : recipe ? onPreviewRecipe(recipe) : undefined
            : undefined
        }
      >
        {isDish && dish ? (
          dishCost ? (
            `$${dishCost.recommendedPrice.toFixed(2)}`
          ) : (
            <LoadingSkeleton variant="text" width="w-20" height="h-4" />
          )
        ) : recipe && recipePrice ? (
          `$${recipePrice.recommendedPrice.toFixed(2)}`
        ) : recipe ? (
          <LoadingSkeleton variant="text" width="w-20" height="h-4" />
        ) : (
          '—'
        )}
      </td>

      {/* Contributing Margin */}
      <td
        className={`desktop:table-cell hidden px-6 py-4 text-sm whitespace-nowrap text-gray-300 ${!isSelectionMode ? 'cursor-pointer' : ''}`}
        onClick={
          !isSelectionMode
            ? () =>
                isDish && dish ? onPreviewDish(dish) : recipe ? onPreviewRecipe(recipe) : undefined
            : undefined
        }
      >
        {isDish && dish ? (
          dishCost ? (
            (() => {
              // Calculate contributing margin based on recommended price (matching side panel calculation)
              const gstRate = 0.1; // 10% GST for Australia
              const recommendedPriceExclGST = dishCost.recommendedPrice / (1 + gstRate);
              const recommendedContributingMargin = recommendedPriceExclGST - dishCost.total_cost;

              return (
                <span className="font-semibold text-[#D925C7]">
                  ${recommendedContributingMargin.toFixed(2)}
                </span>
              );
            })()
          ) : (
            '—'
          )
        ) : recipe && recipePrice ? (
          <div className="flex flex-col">
            <span className="font-semibold text-[#D925C7]">
              ${recipePrice.contributingMargin.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">/portion</span>
          </div>
        ) : (
          '—'
        )}
      </td>

      {/* Profit Margin */}
      <td className="desktop:table-cell hidden px-6 py-4 text-sm">
        {isDish && dish ? (
          dishCost ? (
            (() => {
              // Calculate profit margin based on recommended price (matching side panel calculation)
              const gstRate = 0.1; // 10% GST for Australia
              const recommendedPriceExclGST = dishCost.recommendedPrice / (1 + gstRate);
              const recommendedGrossProfit = recommendedPriceExclGST - dishCost.total_cost;
              const recommendedGrossProfitMargin =
                recommendedPriceExclGST > 0
                  ? (recommendedGrossProfit / recommendedPriceExclGST) * 100
                  : 0;

              return (
                <span
                  className={`font-semibold ${
                    recommendedGrossProfitMargin >= 30 ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {recommendedGrossProfitMargin.toFixed(1)}%
                </span>
              );
            })()
          ) : (
            <span className="text-gray-500">—</span>
          )
        ) : recipe && recipePrice ? (
          <div className="flex flex-col">
            <span className="font-semibold text-white">
              {recipePrice.gross_profit_margin.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400">
              ${recipePrice.gross_profit.toFixed(2)}/portion
            </span>
          </div>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </td>

      {/* Created */}
      <td className="desktop:table-cell hidden px-6 py-4 text-sm text-gray-400">
        {formatRecipeDate(item.created_at)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-sm font-medium" onClick={e => e.stopPropagation()}>
        <div className="flex gap-2">
          <button
            onClick={() =>
              isDish && dish ? onPreviewDish(dish) : recipe ? onPreviewRecipe(recipe) : undefined
            }
            className="text-gray-400 transition-colors hover:text-[#29E7CD]"
            aria-label={`Preview ${isDish ? 'dish' : 'recipe'} ${itemName}`}
            title="Preview full details"
          >
            <Icon icon={Eye} size="sm" aria-hidden={true} />
          </button>
          <button
            onClick={() =>
              isDish && dish ? onEditDish(dish) : recipe ? onEditRecipe(recipe) : undefined
            }
            className="text-gray-400 transition-colors hover:text-[#29E7CD]"
            aria-label={`Edit ${isDish ? 'dish' : 'recipe'} ${itemName}`}
            title={`Edit ${isDish ? 'dish' : 'recipe'}`}
          >
            <Icon icon={Edit} size="sm" aria-hidden={true} />
          </button>
          <button
            onClick={() =>
              isDish && dish ? onDeleteDish(dish) : recipe ? onDeleteRecipe(recipe) : undefined
            }
            className="text-gray-400 transition-colors hover:text-red-400"
            aria-label={`Delete ${isDish ? 'dish' : 'recipe'} ${itemName}`}
            title={`Delete ${isDish ? 'dish' : 'recipe'}`}
          >
            <Icon icon={Trash2} size="sm" aria-hidden={true} />
          </button>
        </div>
      </td>
    </tr>
  );
}
