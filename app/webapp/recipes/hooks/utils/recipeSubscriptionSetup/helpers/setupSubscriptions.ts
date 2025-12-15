/**
 * Setup Supabase subscriptions.
 */
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { SubscriptionRefs } from '../types';
import { createDebouncedRefreshHandler } from './handleDebouncedRefresh';

export function setupSubscriptionsHelper(refs: SubscriptionRefs, recipes: any[]) {
  if (typeof window === 'undefined' || recipes.length === 0 || !supabase) return null;
  const handleDebouncedRefresh = createDebouncedRefreshHandler(refs);
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
      if (oldYield !== newYield || oldYieldUnit !== newYieldUnit) {
        logger.dev('[RecipeSubscriptions] Yield changed, refreshing recipes');
        refs.pendingRecipeIdsRef.current.add(recipeId);
        refs.pendingRefreshTypeRef.current.add('recipes');
        handleDebouncedRefresh();
      }
    })
    .subscribe();
}
