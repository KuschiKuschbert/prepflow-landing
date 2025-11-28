/**
 * Invalidate menu item prices for recipe changes.
 */

import { logger } from '@/lib/logger';
import { findMenuItemsWithRecipe } from './helpers/find-menu-items';
import { checkMenuLocks } from './helpers/check-menu-locks';
import { invalidateMenuItemPrices } from './helpers/invalidate-prices';
import { trackLockedMenuChanges } from './helpers/track-changes';

/**
 * Invalidate cached recommended prices for all menu items using a specific recipe.
 * Called when recipe ingredients or yield change.
 * Skips invalidation for locked menus and tracks changes instead.
 *
 * @param {string} recipeId - Recipe ID
 * @param {string} recipeName - Recipe name (for change tracking)
 * @param {string} changeType - Type of change (for tracking)
 * @param {any} changeDetails - Change details (for tracking)
 * @param {string} changedBy - User email (for tracking)
 * @returns {Promise<void>} Resolves when invalidation completes
 */
export async function invalidateMenuItemsWithRecipe(
  recipeId: string,
  recipeName?: string,
  changeType: string = 'ingredients_changed',
  changeDetails: any = {},
  changedBy: string | null = null,
): Promise<void> {
  try {
    // Find all menu items using this recipe
    const menuItems = await findMenuItemsWithRecipe(recipeId);

    if (menuItems.length === 0) {
      return;
    }

    // Group menu items by menu_id and check which menus are locked
    const menuIds = [...new Set(menuItems.map(item => item.menu_id))];
    const { lockedMenuIds, unlockedMenuIds } = await checkMenuLocks(menuIds);

    // Track changes for locked menus
    await trackLockedMenuChanges(
      lockedMenuIds,
      'recipe',
      recipeId,
      recipeName,
      changeType,
      changeDetails,
      changedBy,
    );

    // Only invalidate prices for unlocked menus
    const unlockedMenuItemIds = menuItems
      .filter(item => unlockedMenuIds.has(item.menu_id))
      .map(item => item.id);

    if (unlockedMenuItemIds.length > 0) {
      await invalidateMenuItemPrices(unlockedMenuItemIds, {
        type: 'recipe',
        id: recipeId,
        lockedCount: lockedMenuIds.size,
      });
    } else if (lockedMenuIds.size > 0) {
      logger.dev(
        `[Menu Pricing Cache] Skipped price invalidation for recipe ${recipeId} (all ${lockedMenuIds.size} menus are locked, changes tracked)`,
      );
    }
  } catch (err) {
    logger.error('[Menu Pricing Cache] Error invalidating menu items with recipe:', err);
  }
}
