/**
 * Helper to make price update API request.
 */

import { logger } from '@/lib/logger';
import { MenuItem } from '@/lib/types/menu-builder';

/**
 * Make API request to update menu item price.
 */
export async function makePriceUpdateRequest(
  menuId: string,
  itemId: string,
  price: number | null,
): Promise<{ ok: boolean; status: number; item?: MenuItem; error?: string }> {
  logger.dev('[useMenuItemPrice] Making API call', {
    itemId,
    price,
    url: `/api/menus/${menuId}/items/${itemId}`,
  });

  const response = await fetch(`/api/menus/${menuId}/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actual_selling_price: price,
    }),
  });

  logger.dev('[useMenuItemPrice] API response received', {
    itemId,
    status: response.status,
    ok: response.ok,
  });

  if (response.ok) {
    const result = await response.json();
    const apiPrice = result.item?.actual_selling_price;
    logger.dev('[useMenuItemPrice] API call successful - API response details', {
      itemId,
      updatedItem: result.item,
      actual_selling_price: apiPrice,
      actual_selling_price_type: typeof apiPrice,
      actual_selling_price_is_null: apiPrice === null,
      actual_selling_price_is_undefined: apiPrice === undefined,
      full_response: result,
    });
    return { ok: true, status: response.status, item: result.item };
  }

  const result = await response.json();
  return { ok: false, status: response.status, error: result.error || result.message };
}
