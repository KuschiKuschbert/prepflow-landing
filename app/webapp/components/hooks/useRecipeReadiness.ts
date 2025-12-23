import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { useEffect, useState } from 'react';

import { logger } from '@/lib/logger';
interface RecipeReadinessData {
  completeRecipes: number;
  incompleteRecipes: number;
  recipesWithoutCost: number;
  mostUsedRecipes: Array<{
    id: string;
    name: string;
    usageCount: number;
  }>;
  totalRecipes: number;
}

export function useRecipeReadiness() {
  const [data, setData] = useState<RecipeReadinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const cached = getCachedData<RecipeReadinessData>('dashboard_recipe_readiness');
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      try {
        const response = await fetch('/api/dashboard/recipe-readiness');

        if (!response.ok) {
          let errorMessage = 'Failed to fetch recipe readiness';
          try {
            const errorResult = await response.json();
            errorMessage = errorResult.message || errorResult.error || errorMessage;
          } catch {
            errorMessage = response.statusText || `HTTP ${response.status}`;
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
          cacheData('dashboard_recipe_readiness', result.data);
        } else {
          throw new Error(result.message || 'Invalid response format');
        }
      } catch (err) {
        logger.error('Error fetching recipe readiness:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recipe readiness');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dashboard/recipe-readiness');
      if (!response.ok) {
        throw new Error('Failed to fetch recipe readiness');
      }
      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        cacheData('dashboard_recipe_readiness', result.data);
      }
    } catch (err) {
      logger.error('[useRecipeReadiness.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

      setError(err instanceof Error ? err.message : 'Failed to fetch recipe readiness');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}
