import { useCallback, useState } from 'react';
import { useSelectionMode } from '@/app/webapp/ingredients/hooks/useSelectionMode';
import { Dish, Recipe } from '@/lib/types/recipes';

export function useDishesClientSelection(dishes: Dish[], recipes: Recipe[]) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { isSelectionMode, enterSelectionMode, exitSelectionMode } = useSelectionMode();

  const handleSelectItem = useCallback(
    (itemId: string) => {
      setSelectedItems(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(itemId)) {
          newSelected.delete(itemId);
        } else {
          newSelected.add(itemId);
          if (!isSelectionMode) {
            enterSelectionMode();
          }
        }
        return newSelected;
      });
    },
    [isSelectionMode, enterSelectionMode],
  );

  const handleSelectAll = useCallback(() => {
    const allItemIds = [...dishes.map(d => d.id), ...recipes.map(r => r.id)];
    setSelectedItems(prev => {
      if (prev.size === allItemIds.length) {
        exitSelectionMode();
        return new Set();
      } else {
        enterSelectionMode();
        return new Set(allItemIds);
      }
    });
  }, [dishes, recipes, enterSelectionMode, exitSelectionMode]);

  const handleExitSelectionMode = useCallback(() => {
    setSelectedItems(new Set());
    exitSelectionMode();
  }, [exitSelectionMode]);

  return {
    selectedItems,
    isSelectionMode,
    handleSelectItem,
    handleSelectAll,
    handleExitSelectionMode,
  };
}
