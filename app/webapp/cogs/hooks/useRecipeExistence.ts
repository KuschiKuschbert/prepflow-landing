'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface UseRecipeExistenceResult {
  exists: boolean;
  loading: boolean;
}

/**
 * Hook to check if a recipe exists in the database
 * Caches results to avoid redundant queries
 */
export function useRecipeExistence(recipeId: string | null): UseRecipeExistenceResult {
  const [exists, setExists] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const cacheRef = useRef<Map<string, boolean>>(new Map());
  const currentRecipeIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!recipeId) {
      setExists(false);
      setLoading(false);
      currentRecipeIdRef.current = null;
      return;
    }

    // If recipe ID hasn't changed, don't re-check
    if (currentRecipeIdRef.current === recipeId) {
      return;
    }

    // Check cache first
    const cached = cacheRef.current.get(recipeId);
    if (cached !== undefined) {
      setExists(cached);
      setLoading(false);
      currentRecipeIdRef.current = recipeId;
      return;
    }

    // Query database
    setLoading(true);
    currentRecipeIdRef.current = recipeId;

    supabase
      .from('recipes')
      .select('id')
      .eq('id', recipeId)
      .maybeSingle()
      .then(({ data, error }) => {
        // Only update if this is still the current recipe
        if (currentRecipeIdRef.current === recipeId) {
          const recipeExists = !error && Boolean(data);
          setExists(recipeExists);
          setLoading(false);
          cacheRef.current.set(recipeId, recipeExists);
        }
      })
      .catch(() => {
        if (currentRecipeIdRef.current === recipeId) {
          setExists(false);
          setLoading(false);
        }
      });
  }, [recipeId]);

  return { exists, loading };
}
