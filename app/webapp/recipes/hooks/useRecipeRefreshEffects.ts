'use client';

import { useEffect } from 'react';

interface UseRecipeRefreshEffectsProps {
  loading: boolean;
  changedRecipeIds: Set<string>;
  fetchRecipes: () => Promise<void>;
}

export function useRecipeRefreshEffects({
  loading,
  changedRecipeIds,
  fetchRecipes,
}: UseRecipeRefreshEffectsProps) {
  // Loading gate effect
  useEffect(() => {
    const { startLoadingGate, stopLoadingGate } = require('@/lib/loading-gate');
    if (loading) startLoadingGate('recipes');
    else stopLoadingGate('recipes');
    return () => stopLoadingGate('recipes');
  }, [loading]);

  // Visibility change effect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && changedRecipeIds.size > 0) {
        console.log('[RecipesClient] Page visible, refreshing:', changedRecipeIds);
        fetchRecipes().catch(err => console.error('Failed to refresh:', err));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [changedRecipeIds, fetchRecipes]);

  // Session storage effect
  useEffect(() => {
    const lastChangeTime = sessionStorage.getItem('recipe_ingredients_last_change');
    if (lastChangeTime) {
      const timeSinceChange = Date.now() - parseInt(lastChangeTime, 10);
      if (timeSinceChange < 5 * 60 * 1000 && !loading) {
        console.log('[RecipesClient] Recent changes detected, refreshing');
        fetchRecipes().catch(err => console.error('Failed to refresh:', err));
        sessionStorage.removeItem('recipe_ingredients_last_change');
      }
    }
  }, [loading, fetchRecipes]);
}
