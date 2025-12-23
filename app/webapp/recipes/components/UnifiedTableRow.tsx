'use client';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Check, Edit, Eye, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { Dish, DishCostData, Recipe, RecipePriceData } from '../types';
import { formatRecipeDate } from '../utils/formatDate';
import { useUnifiedTableRowHandlers } from './UnifiedTableRow/hooks/useUnifiedTableRowHandlers';
import { getItemName } from './UnifiedTableRow/utils/getItemName';
import { getRowStyles } from './UnifiedTableRow/utils/getRowStyles';

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

function UnifiedTableRowComponent({
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

  const { isDish, dish, recipe, longPressHandlers, handleRowClick } = useUnifiedTableRowHandlers({
    item,
    isSelectionMode,
    isSelected,
    onSelectItem,
    onPreviewDish,
    onPreviewRecipe,
    onCancelLongPress,
    onEnterSelectionMode,
  });

  const { borderColor, bgColor, hoverColor, selectedColor } = getRowStyles(isDish);

  const itemName = getItemName({
    item,
    isDish,
    dish,
    recipe,
    capitalizeDishName,
    capitalizeRecipeName,
  });

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
        className="px-6 py-4 text-sm font-medium whitespace-nowrap text-[var(--foreground)]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => onSelectItem(item.id)}
          className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
          aria-label={`${isSelected ? 'Deselect' : 'Select'} ${isDish ? 'dish' : 'recipe'} ${itemName}`}
        >
          {isSelected ? (
            <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
          ) : (
            <div className="h-4 w-4 rounded border border-[var(--border)] bg-[var(--background)] transition-colors hover:border-[var(--primary)]/50" />
          )}
        </button>
      </td>

      {/* Type Badge */}
      <td className="px-6 py-4 text-sm">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isDish
              ? 'border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]'
              : 'border border-[var(--color-info)]/20 bg-[var(--color-info)]/10 text-[var(--color-info)]'
          }`}
        >
          {isDish ? 'Dish' : 'Recipe'}
        </span>
      </td>

      {/* Name */}
      <td
        className={`px-6 py-4 text-sm font-medium text-[var(--foreground)] transition-all duration-300 ${
          !isSelectionMode ? 'cursor-pointer' : ''
        } ${
          isHighlighting
            ? 'animate-[highlightPulse_0.5s_ease-in-out] border-l-4 border-[var(--primary)] bg-[var(--primary)]/10'
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
        className={`px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)] ${!isSelectionMode ? 'cursor-pointer' : ''}`}
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
        className={`desktop:table-cell hidden px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)] ${!isSelectionMode ? 'cursor-pointer' : ''}`}
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
                <span className="font-semibold text-[var(--accent)]">
                  ${recommendedContributingMargin.toFixed(2)}
                </span>
              );
            })()
          ) : (
            '—'
          )
        ) : recipe && recipePrice ? (
          <div className="flex flex-col">
            <span className="font-semibold text-[var(--accent)]">
              ${recipePrice.contributingMargin.toFixed(2)}
            </span>
            <span className="text-xs text-[var(--foreground-muted)]">/portion</span>
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
                    recommendedGrossProfitMargin >= 30 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'
                  }`}
                >
                  {recommendedGrossProfitMargin.toFixed(1)}%
                </span>
              );
            })()
          ) : (
            <span className="text-[var(--foreground-subtle)]">—</span>
          )
        ) : recipe && recipePrice ? (
          <div className="flex flex-col">
            <span className="font-semibold text-[var(--foreground)]">
              {recipePrice.gross_profit_margin.toFixed(1)}%
            </span>
            <span className="text-xs text-[var(--foreground-muted)]">
              ${recipePrice.gross_profit.toFixed(2)}/portion
            </span>
          </div>
        ) : (
          <span className="text-[var(--foreground-subtle)]">—</span>
        )}
      </td>

      {/* Created */}
      <td className="desktop:table-cell hidden px-6 py-4 text-sm text-[var(--foreground-muted)]">
        {formatRecipeDate(item.created_at)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-sm font-medium" onClick={e => e.stopPropagation()}>
        <div className="flex gap-2">
          <button
            onClick={() =>
              isDish && dish ? onPreviewDish(dish) : recipe ? onPreviewRecipe(recipe) : undefined
            }
            className="text-[var(--foreground-muted)] transition-colors hover:text-[var(--primary)]"
            aria-label={`Preview ${isDish ? 'dish' : 'recipe'} ${itemName}`}
            title="Preview full details"
          >
            <Icon icon={Eye} size="sm" aria-hidden={true} />
          </button>
          <button
            onClick={() =>
              isDish && dish ? onEditDish(dish) : recipe ? onEditRecipe(recipe) : undefined
            }
            className="text-[var(--foreground-muted)] transition-colors hover:text-[var(--primary)]"
            aria-label={`Edit ${isDish ? 'dish' : 'recipe'} ${itemName}`}
            title={`Edit ${isDish ? 'dish' : 'recipe'}`}
          >
            <Icon icon={Edit} size="sm" aria-hidden={true} />
          </button>
          <button
            onClick={() =>
              isDish && dish ? onDeleteDish(dish) : recipe ? onDeleteRecipe(recipe) : undefined
            }
            className="text-[var(--foreground-muted)] transition-colors hover:text-[var(--color-error)]"
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

// Memoize component to prevent unnecessary re-renders when props don't change
export const UnifiedTableRow = memo(UnifiedTableRowComponent, (prevProps, nextProps) => {
  // Only re-render if relevant props actually changed
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.itemType === nextProps.item.itemType &&
    prevProps.selectedItems === nextProps.selectedItems &&
    prevProps.isSelectionMode === nextProps.isSelectionMode &&
    prevProps.isHighlighting === nextProps.isHighlighting &&
    prevProps.dishCost === nextProps.dishCost &&
    prevProps.recipePrice === nextProps.recipePrice
  );
});
