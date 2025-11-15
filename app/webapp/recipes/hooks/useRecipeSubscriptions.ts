'use client';

import { supabase } from '@/lib/supabase';
import { invalidateRecipeCache } from '@/lib/cache/recipe-cache';
import { useEffect, useRef } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';

interface UseRecipeSubscriptionsProps {
  recipes: Recipe[];
  refreshRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  fetchBatchRecipeIngredients?: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
  onIngredientsChange?: (recipeId: string) => void;
  onRecipeUpdated?: (recipeId: string) => void;
  fetchRecipes: () => Promise<void>;
}

/**
 * Unified subscription hook for all recipe-related changes
 * Consolidates price, ingredients, and metadata subscriptions into a single channel
 * with unified debouncing and smart batching
 */
export function useRecipeSubscriptions({
  recipes,
  refreshRecipePrices,
  fetchRecipeIngredients,
  fetchBatchRecipeIngredients,
  onIngredientsChange,
  onRecipeUpdated,
  fetchRecipes,
}: UseRecipeSubscriptionsProps) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingRecipeIdsRef = useRef<Set<string>>(new Set());
  const pendingRefreshTypeRef = useRef<Set<'prices' | 'recipes'>>(new Set());

  // Use refs for stable function references to prevent subscription recreation
  const refreshRecipePricesRef = useRef(refreshRecipePrices);
  const fetchRecipeIngredientsRef = useRef(fetchRecipeIngredients);
  const fetchBatchRecipeIngredientsRef = useRef(fetchBatchRecipeIngredients);
  const onIngredientsChangeRef = useRef(onIngredientsChange);
  const onRecipeUpdatedRef = useRef(onRecipeUpdated);
  const fetchRecipesRef = useRef(fetchRecipes);
  const recipesRef = useRef(recipes);

  // Update refs when props change
  useEffect(() => {
    refreshRecipePricesRef.current = refreshRecipePrices;
    fetchRecipeIngredientsRef.current = fetchRecipeIngredients;
    fetchBatchRecipeIngredientsRef.current = fetchBatchRecipeIngredients;
    onIngredientsChangeRef.current = onIngredientsChange;
    onRecipeUpdatedRef.current = onRecipeUpdated;
    fetchRecipesRef.current = fetchRecipes;
    recipesRef.current = recipes;
  }, [
    refreshRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    onIngredientsChange,
    onRecipeUpdated,
    fetchRecipes,
    recipes,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (recipes.length === 0) return;
    if (!supabase) return;

    // Unified debounced refresh handler
    const handleDebouncedRefresh = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const recipeIdsToRefresh = Array.from(pendingRecipeIdsRef.current);
        const refreshTypes = Array.from(pendingRefreshTypeRef.current);
        pendingRecipeIdsRef.current.clear();
        pendingRefreshTypeRef.current.clear();

        console.log('[RecipeSubscriptions] Debounced refresh:', {
          recipeIds: recipeIdsToRefresh,
          types: refreshTypes,
        });

        // Store timestamp for session storage detection
        sessionStorage.setItem('recipe_ingredients_last_change', Date.now().toString());

        // Invalidate cache for affected recipes only
        if (recipeIdsToRefresh.length > 0) {
          invalidateRecipeCache(recipeIdsToRefresh);
        }

        // Refresh prices if needed
        if (refreshTypes.includes('prices')) {
          refreshRecipePricesRef
            .current(recipesRef.current, fetchRecipeIngredientsRef.current, fetchBatchRecipeIngredientsRef.current)
            .catch(err => {
              console.error('Failed to refresh recipe prices after subscription change:', err);
            });
        }

        // Refresh recipes list if needed
        if (refreshTypes.includes('recipes')) {
          fetchRecipesRef.current().catch(err => {
            console.error('Failed to refresh recipes after subscription change:', err);
          });
        }

        // Call change callbacks
        recipeIdsToRefresh.forEach(id => {
          if (onIngredientsChangeRef.current) {
            onIngredientsChangeRef.current(id);
          }
          if (onRecipeUpdatedRef.current) {
            onRecipeUpdatedRef.current(id);
          }
        });
      }, 300); // Unified 300ms debounce
    };

    // Single unified subscription channel
    const subscription = supabase
      .channel('recipe-unified-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ingredients',
          filter: 'cost_per_unit=neq.null',
        },
        payload => {
          console.log('[RecipeSubscriptions] Ingredient price changed:', payload);
          pendingRefreshTypeRef.current.add('prices');
          handleDebouncedRefresh();
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipe_ingredients',
        },
        payload => {
          const eventType = payload.eventType;
          const recipeId =
            eventType === 'DELETE'
              ? (payload.old as { recipe_id?: string })?.recipe_id
              : (payload.new as { recipe_id?: string })?.recipe_id ||
                (payload.old as { recipe_id?: string })?.recipe_id;

          console.log(`[RecipeSubscriptions] Recipe ingredient ${eventType}:`, {
            eventType,
            recipeId,
          });

          if (!recipeId) {
            console.warn('[RecipeSubscriptions] No recipe_id in payload', payload);
            return;
          }

          pendingRecipeIdsRef.current.add(recipeId);
          pendingRefreshTypeRef.current.add('prices');
          handleDebouncedRefresh();
        },
      )
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

          console.log('[RecipeSubscriptions] Recipe metadata updated:', {
            recipeId,
            changes: payload.new,
          });

          if (!recipeId) {
            console.warn('[RecipeSubscriptions] No recipe ID in payload', payload);
            return;
          }

          // Check if yield or yield_unit changed
          const oldYield = (payload.old as { yield?: number })?.yield;
          const newYield = (payload.new as { yield?: number })?.yield;
          const oldYieldUnit = (payload.old as { yield_unit?: string })?.yield_unit;
          const newYieldUnit = (payload.new as { yield_unit?: string })?.yield_unit;
          const yieldChanged = oldYield !== newYield || oldYieldUnit !== newYieldUnit;

          if (yieldChanged) {
            console.log('[RecipeSubscriptions] Yield changed, refreshing recipes');
            pendingRecipeIdsRef.current.add(recipeId);
            pendingRefreshTypeRef.current.add('recipes');
            handleDebouncedRefresh();
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
  }, []); // Empty deps - we use refs for all values to prevent recreation
}
