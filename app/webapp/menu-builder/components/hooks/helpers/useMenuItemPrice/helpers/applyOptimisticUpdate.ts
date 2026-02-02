/**
 * Helper to apply optimistic update to menu items.
 */

import { logger } from '@/lib/logger';
import { MenuItem } from '@/lib/types/menu-builder';

/**
 * Apply optimistic update to menu items state.
 */
export function applyOptimisticUpdate(
  menuItems: MenuItem[],
  itemId: string,
  price: number | null,
): MenuItem[] {
  logger.dev('[useMenuItemPrice] Applying optimistic update', {
    itemId,
    oldPrice: menuItems.find(i => i.id === itemId)?.actual_selling_price,
    newPrice: price,
  });

  return menuItems.map(i =>
    i.id === itemId ? { ...i, actual_selling_price: price ?? undefined } : i,
  );
}
