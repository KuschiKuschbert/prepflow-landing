import { logger } from '@/lib/logger';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MenuItem } from '@/lib/types/menu-builder';
import {
  getCachedStatistics,
  setCachedStatistics,
} from './useStatisticsLoading/helpers/cacheUtils';
import { fetchStatistics } from './useStatisticsLoading/helpers/fetchStatistics';

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
 * Hook for loading menu item statistics with caching
 */
export function useStatisticsLoading(menuId: string, item: MenuItem, isVisible: boolean) {
  const [statistics, setStatistics] = useState<ItemStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadStatistics = useCallback(async () => {
    const cached = getCachedStatistics(menuId, item);
    if (cached) {
      setStatistics(cached);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await fetchStatistics(menuId, item.id);

    if (result.success && result.statistics) {
      setStatistics(result.statistics);
      setCachedStatistics(menuId, item.id, result.statistics);
    } else {
      setError(result.error || 'Failed to load statistics');
    }

    setLoading(false);
  }, [menuId, item]);

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

      const cached = getCachedStatistics(menuId, item);
      if (cached) {
        setStatistics(cached);
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
  }, [isVisible, menuId, item, loadStatistics]);

  return { statistics, loading, error };
}
