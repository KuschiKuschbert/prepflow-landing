'use client';
import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';
import type { MenuItem } from '@/lib/types/menu-builder';
import {
  getCachedStatistics,
  invalidateCacheIfPriceChanged,
  setCachedStatistics,
} from './useMenuItemStatistics/helpers/statisticsCache';

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
    if (invalidateCacheIfPriceChanged(cacheKey, item.actual_selling_price ?? null)) {
      logger.dev('[useMenuItemStatistics] Cache invalidated - price changed', {
        itemId: item.id,
        newPrice: item.actual_selling_price,
      });
    }

    const cached = getCachedStatistics(cacheKey);
    if (cached) {
      setStatistics(cached);
      setLoading(false);
      return;
    }

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
            setCachedStatistics(cacheKey, result.statistics);
          }
        }
      } catch (err) {
        logger.error('Failed to load menu item statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(loadStatistics, 100);
    return () => clearTimeout(timeoutId);
  }, [menuId, item.id, item.actual_selling_price]);

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
