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
          console.log('Recipe ingredients changed:', payload);
          refreshRecipePrices(recipes, fetchRecipeIngredients, fetchBatchRecipeIngredients).catch(
            err => {
              console.error('Failed to refresh recipe prices after ingredient change:', err);
            },
          );
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [recipes, refreshRecipePrices, fetchRecipeIngredients, fetchBatchRecipeIngredients]);
}
