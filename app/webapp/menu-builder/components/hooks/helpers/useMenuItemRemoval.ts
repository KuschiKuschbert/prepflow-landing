/**
 * Hook for removing menu items.
 */

import { useCallback } from 'react';
import { logger } from '@/lib/logger';
import type { MenuItem } from '../../../types';

interface UseMenuItemRemovalProps {
  menuId: string;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

/**
 * Hook for removing menu items.
 *
 * @param {UseMenuItemRemovalProps} props - Hook dependencies
 * @returns {Object} Removal handlers
 */
export function useMenuItemRemoval({
  menuId,
  menuItems,
  setMenuItems,
  refreshStatistics,
  showError,
  showSuccess,
}: UseMenuItemRemovalProps) {
  const performRemoveItem = useCallback(
    async (itemId: string, itemName: string) => {
      // Store the item being removed for potential revert
      const itemToRemove = menuItems.find(i => i.id === itemId);
      if (!itemToRemove) {
        showError('Item not found');
        return;
      }

      // Optimistically remove from UI immediately (instant feedback)
      setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));

      try {
        const response = await fetch(`/api/menus/${menuId}/items/${itemId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok) {
          // Success - refresh statistics in background (non-blocking)
          showSuccess(`"${itemName}" removed from menu`);
          refreshStatistics().catch(err => {
            logger.error('Failed to refresh statistics:', err);
          });
        } else {
          // Revert optimistic update on error
          setMenuItems(prevItems => {
            // Reinsert the item at its original position
            const otherItems = prevItems.filter(item => item.id !== itemId);
            const insertIndex = otherItems.findIndex(
              item =>
                item.category === itemToRemove.category && item.position > itemToRemove.position,
            );
            if (insertIndex === -1) {
              return [...otherItems, itemToRemove];
            }
            return [
              ...otherItems.slice(0, insertIndex),
              itemToRemove,
              ...otherItems.slice(insertIndex),
            ];
          });
          showError(`Failed to remove item: ${result.error || result.message || 'Unknown error'}`);
        }
      } catch (err) {
        // Revert optimistic update on error
        setMenuItems(prevItems => {
          const otherItems = prevItems.filter(item => item.id !== itemId);
          const insertIndex = otherItems.findIndex(
            item =>
              item.category === itemToRemove.category && item.position > itemToRemove.position,
          );
          if (insertIndex === -1) {
            return [...otherItems, itemToRemove];
          }
          return [
            ...otherItems.slice(0, insertIndex),
            itemToRemove,
            ...otherItems.slice(insertIndex),
          ];
        });
        logger.error('Failed to remove item:', err);
        showError('Failed to remove item. Please check your connection and try again.');
      }
    },
    [menuId, menuItems, setMenuItems, refreshStatistics, showError, showSuccess],
  );

  const handleRemoveItem = useCallback(
    (itemId: string, onConfirm: () => void) => {
      const item = menuItems.find(i => i.id === itemId);
      const itemName = item?.dishes?.dish_name || item?.recipes?.recipe_name || 'this item';
      onConfirm();
    },
    [menuItems],
  );

  return {
    handleRemoveItem,
    performRemoveItem,
  };
}
