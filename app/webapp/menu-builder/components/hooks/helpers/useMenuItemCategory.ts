/**
 * Hook for moving menu items between categories.
 */

import { useCallback } from 'react';
import { logger } from '@/lib/logger';
import type { MenuItem } from '../../../types';

interface UseMenuItemCategoryProps {
  menuId: string;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  refreshStatistics: () => Promise<void>;
  loadMenuData: () => Promise<void>;
  showError: (message: string) => void;
}

/**
 * Hook for moving menu items between categories.
 *
 * @param {UseMenuItemCategoryProps} props - Hook dependencies
 * @returns {Object} Category move handlers
 */
export function useMenuItemCategory({
  menuId,
  menuItems,
  setMenuItems,
  refreshStatistics,
  loadMenuData,
  showError,
}: UseMenuItemCategoryProps) {
  const performMoveToCategory = useCallback(
    async (itemId: string, targetCategory: string, item: MenuItem) => {
      // Store original state for rollback
      const originalMenuItems = [...menuItems];

      // Optimistically update UI immediately
      setMenuItems(prevItems =>
        prevItems.map(i =>
          i.id === itemId
            ? {
                ...i,
                category: targetCategory,
                position: prevItems.filter(item => item.category === targetCategory).length,
              }
            : i,
        ),
      );

      // Refresh statistics optimistically in background
      refreshStatistics().catch(err => {
        logger.error('Failed to refresh statistics:', err);
      });

      // Make API call in background
      try {
        const response = await fetch(`/api/menus/${menuId}/items/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: targetCategory,
            position: item.position,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Success - reload menu data to ensure consistency
          await loadMenuData();
          // Refresh statistics in background to ensure accuracy
          refreshStatistics().catch(err => {
            logger.error('Failed to refresh statistics:', err);
          });
        } else {
          // Revert optimistic update on error
          setMenuItems(originalMenuItems);
          logger.error('Failed to move item:', result.error || result.message);
          showError(`Failed to move item: ${result.error || result.message || 'Unknown error'}`);
          // Refresh statistics to revert optimistic change
          refreshStatistics().catch(err => {
            logger.error('Failed to refresh statistics:', err);
          });
        }
      } catch (err) {
        // Revert optimistic update on error
        setMenuItems(originalMenuItems);
        logger.error('Failed to move item:', err);
        showError('Failed to move item. Please check your connection and try again.');
        // Refresh statistics to revert optimistic change
        refreshStatistics().catch(err => {
          logger.error('Failed to refresh statistics:', err);
        });
      }
    },
    [menuId, menuItems, setMenuItems, refreshStatistics, loadMenuData, showError],
  );

  const handleMoveToCategory = useCallback(
    async (itemId: string, targetCategory: string) => {
      const item = menuItems.find(i => i.id === itemId);
      if (!item) {
        showError('Item not found');
        return;
      }

      if (item.category === targetCategory) {
        return; // Already in target category
      }

      await performMoveToCategory(itemId, targetCategory, item);
    },
    [menuItems, performMoveToCategory, showError],
  );

  return {
    handleMoveToCategory,
    performMoveToCategory,
  };
}
