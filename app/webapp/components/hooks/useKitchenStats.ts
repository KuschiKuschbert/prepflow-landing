import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';

export interface KitchenOperationsStats {
  totalMenuDishes: number;
  recipesReady: number;
  ingredientsLowStock: number;
  temperatureChecksToday: number;
  cleaningTasksPending: number;
}

export function useKitchenStats() {
  const [stats, setStats] = useState<KitchenOperationsStats>({
    totalMenuDishes: 0,
    recipesReady: 0,
    ingredientsLowStock: 0,
    temperatureChecksToday: 0,
    cleaningTasksPending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Initialize with cached data
      const cachedStats = getCachedData<KitchenOperationsStats>('dashboard_stats');
      if (cachedStats) {
        setStats({
          totalMenuDishes: cachedStats.totalMenuDishes || 0,
          recipesReady: cachedStats.recipesReady || 0,
          ingredientsLowStock: cachedStats.ingredientsLowStock || 0,
          temperatureChecksToday: cachedStats.temperatureChecksToday || 0,
          cleaningTasksPending: cachedStats.cleaningTasksPending || 0,
        });
        setLoading(false);
      }

      try {
        const response = await fetch('/api/dashboard/stats', { cache: 'no-store' });

        if (!response.ok) {
          const errorText = await response.text();
          logger.error('Error fetching kitchen operations stats:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
          });
          // Keep cached stats if available, don't clear them
          return;
        }

        const result = await response.json();
        if (result.success) {
          const newStats: KitchenOperationsStats = {
            totalMenuDishes: result.totalMenuDishes || 0,
            recipesReady: result.recipesReady || 0,
            ingredientsLowStock: result.ingredientsLowStock || 0,
            temperatureChecksToday: result.temperatureChecksToday || 0,
            cleaningTasksPending: result.cleaningTasksPending || 0,
          };
          setStats(newStats);
          cacheData('dashboard_stats', result);
        }
      } catch (err) {
        logger.error('Error fetching kitchen operations stats:', err);

        // Check if it's a network error
        if (err instanceof TypeError && err.message.includes('fetch')) {
          logger.error(
            'Network error: Unable to connect to server. Using cached data if available.',
          );
          // Keep cached stats if available, don't clear them
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, loading };
}
