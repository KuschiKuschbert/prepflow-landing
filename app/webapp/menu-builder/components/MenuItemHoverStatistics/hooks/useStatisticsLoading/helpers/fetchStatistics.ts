/**
 * Helper function for fetching statistics from API.
 */

import { logger } from '@/lib/logger';

interface ItemStatistics {
  cogs: number;
  recommended_selling_price: number | null;
  actual_selling_price: number | null;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
  cogs_error?: string;
}

export async function fetchStatistics(
  menuId: string,
  itemId: string,
  retryCount = 0,
): Promise<{ success: boolean; statistics?: ItemStatistics; error?: string }> {
  try {
    const response = await fetch(`/api/menus/${menuId}/items/${itemId}/statistics`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        if (retryCount < 1) {
          logger.dev('[MenuItemHoverStatistics] 404, retrying...', { menuId, itemId });
          await new Promise(resolve => setTimeout(resolve, 500));
          return fetchStatistics(menuId, itemId, retryCount + 1);
        }
        logger.dev('[MenuItemHoverStatistics] 404 after retry, skipping', { menuId, itemId });
        return { success: false, error: 'Statistics not available' };
      }
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || errorData.message || 'Failed to load statistics',
      };
    }

    const result = await response.json();
    if (result.success) {
      logger.dev('[MenuItemHoverStatistics] Statistics loaded', { cacheKey: `${menuId}-${itemId}` });
      return { success: true, statistics: result.statistics };
    } else {
      logger.error('[MenuItemHoverStatistics] API error', {
        cacheKey: `${menuId}-${itemId}`,
        error: result.error || result.message,
      });
      return {
        success: false,
        error: result.error || result.message || 'Failed to load statistics',
      };
    }
  } catch (err) {
    logger.error('Failed to load item statistics:', err);
    return { success: false, error: 'Failed to load statistics' };
  }
}

