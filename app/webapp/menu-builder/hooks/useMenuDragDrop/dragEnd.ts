/**
 * Utilities for handling drag end events.
 */

import { DragEndEvent } from '@dnd-kit/core';
import type { MenuItem } from '../../types';
import { reorderMenuItems } from '../../utils/menuDragDropHelpers';

interface NotificationFunctions {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

interface HandleDragEndProps {
  event: DragEndEvent;
  menuId: string;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  onStatisticsUpdate: () => void;
  onMenuDataReload: () => Promise<void>;
  notifications?: NotificationFunctions;
}

/**
 * Move menu item to new category.
 *
 * @param {string} menuId - Menu ID
 * @param {string} itemId - Item ID
 * @param {string} targetCategory - Target category
 * @param {number} targetPosition - Target position
 * @param {Function} onMenuDataReload - Reload callback
 * @param {Function} onStatisticsUpdate - Statistics update callback
 * @param {NotificationFunctions | undefined} notifications - Notification functions
 * @returns {Promise<void>}
 */
async function moveItemToCategory(
  menuId: string,
  itemId: string,
  targetCategory: string,
  targetPosition: number,
  onMenuDataReload: () => Promise<void>,
  onStatisticsUpdate: () => void,
  notifications?: NotificationFunctions,
): Promise<void> {
  try {
    const response = await fetch(`/api/menus/${menuId}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: targetCategory,
        position: targetPosition,
      }),
    });

    if (response.ok) {
      await onMenuDataReload();
      await onStatisticsUpdate();
    } else {
      const result = await response.json();
      notifications?.showError(
        `Failed to move item: ${result.error || result.message || 'Unknown error'}`,
      );
    }
  } catch (err) {
    notifications?.showError('Failed to move item. Please check your connection and try again.');
  }
}

/**
 * Handle drag end event.
 *
 * @param {HandleDragEndProps} props - Drag end handler props
 */
export async function handleDragEnd({
  event,
  menuId,
  menuItems,
  setMenuItems,
  onStatisticsUpdate,
  onMenuDataReload,
  notifications,
}: HandleDragEndProps): Promise<void> {
  const { active, over } = event;

  if (!over) return;

  // Only handle menu-item drag-and-drop for rearranging
  // Tap-to-add handles adding items from palette

  // Handle reordering within category or moving between categories
  if (active.data.current?.type === 'menu-item') {
    const activeItem = menuItems.find(item => item.id === active.id);
    if (!activeItem) return;

    // If dropped on another menu item, reorder within that item's category
    if (over.data.current?.type === 'menu-item') {
      const overItem = menuItems.find(item => item.id === over.id);
      if (!overItem) return;

      // If same category, reorder within category
      if (activeItem.category === overItem.category) {
        await reorderMenuItems(
          menuId,
          menuItems,
          activeItem,
          active.id as string,
          over.id as string,
          setMenuItems,
          onStatisticsUpdate,
          onMenuDataReload,
        );
      } else {
        // Different category - move item to new category at the position of the target item
        await moveItemToCategory(
          menuId,
          activeItem.id,
          overItem.category,
          overItem.position,
          onMenuDataReload,
          onStatisticsUpdate,
          notifications,
        );
      }
    }
    // If dropped on a category, move item to that category
    else if (over.data.current?.type === 'category') {
      const targetCategory = over.data.current.category as string;

      // Update item's category
      await moveItemToCategory(
        menuId,
        activeItem.id,
        targetCategory,
        activeItem.position,
        onMenuDataReload,
        onStatisticsUpdate,
        notifications,
      );
    }
  }
}
