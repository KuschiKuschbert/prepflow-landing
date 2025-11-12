'use client';

import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';

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
          const recipeId =
            (payload.new as { recipe_id?: string })?.recipe_id ||
            (payload.old as { recipe_id?: string })?.recipe_id;
          console.log(
            `[Recipe Ingredients Subscription] ${eventType} event for recipe_id: ${recipeId}`,
            payload,
          );
          if (!recipeId) {
            console.warn(
              '[Recipe Ingredients Subscription] No recipe_id found in payload',
              payload,
            );
            return;
          }
          refreshRecipePrices(recipes, fetchRecipeIngredients, fetchBatchRecipeIngredients).catch(
            err => {
              console.error('Failed to refresh recipe prices after ingredient change:', err);
            },
          );
          if (onIngredientsChange) {
            onIngredientsChange(recipeId);
          }
        },
      )
      .subscribe();

    return () => {
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
