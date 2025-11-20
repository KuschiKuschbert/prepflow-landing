import { supabase } from '@/lib/supabase';
import { invalidateRecipeCache } from '@/lib/cache/recipe-cache';
import { logger } from '@/lib/logger';
import { Recipe, RecipeIngredientWithDetails } from '../../types';
import type { MutableRefObject } from 'react';

interface SubscriptionRefs {
  refreshRecipePricesRef: MutableRefObject<
    (
      recipes: Recipe[],
      fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
      fetchBatchRecipeIngredients?: (
        recipeIds: string[],
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
    ) => Promise<void>
  >;
  fetchRecipeIngredientsRef: MutableRefObject<
    (recipeId: string) => Promise<RecipeIngredientWithDetails[]>
  >;
  fetchBatchRecipeIngredientsRef: MutableRefObject<
    ((recipeIds: string[]) => Promise<Record<string, RecipeIngredientWithDetails[]>>) | undefined
  >;
  onIngredientsChangeRef: MutableRefObject<((recipeId: string) => void) | undefined>;
  onRecipeUpdatedRef: MutableRefObject<((recipeId: string) => void) | undefined>;
  fetchRecipesRef: MutableRefObject<() => Promise<void>>;
  recipesRef: MutableRefObject<Recipe[]>;
  pendingRecipeIdsRef: MutableRefObject<Set<string>>;
  pendingRefreshTypeRef: MutableRefObject<Set<'prices' | 'recipes'>>;
  debounceTimerRef: MutableRefObject<NodeJS.Timeout | null>;
}

export function setupRecipeSubscriptions(refs: SubscriptionRefs, recipes: Recipe[]) {
  if (typeof window === 'undefined' || recipes.length === 0 || !supabase) return null;
  const handleDebouncedRefresh = () => {
    if (refs.debounceTimerRef.current) clearTimeout(refs.debounceTimerRef.current);
    refs.debounceTimerRef.current = setTimeout(() => {
      const recipeIdsToRefresh = Array.from(refs.pendingRecipeIdsRef.current);
      const refreshTypes = Array.from(refs.pendingRefreshTypeRef.current);
      refs.pendingRecipeIdsRef.current.clear();
      refs.pendingRefreshTypeRef.current.clear();
      logger.dev('[RecipeSubscriptions] Debounced refresh:', {
        recipeIds: recipeIdsToRefresh,
        types: refreshTypes,
      });
      sessionStorage.setItem('recipe_ingredients_last_change', Date.now().toString());
      if (recipeIdsToRefresh.length > 0) invalidateRecipeCache(recipeIdsToRefresh);
      if (refreshTypes.includes('prices')) {
        refs.refreshRecipePricesRef
          .current(refs.recipesRef.current, refs.fetchRecipeIngredientsRef.current, refs.fetchBatchRecipeIngredientsRef.current)
          .catch(err => logger.error('Failed to refresh recipe prices after subscription change:', err));
      }
      if (refreshTypes.includes('recipes')) {
        refs.fetchRecipesRef.current().catch(err => logger.error('Failed to refresh recipes after subscription change:', err));
      }
      recipeIdsToRefresh.forEach(id => {
        refs.onIngredientsChangeRef.current?.(id);
        refs.onRecipeUpdatedRef.current?.(id);
      });
    }, 300);
  };
  return supabase
    .channel('recipe-unified-changes')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'ingredients', filter: 'cost_per_unit=neq.null' },
      payload => {
        logger.dev('[RecipeSubscriptions] Ingredient price changed:', payload);
        refs.pendingRefreshTypeRef.current.add('prices');
        handleDebouncedRefresh();
      },
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'recipe_ingredients' },
      payload => {
        const eventType = payload.eventType;
        const recipeId =
          eventType === 'DELETE'
            ? (payload.old as { recipe_id?: string })?.recipe_id
            : (payload.new as { recipe_id?: string })?.recipe_id ||
              (payload.old as { recipe_id?: string })?.recipe_id;
        logger.dev(`[RecipeSubscriptions] Recipe ingredient ${eventType}:`, {
          eventType,
          recipeId,
        });
        if (!recipeId) {
          logger.warn('[RecipeSubscriptions] No recipe_id in payload', payload);
          return;
        }
        refs.pendingRecipeIdsRef.current.add(recipeId);
        refs.pendingRefreshTypeRef.current.add('prices');
        handleDebouncedRefresh();
      },
    )
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'recipes' }, payload => {
      const recipeId = (payload.new as { id?: string })?.id || (payload.old as { id?: string })?.id;
      logger.dev('[RecipeSubscriptions] Recipe metadata updated:', {
        recipeId,
        changes: payload.new,
      });
      if (!recipeId) {
        logger.warn('[RecipeSubscriptions] No recipe ID in payload', payload);
        return;
      }
      const oldYield = (payload.old as { yield?: number })?.yield;
      const newYield = (payload.new as { yield?: number })?.yield;
      const oldYieldUnit = (payload.old as { yield_unit?: string })?.yield_unit;
      const newYieldUnit = (payload.new as { yield_unit?: string })?.yield_unit;
      const yieldChanged = oldYield !== newYield || oldYieldUnit !== newYieldUnit;
      if (yieldChanged) {
        logger.dev('[RecipeSubscriptions] Yield changed, refreshing recipes');
        refs.pendingRecipeIdsRef.current.add(recipeId);
        refs.pendingRefreshTypeRef.current.add('recipes');
        handleDebouncedRefresh();
      }
    })
    .subscribe();
}
