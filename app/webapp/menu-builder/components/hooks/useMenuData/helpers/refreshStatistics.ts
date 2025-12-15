/**
 * Refresh menu statistics.
 */
import { logger } from '@/lib/logger';
import type { MenuStatistics } from '../../../../types';

export async function refreshStatistics(
  menuId: string,
  setStatistics: React.Dispatch<React.SetStateAction<MenuStatistics | null>>,
): Promise<void> {
  try {
    const statsResponse = await fetch(`/api/menus/${menuId}/statistics`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      if (statsData.success) {
        logger.dev('[useMenuData] Statistics refreshed', {
          menuId,
          statistics: statsData.statistics,
          totalItems: statsData.statistics?.total_items,
        });
        setStatistics(statsData.statistics);
      } else {
        logger.warn('[useMenuData] Statistics API returned error', {
          menuId,
          error: statsData.error || statsData.message,
        });
      }
    } else {
      logger.error('[useMenuData] Statistics API request failed', {
        menuId,
        status: statsResponse.status,
        statusText: statsResponse.statusText,
      });
    }
  } catch (err) {
    logger.error('[useMenuData] Failed to refresh statistics', { menuId, error: err });
  }
}
