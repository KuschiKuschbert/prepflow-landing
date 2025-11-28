/**
 * Cache utilities for statistics.
 */

import { logger } from '@/lib/logger';
import type { MenuItem } from '@/app/webapp/menu-builder/types';

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

const statisticsCache = new Map<
  string,
  { data: ItemStatistics; timestamp: number; expiry: number }
>();
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

export function getCachedStatistics(menuId: string, item: MenuItem): ItemStatistics | null {
  const cacheKey = `${menuId}-${item.id}`;
  const cached = statisticsCache.get(cacheKey);
  const now = Date.now();

  // Invalidate cache if price changed
  const priceChanged =
    cached &&
    cached.data.actual_selling_price !== item.actual_selling_price &&
    (cached.data.actual_selling_price != null || item.actual_selling_price != null);

  if (priceChanged) {
    statisticsCache.delete(cacheKey);
    logger.dev('[useStatisticsLoading] Cache invalidated - price changed', {
      itemId: item.id,
      oldPrice: cached.data.actual_selling_price,
      newPrice: item.actual_selling_price,
    });
    return null;
  }

  // Check cache validity
  if (cached && now < cached.expiry) {
    return cached.data;
  }

  return null;
}

export function setCachedStatistics(menuId: string, itemId: string, data: ItemStatistics): void {
  const cacheKey = `${menuId}-${itemId}`;
  const now = Date.now();
  statisticsCache.set(cacheKey, {
    data,
    timestamp: now,
    expiry: now + CACHE_EXPIRY_MS,
  });
}

