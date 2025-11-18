/**
 * Hook for managing category operations (add, remove, rename)
 * Orchestrates specialized hooks for different operations.
 */

import type { MenuItem } from '../../types';
import { useCategoryAddition } from './helpers/useCategoryAddition';
import { useCategoryRemoval } from './helpers/useCategoryRemoval';
import { useCategoryRename } from './helpers/useCategoryRename';

interface UseCategoryOperationsProps {
  menuId: string;
  menuItems: MenuItem[];
  categories: string[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
}

interface UseCategoryOperationsReturn {
  handleAddCategory: (newCategory: string, setNewCategory: (value: string) => void) => void;
  handleRemoveCategory: (category: string, onConfirm: () => void) => void;
  performRemoveCategory: (category: string) => Promise<void>;
  handleRenameCategory: (oldName: string, newName: string) => Promise<void>;
}

export function useCategoryOperations({
  menuId,
  menuItems,
  categories,
  setMenuItems,
  setCategories,
  refreshStatistics,
  showError,
  showSuccess,
  showWarning,
}: UseCategoryOperationsProps): UseCategoryOperationsReturn {
  // Delegate to specialized hooks
  const { handleAddCategory } = useCategoryAddition({
    categories,
    setCategories,
  });

  const { handleRemoveCategory, performRemoveCategory } = useCategoryRemoval({
    menuId,
    menuItems,
    categories,
    setMenuItems,
    setCategories,
    refreshStatistics,
    showError,
    showSuccess,
    showWarning,
  });

  const { handleRenameCategory } = useCategoryRename({
    menuId,
    menuItems,
    categories,
    setMenuItems,
    setCategories,
    refreshStatistics,
  });

  return {
    handleAddCategory,
    handleRemoveCategory,
    performRemoveCategory,
    handleRenameCategory,
  };
}
