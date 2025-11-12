'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useRef } from 'react';
import { Recipe } from '../types';

interface UseRecipeMetadataSubscriptionProps {
  recipes: Recipe[];
  onRecipeUpdated: (recipeId: string) => void;
  fetchRecipes: () => Promise<void>;
}

/**
 * Hook to subscribe to recipe metadata changes (yield, yield_unit, etc.)
 * Refreshes recipes list when recipe metadata is updated
 */
export function useRecipeMetadataSubscription({
  recipes,
  onRecipeUpdated,
  fetchRecipes,
}: UseRecipeMetadataSubscriptionProps) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingRecipeIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (recipes.length === 0) return;
    if (!supabase) return;

    const subscription = supabase
      .channel('recipe-metadata-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'recipes',
        },
        payload => {
          const recipeId =
            (payload.new as { id?: string })?.id || (payload.old as { id?: string })?.id;
          console.log('[RecipeMetadataSubscription] Recipe updated:', {
            recipeId,
            changes: payload.new,
          });
          if (!recipeId) {
            console.warn('[RecipeMetadataSubscription] No recipe ID in payload', payload);
            return;
          }
          // Check if yield or yield_unit changed
          const oldYield = (payload.old as { yield?: number })?.yield;
          const newYield = (payload.new as { yield?: number })?.yield;
          const oldYieldUnit = (payload.old as { yield_unit?: string })?.yield_unit;
          const newYieldUnit = (payload.new as { yield_unit?: string })?.yield_unit;
          const yieldChanged = oldYield !== newYield || oldYieldUnit !== newYieldUnit;
          if (yieldChanged) {
            console.log('[RecipeMetadataSubscription] Yield changed, refreshing recipes');
            // Add to pending set for debouncing
            pendingRecipeIdsRef.current.add(recipeId);
            // Debounce rapid-fire events
            if (debounceTimerRef.current) {
              clearTimeout(debounceTimerRef.current);
            }
            debounceTimerRef.current = setTimeout(() => {
              const recipeIdsToRefresh = Array.from(pendingRecipeIdsRef.current);
              pendingRecipeIdsRef.current.clear();
              console.log('[RecipeMetadataSubscription] Debounced refresh:', recipeIdsToRefresh);
              // Refresh recipes list
              fetchRecipes().catch(err => {
                console.error('[RecipeMetadataSubscription] Failed to refresh recipes:', err);
              });
              // Call onRecipeUpdated for each recipe that changed
              recipeIdsToRefresh.forEach(id => onRecipeUpdated(id));
            }, 100); // 100ms debounce
          }
        },
      )
      .subscribe();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      subscription.unsubscribe();
    };
  }, [recipes, onRecipeUpdated, fetchRecipes]);
}
