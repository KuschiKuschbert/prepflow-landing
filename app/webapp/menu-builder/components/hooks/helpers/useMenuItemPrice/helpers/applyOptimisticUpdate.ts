/**
 * Helper to apply optimistic update to menu items.
 */

import { logger } from '@/lib/logger';

/**
 * Apply optimistic update to menu items state.
 */
export function applyOptimisticUpdate(
  menuItems: any[],
  itemId: string,
  price: number | null,
): any[] {
  logger.dev('[useMenuItemPrice] Applying optimistic update', {
    itemId,
    oldPrice: menuItems.find(i => i.id === itemId)?.actual_selling_price,
    newPrice: price,
  });

  return menuItems.map(i =>
    i.id === itemId ? { ...i, actual_selling_price: price ?? undefined } : i,
  );
}
