/**
 * Utilities for handling drag end events.
 */
import { DragEndEvent } from '@dnd-kit/core';
import { moveItemToCategory } from './dragEnd/helpers/moveItemToCategory';
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
 * Handle drag end event.
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
  if (active.data.current?.type === 'menu-item') {
    const activeItem = menuItems.find(item => item.id === active.id);
    if (!activeItem) return;
    if (over.data.current?.type === 'menu-item') {
      const overItem = menuItems.find(item => item.id === over.id);
      if (!overItem) return;
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
    } else if (over.data.current?.type === 'category') {
      await moveItemToCategory(
        menuId,
        activeItem.id,
        over.data.current.category as string,
        activeItem.position,
        onMenuDataReload,
        onStatisticsUpdate,
        notifications,
      );
    }
  }
}
