'use client';

import { useLongPress } from '@/app/webapp/ingredients/hooks/useLongPress';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Check, Edit, Eye, Trash2 } from 'lucide-react';
import React, { memo } from 'react';
import { Recipe, RecipePriceData } from '@/lib/types/recipes';
import { formatRecipeDate } from '../utils/formatDate';

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

function RecipeTableRowComponent({
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
      className={`border-l-2 border-[var(--color-info)]/30 bg-[var(--color-info)]/2 transition-colors ${
        isSelectionMode ? 'cursor-pointer' : 'cursor-pointer hover:bg-[var(--color-info)]/5'
      } ${isSelected && isSelectionMode ? 'bg-[var(--color-info)]/10' : ''}`}
      onClick={handleRowClick}
      title={isSelectionMode ? 'Tap to select' : 'Click to preview recipe'}
      onTouchStart={isSelectionMode ? undefined : longPressHandlers.onTouchStart}
      onTouchMove={isSelectionMode ? undefined : longPressHandlers.onTouchMove}
      onTouchEnd={isSelectionMode ? undefined : longPressHandlers.onTouchEnd}
    >
      <SelectCell
        isSelected={isSelected}
        recipeName={capitalizeRecipeName(recipe.recipe_name)}
        onSelect={() => onSelectRecipe(recipe.id)}
      />
      <td
        className={`px-6 py-4 text-sm font-medium whitespace-nowrap text-[var(--foreground)] transition-all duration-300 ${
          !isSelectionMode ? 'cursor-pointer' : ''
        } ${
          isHighlighting
            ? 'animate-[highlightPulse_0.5s_ease-in-out] border-l-4 border-[var(--primary)] bg-[var(--primary)]/10'
            : ''
        }`}
        onClick={!isSelectionMode ? () => onPreviewRecipe(recipe) : undefined}
      >
        {capitalizeRecipeName(recipe.recipe_name)}
      </td>
      <PriceCell
        price={recipePrice?.recommendedPrice}
        isSelectionMode={isSelectionMode}
        onClick={() => onPreviewRecipe(recipe)}
      />
      <MarginCell
        value={recipePrice?.gross_profit_margin}
        subValue={recipePrice?.gross_profit}
        subValuePrefix="$"
        subValueSuffix="/portion"
        valueSuffix="%"
        isSelectionMode={isSelectionMode}
        onClick={() => onPreviewRecipe(recipe)}
        className="desktop:table-cell hidden"
      />
      <MarginCell
        value={recipePrice?.contributingMargin}
        subValue={recipePrice?.contributingMarginPercent}
        valuePrefix="$"
        subValueSuffix="%/portion"
        isSelectionMode={isSelectionMode}
        onClick={() => onPreviewRecipe(recipe)}
        className="desktop:table-cell hidden"
        valueClassName="text-[var(--accent)]"
      />
      <td
        className={`desktop:table-cell hidden px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)] ${!isSelectionMode ? 'cursor-pointer' : ''}`}
        onClick={!isSelectionMode ? () => onPreviewRecipe(recipe) : undefined}
      >
        {formatRecipeDate(recipe.created_at)}
      </td>
      <ActionsCell
        recipeName={capitalizeRecipeName(recipe.recipe_name)}
        onPreview={() => onPreviewRecipe(recipe)}
        onEdit={() => onEditRecipe(recipe)}
        onDelete={() => onDeleteRecipe(recipe)}
      />
    </tr>
  );
}

// Memoize component to prevent unnecessary re-renders when props don't change
export const RecipeTableRow = memo(RecipeTableRowComponent, (prevProps, nextProps) => {
  // Only re-render if relevant props actually changed
  return (
    prevProps.recipe.id === nextProps.recipe.id &&
    prevProps.selectedRecipes === nextProps.selectedRecipes &&
    prevProps.isSelectionMode === nextProps.isSelectionMode &&
    prevProps.isHighlighting === nextProps.isHighlighting &&
    prevProps.recipePrice === nextProps.recipePrice
  );
});

function SelectCell({ isSelected, recipeName, onSelect }: any) {
  return (
    <td
      className="px-6 py-4 text-sm font-medium whitespace-nowrap text-[var(--foreground)]"
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={onSelect}
        className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
        aria-label={`${isSelected ? 'Deselect' : 'Select'} recipe ${recipeName}`}
      >
        {isSelected ? (
          <Icon icon={Check} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
        ) : (
          <div className="h-4 w-4 rounded border border-[var(--border)] bg-[var(--background)] transition-colors hover:border-[var(--primary)]/50" />
        )}
      </button>
    </td>
  );
}

function PriceCell({ price, isSelectionMode, onClick }: any) {
  return (
    <td
      className={`px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)] ${!isSelectionMode ? 'cursor-pointer' : ''}`}
      onClick={!isSelectionMode ? onClick : undefined}
    >
      {price !== undefined ? (
        `$${price.toFixed(2)}`
      ) : (
        <LoadingSkeleton variant="text" width="w-20" height="h-4" />
      )}
    </td>
  );
}

function MarginCell({
  value,
  subValue,
  valuePrefix = '',
  valueSuffix = '',
  subValuePrefix = '',
  subValueSuffix = '',
  isSelectionMode,
  onClick,
  className = '',
  valueClassName = 'text-[var(--foreground)]',
}: any) {
  return (
    <td
      className={`px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)] ${!isSelectionMode ? 'cursor-pointer' : ''} ${className}`}
      onClick={!isSelectionMode ? onClick : undefined}
    >
      {value !== undefined && subValue !== undefined ? (
        <div className="flex flex-col">
          <span className={`font-semibold ${valueClassName}`}>
            {valuePrefix}
            {value.toFixed(1)}
            {valueSuffix}
          </span>
          <span className="text-xs text-[var(--foreground-muted)]">
            {subValuePrefix}
            {subValue.toFixed(2)}
            {subValueSuffix}
          </span>
        </div>
      ) : (
        <span className="text-[var(--foreground-subtle)]">-</span>
      )}
    </td>
  );
}

function ActionsCell({ recipeName, onPreview, onEdit, onDelete }: any) {
  return (
    <td className="px-6 py-4 text-sm whitespace-nowrap text-[var(--foreground-secondary)]">
      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={onPreview}
          className="text-[var(--foreground-muted)] transition-colors hover:text-[var(--primary)]"
          aria-label={`Preview recipe ${recipeName}`}
          title="Preview full details"
        >
          <Icon icon={Eye} size="sm" aria-hidden={true} />
        </button>
        <button
          onClick={onEdit}
          className="text-[var(--foreground-muted)] transition-colors hover:text-[var(--primary)]"
          aria-label={`Edit recipe ${recipeName}`}
          title="Edit recipe"
        >
          <Icon icon={Edit} size="sm" aria-hidden={true} />
        </button>
        <button
          onClick={onDelete}
          className="text-[var(--foreground-muted)] transition-colors hover:text-[var(--color-error)]"
          aria-label={`Delete recipe ${recipeName}`}
          title="Delete recipe"
        >
          <Icon icon={Trash2} size="sm" aria-hidden={true} />
        </button>
      </div>
    </td>
  );
}
