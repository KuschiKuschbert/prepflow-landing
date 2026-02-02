/**
 * Types for recipe subscription setup.
 */
import type { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import type { MutableRefObject } from 'react';

export interface SubscriptionRefs {
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
