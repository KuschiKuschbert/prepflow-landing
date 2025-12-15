/**
 * Hook for managing menu item operations (add, remove, move, reorder, update price)
 * Orchestrates specialized hooks for different operations.
 */
import { createOperations } from './helpers/createOperations';
import type { Dish, MenuItem, Recipe } from '../../types';
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

export function useMenuItemOperations(props: UseMenuItemOperationsProps): UseMenuItemOperationsReturn {
  return createOperations(props);
}
