/**
 * Hook for fetching par levels and ingredients data.
 */
import { useState, useEffect, useCallback } from 'react';
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { ParLevel, Ingredient } from '../types';

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

      let result;
      try {
        const responseText = await response.text();
        logger.dev('[Par Levels] Response text:', responseText);
        result = JSON.parse(responseText);
        logger.dev('[Par Levels] Parsed result:', result);
      } catch (parseError) {
        logger.error('[Par Levels] Parse error:', parseError);
        showError(`Server error (${response.status}). Please check the server logs.`);
        return;
      }
      if (response.ok && result.success) {
        setParLevels(result.data || []);
        cacheData('par_levels', result.data || []);
      } else {
        const errorMessage =
          result.message || result.error || `Failed to fetch par levels (${response.status})`;
        const instructions = result.details?.instructions || [];
        logger.error('[Par Levels] API Error:', {
          status: response.status,
          error: errorMessage,
          details: result.details,
          code: result.code,
          fullResponse: result,
        });
        showError(
          instructions.length > 0 ? `${errorMessage}\n\n${instructions.join('\n')}` : errorMessage,
        );
        if (instructions.length > 0) logger.dev('[Par Levels] Error Instructions:', instructions);
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
