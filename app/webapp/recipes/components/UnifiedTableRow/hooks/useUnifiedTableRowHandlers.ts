/**
 * Hook for managing unified table row handlers (long press, click).
 */

import { useLongPress } from '@/app/webapp/ingredients/hooks/useLongPress';
import React from 'react';
import type { Dish, Recipe } from '@/app/webapp/recipes/types';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

interface UseUnifiedTableRowHandlersProps {
  item: UnifiedItem;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelectItem: (itemId: string) => void;
  onPreviewDish: (dish: Dish) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onCancelLongPress?: () => void;
  onEnterSelectionMode?: () => void;
}

export function useUnifiedTableRowHandlers({
  item,
  isSelectionMode,
  isSelected,
  onSelectItem,
  onPreviewDish,
  onPreviewRecipe,
  onCancelLongPress,
  onEnterSelectionMode,
}: UseUnifiedTableRowHandlersProps) {
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

  return {
    isDish,
    dish,
    recipe,
    longPressHandlers,
    handleRowClick,
  };
}
