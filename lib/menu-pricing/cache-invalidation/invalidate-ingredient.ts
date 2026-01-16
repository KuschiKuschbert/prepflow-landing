/**
 * Invalidate menu item prices for ingredient changes.
 */

import { logger } from '@/lib/logger';
import { checkMenuLocks } from './helpers/check-menu-locks';
import { findMenuItemsWithIngredient } from './helpers/find-menu-items';
import { invalidateMenuItemPrices } from './helpers/invalidate-prices';
import { trackLockedMenuChanges } from './helpers/track-changes';

// Type for menu item records returned from queries
interface MenuItemRecord {
  id: string;
  menu_id: string;
}

// Type for change details passed to tracking
interface IngredientChangeDetails {
  old_cost?: number;
  new_cost?: number;
  [key: string]: unknown;
}

/**
 * Invalidate cached recommended prices for all menu items using recipes/dishes that contain a specific ingredient.
 * Called when ingredient costs change.
 * Skips invalidation for locked menus and tracks changes instead.
 *
 * @param {string} ingredientId - Ingredient ID
 * @param {string} ingredientName - Ingredient name (for change tracking)
 * @param {any} changeDetails - Change details (for tracking)
 * @param {string} changedBy - User email (for tracking)
 * @returns {Promise<void>} Resolves when invalidation completes
 */
export async function invalidateMenuItemsWithIngredient(
  ingredientId: string,
  ingredientName?: string,
  changeDetails: IngredientChangeDetails = {},
  changedBy: string | null = null,
): Promise<void> {
  try {
    // Find all menu items using recipes/dishes with this ingredient
    const menuItems = await findMenuItemsWithIngredient(ingredientId);

    if (menuItems.length === 0) {
      return;
    }

    // Group menu items by menu_id and check which menus are locked
    const menuIds = [...new Set(menuItems.map((item: MenuItemRecord) => item.menu_id))];
    const { lockedMenuIds, unlockedMenuIds } = await checkMenuLocks(menuIds);

    // Track changes for locked menus
    await trackLockedMenuChanges(
      lockedMenuIds,
      'ingredient',
      ingredientId,
      ingredientName,
      'cost_changed',
      changeDetails,
      changedBy,
    );

    // Only invalidate prices for unlocked menus
    const unlockedMenuItemIds = menuItems
      .filter((item: MenuItemRecord) => unlockedMenuIds.has(item.menu_id))
      .map((item: MenuItemRecord) => item.id);

    if (unlockedMenuItemIds.length > 0) {
      await invalidateMenuItemPrices(unlockedMenuItemIds, {
        type: 'ingredient',
        id: ingredientId,
        lockedCount: lockedMenuIds.size,
      });
    } else if (lockedMenuIds.size > 0) {
      logger.dev(
        `[Menu Pricing Cache] Skipped price invalidation for ingredient ${ingredientId} (all ${lockedMenuIds.size} menus are locked, changes tracked)`,
      );
    }
  } catch (err) {
    logger.error('[Menu Pricing Cache] Error invalidating menu items with ingredient:', err);
  }
}
