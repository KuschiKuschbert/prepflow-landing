'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useRef } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';

import { logger } from '../../lib/logger';
export function useRecipeIngredientsSubscription(
  recipes: Recipe[],
  refreshRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>,
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
  fetchBatchRecipeIngredients?: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  onIngredientsChange?: (recipeId: string) => void,
) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingRecipeIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (recipes.length === 0) return;
    if (!supabase) return;

    const subscription = supabase
      .channel('recipe-ingredients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipe_ingredients',
        },
        payload => {
          const eventType = payload.eventType; // INSERT, UPDATE, DELETE
          // For DELETE events, recipe_id is in payload.old, not payload.new
          const recipeId =
            eventType === 'DELETE'
              ? (payload.old as { recipe_id?: string })?.recipe_id
              : (payload.new as { recipe_id?: string })?.recipe_id ||
                (payload.old as { recipe_id?: string })?.recipe_id;
          logger.dev(`[Subscription] ${eventType} for recipe: ${recipeId}`, {
            eventType,
            recipeId,
            hasNew: !!payload.new,
            hasOld: !!payload.old,
          });
          if (!recipeId) {
            logger.warn('[Subscription] No recipe_id in payload', payload);
            return;
          }
          // Add to pending set for debouncing
          pendingRecipeIdsRef.current.add(recipeId);
          // Debounce rapid-fire events (multiple DELETE/INSERT events from batch operations)
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          debounceTimerRef.current = setTimeout(() => {
            const recipeIdsToRefresh = Array.from(pendingRecipeIdsRef.current);
            pendingRecipeIdsRef.current.clear();
            logger.dev('[Subscription] Debounced refresh:', recipeIdsToRefresh);
            // Store timestamp in sessionStorage so recipe book can detect changes
            sessionStorage.setItem('recipe_ingredients_last_change', Date.now().toString());
            refreshRecipePrices(recipes, fetchRecipeIngredients, fetchBatchRecipeIngredients).catch(
              err => {
                logger.error('Failed to refresh recipe prices after ingredient change:', err);
              },
            );
            // Call onIngredientsChange for each recipe that changed
            if (onIngredientsChange) {
              recipeIdsToRefresh.forEach(id => onIngredientsChange(id));
            }
          }, 100); // 100ms debounce for rapid-fire events
        },
      )
      .subscribe();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      subscription.unsubscribe();
    };
  }, [
    recipes,
    refreshRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    onIngredientsChange,
  ]);
}
