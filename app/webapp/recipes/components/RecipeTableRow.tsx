'use client';

import React from 'react';
import { Recipe, RecipePriceData } from '../types';
import { Edit, Trash2, Check, Eye } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatRecipeDate } from '../utils/formatDate';
import { useLongPress } from '@/app/webapp/ingredients/hooks/useLongPress';

interface RecipeTableRowProps {
  recipe: Recipe;
  recipePrice?: RecipePriceData;
  selectedRecipes: Set<string>;
  isSelectionMode: boolean;
  isHighlighting?: boolean;
  onSelectRecipe: (recipeId: string) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  capitalizeRecipeName: (name: string) => string;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

export function RecipeTableRow({
  recipe,
  recipePrice,
  selectedRecipes,
  isSelectionMode,
  isHighlighting = false,
  onSelectRecipe,
  onPreviewRecipe,
  onEditRecipe,
  onDeleteRecipe,
  capitalizeRecipeName,
  onCancelLongPress,
  onEnterSelectionMode,
}: RecipeTableRowProps) {
  const isSelected = selectedRecipes.has(recipe.id);

  const longPressHandlers = useLongPress({
    onLongPress: () => {
      if (!isSelectionMode) {
        onEnterSelectionMode?.();
        if (!isSelected) onSelectRecipe(recipe.id);
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
      onSelectRecipe(recipe.id);
    } else {
      onPreviewRecipe(recipe);
    }
  };

  return (
    <tr
      className={`border-l-2 border-[#3B82F6]/30 bg-[#3B82F6]/2 transition-colors ${
        isSelectionMode ? 'cursor-pointer' : 'cursor-pointer hover:bg-[#3B82F6]/5'
      } ${isSelected && isSelectionMode ? 'bg-[#3B82F6]/10' : ''}`}
      onClick={handleRowClick}
      title={isSelectionMode ? 'Tap to select' : 'Click to preview recipe'}
      onTouchStart={isSelectionMode ? undefined : longPressHandlers.onTouchStart}
      onTouchMove={isSelectionMode ? undefined : longPressHandlers.onTouchMove}
      onTouchEnd={isSelectionMode ? undefined : longPressHandlers.onTouchEnd}
    >
      <td
        className="px-6 py-4 text-sm font-medium whitespace-nowrap text-white"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => onSelectRecipe(recipe.id)}
          className="flex items-center justify-center transition-colors hover:text-[#29E7CD]"
          aria-label={`${isSelected ? 'Deselect' : 'Select'} recipe ${capitalizeRecipeName(recipe.name)}`}
        >
          {isSelected ? (
            <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
          ) : (
            <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
          )}
        </button>
      </td>
      <td
        className={`px-6 py-4 text-sm font-medium whitespace-nowrap text-white transition-all duration-300 ${
          !isSelectionMode ? 'cursor-pointer' : ''
        } ${
          isHighlighting
            ? 'border-l-4 border-[#29E7CD] bg-[#29E7CD]/10 animate-[highlightPulse_0.5s_ease-in-out]'
            : ''
        }`}
        onClick={!isSelectionMode ? () => onPreviewRecipe(recipe) : undefined}
      >
        {capitalizeRecipeName(recipe.name)}
      </td>
      <td
        className={`px-6 py-4 text-sm whitespace-nowrap text-gray-300 ${!isSelectionMode ? 'cursor-pointer' : ''}`}
        onClick={!isSelectionMode ? () => onPreviewRecipe(recipe) : undefined}
      >
        {recipePrice ? (
          <div className="flex flex-col">
            <span className="font-semibold text-white">
              ${recipePrice.recommendedPrice.toFixed(2)}
              {recipe.yield > 1 && (
                <span className="ml-1 text-xs font-normal text-gray-400">
                  /portion ($
                  {(recipePrice.recommendedPrice * recipe.yield).toFixed(2)}{' '}
                  total)
                </span>
              )}
            </span>
            <span className="text-xs text-gray-400">
              {recipePrice.foodCostPercent.toFixed(1)}% food cost
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <LoadingSkeleton variant="text" width="w-20" height="h-4" />
            <LoadingSkeleton variant="text" width="w-16" height="h-3" />
          </div>
        )}
      </td>
      <td
        className={`hidden px-6 py-4 text-sm whitespace-nowrap text-gray-300 lg:table-cell ${!isSelectionMode ? 'cursor-pointer' : ''}`}
        onClick={!isSelectionMode ? () => onPreviewRecipe(recipe) : undefined}
      >
        {recipePrice ? (
          <div className="flex flex-col">
            <span className="font-semibold text-white">
              {recipePrice.gross_profit_margin.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400">
              ${recipePrice.gross_profit.toFixed(2)}/portion
            </span>
          </div>
        ) : (
          <span className="text-gray-500">-</span>
        )}
      </td>
      <td
        className={`hidden px-6 py-4 text-sm whitespace-nowrap text-gray-300 lg:table-cell ${!isSelectionMode ? 'cursor-pointer' : ''}`}
        onClick={!isSelectionMode ? () => onPreviewRecipe(recipe) : undefined}
      >
        {recipePrice ? (
          <div className="flex flex-col">
            <span className="font-semibold text-[#D925C7]">
              ${recipePrice.contributingMargin.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">
              {recipePrice.contributingMarginPercent.toFixed(1)}%/portion
            </span>
          </div>
        ) : (
          <span className="text-gray-500">-</span>
        )}
      </td>
      <td
        className={`hidden px-6 py-4 text-sm whitespace-nowrap text-gray-300 lg:table-cell ${!isSelectionMode ? 'cursor-pointer' : ''}`}
        onClick={!isSelectionMode ? () => onPreviewRecipe(recipe) : undefined}
      >
        {formatRecipeDate(recipe.created_at)}
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onPreviewRecipe(recipe)}
            className="text-gray-400 transition-colors hover:text-[#29E7CD]"
            aria-label={`Preview recipe ${capitalizeRecipeName(recipe.name)}`}
            title="Preview full details"
          >
            <Icon icon={Eye} size="sm" aria-hidden={true} />
          </button>
          <button
            onClick={() => onEditRecipe(recipe)}
            className="text-gray-400 transition-colors hover:text-[#29E7CD]"
            aria-label={`Edit recipe ${capitalizeRecipeName(recipe.name)}`}
            title="Edit recipe"
          >
            <Icon icon={Edit} size="sm" aria-hidden={true} />
          </button>
          <button
            onClick={() => onDeleteRecipe(recipe)}
            className="text-gray-400 transition-colors hover:text-red-400"
            aria-label={`Delete recipe ${capitalizeRecipeName(recipe.name)}`}
            title="Delete recipe"
          >
            <Icon icon={Trash2} size="sm" aria-hidden={true} />
          </button>
        </div>
      </td>
    </tr>
  );
}
