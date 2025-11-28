'use client';
import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';
import { MenuItem } from '../../../types';

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

// Share the same cache instance with useStatisticsLoading
// Import the cache from useStatisticsLoading to ensure consistency
// For now, create a separate cache that will be shared via module scope
const statisticsCache = new Map<
  string,
  { data: ItemStatistics; timestamp: number; expiry: number }
>();
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Hook for loading menu item statistics for icon display
 * Returns warning/critical status based on thresholds
 *
 * @param {string} menuId - Menu ID
 * @param {MenuItem} item - Menu item
 * @returns {Object} Statistics and warning/critical status
 */
export function useMenuItemStatistics(menuId: string, item: MenuItem) {
  const [statistics, setStatistics] = useState<ItemStatistics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
      logger.dev('[useMenuItemStatistics] Cache invalidated - price changed', {
        itemId: item.id,
        oldPrice: cached.data.actual_selling_price,
        newPrice: item.actual_selling_price,
      });
    }

    // Check cache (after potential invalidation)
    const freshCached = statisticsCache.get(cacheKey);
    if (freshCached && now < freshCached.expiry) {
      setStatistics(freshCached.data);
      setLoading(false);
      return;
    }

    // Load statistics if not cached
    setLoading(true);
    const loadStatistics = async () => {
      try {
        const response = await fetch(`/api/menus/${menuId}/items/${item.id}/statistics`, {
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.statistics) {
            setStatistics(result.statistics);
            // Update cache
            statisticsCache.set(cacheKey, {
              data: result.statistics,
              timestamp: now,
              expiry: now + CACHE_EXPIRY_MS,
            });
          }
        }
      } catch (err) {
        // Silently fail - icons just won't show
        logger.error('Failed to load menu item statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to avoid blocking initial render
    const timeoutId = setTimeout(loadStatistics, 100);
    return () => clearTimeout(timeoutId);
  }, [menuId, item.id, item.actual_selling_price]);

  // Determine warning/critical status based on thresholds
  const hasWarning =
    statistics != null &&
    ((statistics.gross_profit_margin >= 50 && statistics.gross_profit_margin < 65) ||
      (statistics.food_cost_percent > 30 && statistics.food_cost_percent <= 35));

  const hasCritical =
    statistics != null &&
    (statistics.gross_profit_margin < 50 || statistics.food_cost_percent > 35);

  return {
    statistics,
    loading,
    hasWarning,
    hasCritical,
  };
}
