/**
 * Helper for invalidating caches when dish changes
 */

import { logger } from '@/lib/logger';

/**
 * Invalidates allergen cache for a dish
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<void>}
 */
export async function invalidateAllergenCache(dishId: string): Promise<void> {
  try {
    const { invalidateDishAllergenCache } = await import('@/lib/allergens/cache-invalidation');
    await invalidateDishAllergenCache(dishId);
  } catch (err) {
    logger.error('[Dishes API] Error invalidating allergen cache:', err);
  }
}

/**
 * Invalidates menu pricing cache for menu items using this dish
 *
 * @param {string} dishId - Dish ID
 * @param {string} dishName - Dish name
 * @param {string} changeType - Type of change
 * @param {any} changeDetails - Change details
 * @param {string | null} userEmail - User email for change tracking
 * @returns {Promise<void>}
 */
export async function invalidateMenuPricingCache(
  dishId: string,
  dishName: string,
  changeType: string,
  changeDetails: any,
  userEmail: string | null,
): Promise<void> {
  try {
    const { invalidateMenuItemsWithDish } = await import('@/lib/menu-pricing/cache-invalidation');
    await invalidateMenuItemsWithDish(dishId, dishName, changeType, changeDetails, userEmail);
  } catch (err) {
    logger.error('[Dishes API] Error invalidating menu pricing cache:', err);
  }
}

/**
 * Tracks changes for locked menus
 *
 * @param {string} dishId - Dish ID
 * @param {string} dishName - Dish name
 * @param {string} changeType - Type of change
 * @param {any} changeDetails - Change details
 * @param {string | null} userEmail - User email for change tracking
 * @returns {Promise<void>}
 */
export async function trackChangeForLockedMenus(
  dishId: string,
  dishName: string,
  changeType: string,
  changeDetails: any,
  userEmail: string | null,
): Promise<void> {
  try {
    const { trackChangeForLockedMenus } = await import('@/lib/menu-lock/change-tracking');
    await trackChangeForLockedMenus('dish', dishId, dishName, changeType, changeDetails, userEmail);
  } catch (err) {
    logger.error('[Dishes API] Error tracking price change:', err);
  }
}
