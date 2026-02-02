/**
 * Update Menu Items with Server Item
 * Replaces optimistic item with server item from API response
 */

import { logger } from '@/lib/logger';
import type { MenuItem } from '@/lib/types/menu-builder';

interface UpdateMenuItemsParams {
  prevItems: MenuItem[];
  optimisticItem: MenuItem;
  serverItem: MenuItem;
}

export function updateMenuItemsWithServerItem({
  prevItems,
  optimisticItem,
  serverItem,
}: UpdateMenuItemsParams): MenuItem[] {
  const optimisticIndex = prevItems.findIndex(item => item.id === optimisticItem.id);

  if (optimisticIndex === -1) {
    // Optimistic item not found, check if server item already exists
    const serverItemIndex = prevItems.findIndex(item => item.id === serverItem.id);
    if (serverItemIndex === -1) {
      // Neither found, add the server item
      logger.warn('[useMenuItemAddition] Optimistic item not found, adding server item', {
        optimisticItemId: optimisticItem.id,
        serverItemId: serverItem.id,
        prevItemsIds: prevItems.map(i => i.id),
      });
      return [...prevItems, serverItem];
    } else {
      // Server item already exists, update it in place
      logger.dev('[useMenuItemAddition] Server item already exists, updating in place', {
        serverItemId: serverItem.id,
        serverItemIndex,
      });
      const updatedItems = [...prevItems];
      updatedItems[serverItemIndex] = serverItem;
      return updatedItems;
    }
  }

  // Replace optimistic item with server item
  const updatedItems = [
    ...prevItems.slice(0, optimisticIndex).map(item => ({ ...item })),
    serverItem,
    ...prevItems.slice(optimisticIndex + 1).map(item => ({ ...item })),
  ];

  logger.dev('[useMenuItemAddition] Replacing optimistic item with server item', {
    optimisticItemId: optimisticItem.id,
    serverItemId: serverItem.id,
    optimisticIndex,
    prevItemsCount: prevItems.length,
    updatedItemsCount: updatedItems.length,
  });

  return updatedItems;
}
