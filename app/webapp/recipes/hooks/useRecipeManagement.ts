'use client';

import { cacheRecipes, getCachedRecipes, prefetchRecipes } from '@/lib/cache/recipe-cache';
import { formatRecipeName } from '@/lib/text-utils';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Recipe } from '../types';
import { categorizeError, retryWithBackoff, RecipeError } from '../types/errors';
import { useRecipeIngredients } from './useRecipeIngredients';
import { useRecipePricing } from './useRecipePricing';
import { useRecipeSubscriptions } from './useRecipeSubscriptions';
import { convertToCOGSCalculations } from './utils/recipeCalculationHelpers';
import { storeRecipeForEditing } from './utils/recipeEditHelpers';

export function useRecipeManagement(onIngredientsChange?: (recipeId: string) => void) {
  const router = useRouter();
  // Initialize with empty array to prevent hydration mismatch
  // Cache will be used after mount for instant display
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipeError, setRecipeError] = useState<RecipeError | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const initializedRef = useRef(false);

  const capitalizeRecipeName = formatRecipeName;
  const {
    recipePrices,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    calculateVisibleRecipePrices,
    updateVisibleRecipePrices,
    refreshRecipePrices,
  } = useRecipePricing();
  const { fetchRecipeIngredients, fetchBatchRecipeIngredients } = useRecipeIngredients(setError);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRecipeError(null);

    try {
      await retryWithBackoff(async () => {
        const response = await fetch('/api/recipes', { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) {
          const categorized = categorizeError(
            new Error(result.error || 'Failed to fetch recipes'),
            fetchRecipes,
          );
          setRecipeError(categorized);
          setError(categorized.message);
          setLoading(false);
          throw categorized;
        } else {
          const recipesList = result.recipes || [];
          cacheRecipes(recipesList);
          setRecipes(recipesList);
          setLoading(false);
          setIsHydrated(true);
          // Pre-calculate prices for first page (first 10 recipes) for instant display
          // Reduced from 20 to 10 for faster initial load
          const firstPageRecipes = recipesList.slice(0, 10);
          if (firstPageRecipes.length > 0) {
            console.log('[RecipeManagement] Pre-calculating prices for', firstPageRecipes.length, 'recipes');
            updateVisibleRecipePrices(
              firstPageRecipes,
              fetchRecipeIngredients,
              fetchBatchRecipeIngredients,
            )
              .then(() => {
                console.log('[RecipeManagement] Pre-calculated prices completed');
              })
              .catch(err => {
                console.error('[RecipeManagement] Background price calculation failed:', err);
              });
          }
        }
      });
    } catch (err) {
      const categorized = categorizeError(err, fetchRecipes);
      setRecipeError(categorized);
      setError(categorized.message);
      setLoading(false);
    }
  }, []);

  const handleEditRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        const ingredients = await fetchRecipeIngredients(recipe.id);
        const calculations = convertToCOGSCalculations(ingredients, recipe.id);
        storeRecipeForEditing(recipe, calculations);
        router.push('/webapp/cogs');
      } catch (err) {
        setError('Failed to load recipe for editing');
      }
    },
    [fetchRecipeIngredients, router, setError],
  );
  // Unified subscription for all recipe-related changes
  useRecipeSubscriptions({
    recipes,
    refreshRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    onIngredientsChange,
    onRecipeUpdated: () => {},
    fetchRecipes,
  });
  useEffect(() => {
    // Initialize with cached recipes on client-side mount (prevents hydration mismatch)
    // This runs only once on mount
    if (initializedRef.current) return;
    initializedRef.current = true;

    let mounted = true;

    if (typeof window !== 'undefined') {
      const cached = getCachedRecipes();
      if (cached && cached.length > 0) {
        setRecipes(cached);
        setIsHydrated(true);
        // Pre-calculate prices for first page of cached recipes for instant display
        // Reduced from 20 to 10 for faster initial load
        const firstPageRecipes = cached.slice(0, 10);
        if (firstPageRecipes.length > 0 && mounted) {
          console.log('[RecipeManagement] Pre-calculating cached prices for', firstPageRecipes.length, 'recipes');
          updateVisibleRecipePrices(
            firstPageRecipes,
            fetchRecipeIngredients,
            fetchBatchRecipeIngredients,
          )
            .then(() => {
              if (mounted) {
                console.log('[RecipeManagement] Pre-calculated cached prices completed');
              }
            })
            .catch(err => {
              if (mounted) {
                console.error('[RecipeManagement] Failed to calculate cached recipe prices:', err);
              }
            });
        }
      }
    }

    prefetchRecipes();
    fetchRecipes();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount

  // Optimistic update function for mutations
  const optimisticallyUpdateRecipes = useCallback((updater: (recipes: Recipe[]) => Recipe[]) => {
    setRecipes(prev => updater(prev));
  }, []);

  // Rollback function for optimistic updates
  const rollbackRecipes = useCallback(() => {
    fetchRecipes().catch(err => {
      console.error('Failed to rollback recipes:', err);
      setError('Failed to refresh recipes after error');
    });
  }, [fetchRecipes, setError]);

  return {
    recipes,
    loading,
    error,
    recipeError,
    recipePrices,
    capitalizeRecipeName,
    fetchRecipes,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    handleEditRecipe,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    calculateVisibleRecipePrices,
    updateVisibleRecipePrices,
    refreshRecipePrices: () =>
      refreshRecipePrices(recipes, fetchRecipeIngredients, fetchBatchRecipeIngredients),
    optimisticallyUpdateRecipes,
    rollbackRecipes,
    setError,
  };
}
