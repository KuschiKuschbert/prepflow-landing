'use client';
import { useEffect, useRef } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { setupRecipeSubscriptions } from './utils/recipeSubscriptionSetup';
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
  const refreshRecipePricesRef = useRef(refreshRecipePrices);
  const fetchRecipeIngredientsRef = useRef(fetchRecipeIngredients);
  const fetchBatchRecipeIngredientsRef = useRef(fetchBatchRecipeIngredients);
  const onIngredientsChangeRef = useRef(onIngredientsChange);
  const onRecipeUpdatedRef = useRef(onRecipeUpdated);
  const fetchRecipesRef = useRef(fetchRecipes);
  const recipesRef = useRef(recipes);

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
    const subscription = setupRecipeSubscriptions(
      {
        refreshRecipePricesRef,
        fetchRecipeIngredientsRef,
        fetchBatchRecipeIngredientsRef,
        onIngredientsChangeRef,
        onRecipeUpdatedRef,
        fetchRecipesRef,
        recipesRef,
        pendingRecipeIdsRef,
        pendingRefreshTypeRef,
        debounceTimerRef,
      },
      recipes,
    );
    const timerRef = debounceTimerRef.current;
    return () => {
      if (timerRef) clearTimeout(timerRef);
      if (subscription) subscription.unsubscribe();
    };
  }, [recipes]);
}
