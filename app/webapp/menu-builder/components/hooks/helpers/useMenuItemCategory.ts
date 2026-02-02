/**
 * Hook for moving menu items between categories.
 */
import { logger } from '@/lib/logger';
import { useCallback } from 'react';
import type { MenuItem } from '@/lib/types/menu-builder';

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
 */
export function useMenuItemCategory({
  menuId,
  menuItems,
  setMenuItems,
  refreshStatistics,
  loadMenuData,
  showError,
}: UseMenuItemCategoryProps) {
  const handleRefreshError = (err: unknown) => logger.error('Failed to refresh statistics:', err);
  const performMoveToCategory = useCallback(
    async (itemId: string, targetCategory: string, item: MenuItem) => {
      const originalMenuItems = [...menuItems];
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
      refreshStatistics().catch(handleRefreshError);
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
          await loadMenuData();
          refreshStatistics().catch(handleRefreshError);
        } else {
          setMenuItems(originalMenuItems);
          logger.error('Failed to move item:', result.error || result.message);
          showError(`Failed to move item: ${result.error || result.message || 'Unknown error'}`);
          refreshStatistics().catch(handleRefreshError);
        }
      } catch (err) {
        setMenuItems(originalMenuItems);
        logger.error('Failed to move item:', err);
        showError('Failed to move item. Please check your connection and try again.');
        refreshStatistics().catch(handleRefreshError);
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

      if (item.category === targetCategory) return;
      await performMoveToCategory(itemId, targetCategory, item);
    },
    [menuItems, performMoveToCategory, showError],
  );

  return {
    handleMoveToCategory,
    performMoveToCategory,
  };
}
