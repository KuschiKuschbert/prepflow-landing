'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Recipe } from '../types';
import { RecipeIngredientWithDetails } from '../types';

export function useRecipePriceSubscription(
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
      .channel('ingredient-price-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ingredients',
          filter: 'cost_per_unit=neq.null',
        },
        payload => {
          console.log('Ingredient price changed:', payload);
          refreshRecipePrices(recipes, fetchRecipeIngredients, fetchBatchRecipeIngredients);
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [recipes, refreshRecipePrices, fetchRecipeIngredients, fetchBatchRecipeIngredients]);
}
