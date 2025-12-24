/**
 * Helper function for moving items to Uncategorized when category is removed.
 */

import { logger } from '@/lib/logger';
import type { MenuItem } from '../../../types';

interface MoveItemsToUncategorizedProps {
  menuId: string;
  itemsToMove: MenuItem[];
  originalMenuItems: MenuItem[];
  originalCategories: string[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
}

/**
 * Move items to Uncategorized category.
 *
 * @param {MoveItemsToUncategorizedProps} props - Move props
 * @returns {Promise<boolean>} True if successful, false if error
 */
export async function moveItemsToUncategorized({
  menuId,
  itemsToMove,
  originalMenuItems,
  originalCategories,
  setMenuItems,
  setCategories,
  refreshStatistics,
  showError,
}: MoveItemsToUncategorizedProps): Promise<boolean> {
  if (itemsToMove.length === 0) {
    return true;
  }

  let hasError = false;
  for (const item of itemsToMove) {
    try {
      const response = await fetch(`/api/menus/${menuId}/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Uncategorized',
          position: item.position,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        logger.error('Failed to move item:', result.error || result.message);
        hasError = true;
      }
    } catch (err) {
      logger.error('Failed to move item:', err);
      hasError = true;
    }
  }

  if (hasError) {
    // Revert optimistic update on error
    setMenuItems(originalMenuItems);
    setCategories(originalCategories);
    showError('Some items could not be moved. Please try again.');
    return false;
  }

  // Refresh statistics in background (non-blocking) on success
  refreshStatistics().catch(err => {
    logger.error('Failed to refresh statistics:', err);
  });
  return true;
}
