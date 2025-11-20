/**
 * Hook for managing menu item operations (add, remove, move, reorder, update price)
 * Orchestrates specialized hooks for different operations.
 */

import type { MenuItem, Dish, Recipe } from '../../types';
import { useMenuItemAddition } from './helpers/useMenuItemAddition';
import { useMenuItemRemoval } from './helpers/useMenuItemRemoval';
import { useMenuItemReorder } from './helpers/useMenuItemReorder';
import { useMenuItemCategory } from './helpers/useMenuItemCategory';
import { useMenuItemPrice } from './helpers/useMenuItemPrice';

interface UseMenuItemOperationsProps {
  menuId: string;
  menuItems: MenuItem[];
  dishes: Dish[];
  recipes: Recipe[];
  categories: string[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  refreshStatistics: () => Promise<void>;
  loadMenuData: () => Promise<void>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

interface UseMenuItemOperationsReturn {
  handleCategorySelect: (
    category: string,
    selectedItem: { type: 'dish' | 'recipe'; id: string; name: string } | null,
  ) => Promise<void>;
  handleRemoveItem: (itemId: string, onConfirm: () => void) => void;
  performRemoveItem: (itemId: string, itemName: string) => Promise<void>;
  handleMoveUp: (itemId: string) => Promise<void>;
  handleMoveDown: (itemId: string) => Promise<void>;
  performReorder: (activeId: string, overId: string, category: string) => Promise<void>;
  handleMoveToCategory: (itemId: string, targetCategory: string) => Promise<void>;
  handleUpdateActualPrice: (itemId: string, price: number | null) => Promise<void>;
  performMoveToCategory: (itemId: string, targetCategory: string, item: MenuItem) => Promise<void>;
}

export function useMenuItemOperations({
  menuId,
  menuItems,
  dishes,
  recipes,
  categories,
  setMenuItems,
  setCategories,
  refreshStatistics,
  loadMenuData,
  showError,
  showSuccess,
}: UseMenuItemOperationsProps): UseMenuItemOperationsReturn {
  // Delegate to specialized hooks
  const { handleCategorySelect } = useMenuItemAddition({
    menuId,
    menuItems,
    dishes,
    recipes,
    categories,
    setMenuItems,
    setCategories,
    refreshStatistics,
    showError,
  });

  const { handleRemoveItem, performRemoveItem } = useMenuItemRemoval({
    menuId,
    menuItems,
    setMenuItems,
    refreshStatistics,
    showError,
    showSuccess,
  });

  const { handleMoveUp, handleMoveDown, performReorder } = useMenuItemReorder({
    menuId,
    menuItems,
    setMenuItems,
    refreshStatistics,
    showError,
  });

  const { handleMoveToCategory, performMoveToCategory } = useMenuItemCategory({
    menuId,
    menuItems,
    setMenuItems,
    refreshStatistics,
    loadMenuData,
    showError,
  });

  const { handleUpdateActualPrice } = useMenuItemPrice({
    menuId,
    menuItems,
    setMenuItems,
    loadMenuData,
    refreshStatistics,
    showError,
  });

  return {
    handleCategorySelect,
    handleRemoveItem,
    performRemoveItem,
    handleMoveUp,
    handleMoveDown,
    performReorder,
    handleMoveToCategory,
    handleUpdateActualPrice,
    performMoveToCategory,
  };
}
