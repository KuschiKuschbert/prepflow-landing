/**
 * Hook for fetching par levels and ingredients data.
 */
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import type { Ingredient, ParLevel } from '../types';
import { handleParLevelsError } from './useParLevelsData/helpers/handleParLevelsError';
import { parseParLevelsResponse } from './useParLevelsData/helpers/parseParLevelsResponse';

interface UseParLevelsDataReturn {
  parLevels: ParLevel[];
  ingredients: Ingredient[];
  loading: boolean;
  setParLevels: React.Dispatch<React.SetStateAction<ParLevel[]>>;
  fetchParLevels: () => Promise<void>;
  fetchIngredients: () => Promise<void>;
}

interface UseParLevelsDataProps {
  showError: (message: string) => void;
}

/**
 * Hook for fetching par levels and ingredients data.
 */
export function useParLevelsData({ showError }: UseParLevelsDataProps): UseParLevelsDataReturn {
  // Initialize with empty array to avoid hydration mismatch
  // Cached data will be loaded in useEffect after mount
  const [parLevels, setParLevels] = useState<ParLevel[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchParLevels = useCallback(async () => {
    setLoading(true);
    logger.dev('[Par Levels] Fetching par levels...');
    try {
      const response = await fetch('/api/par-levels');
      logger.dev(`[Par Levels] Response status: ${response.status} ${response.statusText}`);

      const result = await parseParLevelsResponse({ response, showError });
      if (!result) return;

      interface ParLevelsResponse {
        success: boolean;
        data?: ParLevel[];
        error?: string;
      }

      const parLevelsResult = result as ParLevelsResponse;

      if (response.ok && parLevelsResult.success) {
        const data = parLevelsResult.data || [];
        setParLevels(data);
        cacheData('par_levels', data);
      } else {
        handleParLevelsError({ response, result: parLevelsResult, showError });
      }
    } catch (err) {
      logger.error('Failed to fetch par levels:', err);
      showError('Failed to fetch par levels. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [showError]);
  const fetchIngredients = useCallback(async () => {
    try {
      const response = await fetch('/api/ingredients');
      const result = await response.json();

      if (result.success) {
        const items = result.data?.items || result.data || [];
        setIngredients(items);
        // Cache ingredients for par levels page
        cacheData('par_levels_ingredients', items);
      }
    } catch (err) {
      logger.error('Failed to fetch ingredients:', err);
    }
  }, []);
  // Prefetch APIs on mount
  useEffect(() => {
    prefetchApis(['/api/par-levels', '/api/ingredients']);
  }, []);

  useEffect(() => {
    // Load cached data for instant display (client-only)
    const cachedParLevels = getCachedData<ParLevel[]>('par_levels');
    if (cachedParLevels && cachedParLevels.length > 0) {
      setParLevels(cachedParLevels);
    }

    // Fetch fresh data
    fetchParLevels();
    fetchIngredients();
  }, [fetchParLevels, fetchIngredients]);

  return {
    parLevels,
    ingredients,
    loading,
    setParLevels,
    fetchParLevels,
    fetchIngredients,
  };
}
