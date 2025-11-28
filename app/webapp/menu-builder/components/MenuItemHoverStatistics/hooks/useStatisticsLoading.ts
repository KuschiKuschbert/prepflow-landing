import { logger } from '@/lib/logger';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MenuItem } from '../../types';

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

/**
 * Hook for loading menu item statistics with caching
 */
export function useStatisticsLoading(menuId: string, item: MenuItem, isVisible: boolean) {
  const [statistics, setStatistics] = useState<ItemStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadStatistics = useCallback(
    async (retryCount = 0) => {
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
      }

      // Check cache (after potential invalidation)
      const freshCached = statisticsCache.get(cacheKey);
      if (freshCached && now < freshCached.expiry) {
        setStatistics(freshCached.data);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/menus/${menuId}/items/${item.id}/statistics`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 404) {
            if (retryCount < 1) {
              logger.dev('[MenuItemHoverStatistics] 404, retrying...', { menuId, itemId: item.id });
              setTimeout(() => loadStatistics(retryCount + 1), 500);
              return;
            }
            logger.dev('[MenuItemHoverStatistics] 404 after retry, skipping', {
              menuId,
              itemId: item.id,
            });
            setLoading(false);
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || errorData.message || 'Failed to load statistics');
          setLoading(false);
          return;
        }
        const result = await response.json();
        if (result.success) {
          logger.dev('[MenuItemHoverStatistics] Statistics loaded', { cacheKey });
          setStatistics(result.statistics);
          statisticsCache.set(cacheKey, {
            data: result.statistics,
            timestamp: now,
            expiry: now + CACHE_EXPIRY_MS,
          });
        } else {
          logger.error('[MenuItemHoverStatistics] API error', {
            cacheKey,
            error: result.error || result.message,
          });
          setError(result.error || result.message || 'Failed to load statistics');
        }
      } catch (err) {
        logger.error('Failed to load item statistics:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    },
    [menuId, item.id, item.actual_selling_price],
  );

  useEffect(() => {
    if (currentItemId !== null && currentItemId !== item.id) {
      setStatistics(null);
      setError(null);
      setLoading(false);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    }
    setCurrentItemId(item.id);
  }, [item.id, currentItemId]);

  useEffect(() => {
    const clearHoverTimeout = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };
    if (isVisible) {
      logger.dev('[MenuItemHoverStatistics] Loading statistics', { menuId, itemId: item.id });
      clearHoverTimeout();
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
        logger.dev('[useStatisticsLoading] Cache invalidated in useEffect - price changed', {
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
        setError(null);
      } else {
        setLoading(true);
        setError(null);
        hoverTimeoutRef.current = setTimeout(() => loadStatistics(), 100);
      }
      return clearHoverTimeout;
    } else {
      clearHoverTimeout();
    }
  }, [
    isVisible,
    menuId,
    item.id,
    item.actual_selling_price,
    item.dishes?.dish_name,
    item.recipes?.recipe_name,
    loadStatistics,
  ]);

  return { statistics, loading, error };
}
