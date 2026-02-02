/**
 * Hook for removing categories.
 */
import { useCallback } from 'react';
import { logger } from '@/lib/logger';
import type { MenuItem } from '@/lib/types/menu-builder';
import { moveItemsToUncategorized } from './moveItemsToUncategorized';
import { optimisticCategoryRemoval } from './optimisticCategoryRemoval';

interface UseCategoryRemovalProps {
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

/**
 * Hook for removing categories.
 *
 * @param {UseCategoryRemovalProps} props - Hook dependencies
 * @returns {Object} Category removal handlers
 */
export function useCategoryRemoval({
  menuId,
  menuItems,
  categories,
  setMenuItems,
  setCategories,
  refreshStatistics,
  showError,
  showSuccess,
  showWarning,
}: UseCategoryRemovalProps) {
  const performRemoveCategory = useCallback(
    async (category: string) => {
      const originalMenuItems = [...menuItems];
      const originalCategories = [...categories];
      const itemsToMove = optimisticCategoryRemoval({
        category,
        menuItems,
        categories,
        setMenuItems,
        setCategories,
        refreshStatistics,
      });
      const success = await moveItemsToUncategorized({
        menuId,
        itemsToMove,
        originalMenuItems,
        originalCategories,
        setMenuItems,
        setCategories,
        refreshStatistics,
        showError,
      });

      if (!success) return;
      showSuccess(`Category "${category}" removed successfully`);
      refreshStatistics().catch(err => {
        logger.error('Failed to refresh statistics:', err);
      });
    },
    [
      menuId,
      menuItems,
      categories,
      setMenuItems,
      setCategories,
      refreshStatistics,
      showError,
      showSuccess,
    ],
  );

  const handleRemoveCategory = useCallback(
    (category: string, onConfirm: () => void) => {
      if (categories.length === 1) {
        showWarning('Cannot remove the last category. Menus must have at least one category.');
        return;
      }
      onConfirm();
    },
    [categories.length, showWarning],
  );

  return {
    handleRemoveCategory,
    performRemoveCategory,
  };
}
