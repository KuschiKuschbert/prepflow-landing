/**
 * Handle debounced refresh logic.
 */
import { logger } from '@/lib/logger';
import { invalidateRecipeCache } from '@/lib/cache/recipe-cache';
import type { SubscriptionRefs } from '../types';

export function createDebouncedRefreshHandler(refs: SubscriptionRefs) {
  return () => {
    if (refs.debounceTimerRef.current) clearTimeout(refs.debounceTimerRef.current);
    refs.debounceTimerRef.current = setTimeout(() => {
      const recipeIdsToRefresh = Array.from(refs.pendingRecipeIdsRef.current);
      const refreshTypes = Array.from(refs.pendingRefreshTypeRef.current);
      refs.pendingRecipeIdsRef.current.clear();
      refs.pendingRefreshTypeRef.current.clear();
      logger.dev('[RecipeSubscriptions] Debounced refresh:', { recipeIds: recipeIdsToRefresh, types: refreshTypes });
      sessionStorage.setItem('recipe_ingredients_last_change', Date.now().toString());
      if (recipeIdsToRefresh.length > 0) invalidateRecipeCache(recipeIdsToRefresh);
      if (refreshTypes.includes('prices'))
        refs.refreshRecipePricesRef.current(refs.recipesRef.current, refs.fetchRecipeIngredientsRef.current, refs.fetchBatchRecipeIngredientsRef.current).catch(err => logger.error('Failed to refresh recipe prices after subscription change:', err));
      if (refreshTypes.includes('recipes'))
        refs.fetchRecipesRef.current().catch(err => logger.error('Failed to refresh recipes after subscription change:', err));
      recipeIdsToRefresh.forEach(id => {
        refs.onIngredientsChangeRef.current?.(id);
        refs.onRecipeUpdatedRef.current?.(id);
      });
    }, 300);
  };
}
