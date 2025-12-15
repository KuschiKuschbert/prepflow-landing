/**
 * Create menu item operations from specialized hooks.
 */
import type { Dish, MenuItem, Recipe } from '../../../types';
import { useMenuItemAddition } from '../useMenuItemAddition';
import { useMenuItemCategory } from '../useMenuItemCategory';
import { useMenuItemPrice } from '../useMenuItemPrice';
import { useMenuItemRemoval } from '../useMenuItemRemoval';
import { useMenuItemReorder } from '../useMenuItemReorder';

interface CreateOperationsParams {
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

export function createOperations(params: CreateOperationsParams) {
  const { handleCategorySelect } = useMenuItemAddition(params);
  const { handleRemoveItem, performRemoveItem } = useMenuItemRemoval(params);
  const { handleMoveUp, handleMoveDown, performReorder } = useMenuItemReorder(params);
  const { handleMoveToCategory, performMoveToCategory } = useMenuItemCategory(params);
  const { handleUpdateActualPrice } = useMenuItemPrice(params);
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
