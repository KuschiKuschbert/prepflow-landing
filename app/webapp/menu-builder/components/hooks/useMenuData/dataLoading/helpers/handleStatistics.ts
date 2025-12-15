/**
 * Handle statistics response and update state.
 */
import { logger } from '@/lib/logger';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import type { MenuItem, MenuStatistics } from '../../../../../types';

interface HandleStatisticsParams {
  statsResponse: Response;
  statsData: any;
  menuId: string;
  menuCacheKey: string;
  setStatistics: React.Dispatch<React.SetStateAction<MenuStatistics | null>>;
}

export function handleStatistics({
  statsResponse,
  statsData,
  menuId,
  menuCacheKey,
  setStatistics,
}: HandleStatisticsParams): void {
  if (statsResponse.ok && statsData.success) {
    setStatistics(statsData.statistics);
    const currentCached = getCachedData<{
      menuItems: MenuItem[];
      categories: string[];
      statistics: MenuStatistics | null;
    }>(menuCacheKey);
    if (currentCached) {
      cacheData(menuCacheKey, { ...currentCached, statistics: statsData.statistics });
    }
  } else {
    if (statsResponse.status !== 404) {
      logger.warn('[Menu Data Loading] Failed to load statistics', {
        status: statsResponse.status,
        error: statsData.error || statsData.message,
        menuId,
      });
    }
    setStatistics({
      total_items: 0,
      total_dishes: 0,
      total_recipes: 0,
      total_cogs: 0,
      total_revenue: 0,
      gross_profit: 0,
      average_profit_margin: 0,
      food_cost_percent: 0,
    });
  }
}
