// PrepFlow - Recipe Ingredients Management Hook
// Extracted from useCOGSCalculations.ts to meet file size limits

'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { RecipeIngredient } from '../types';
import { useRecipeIngredientLoading } from './useRecipeIngredientLoading';

interface UseRecipeIngredientsProps {
  setRecipeIngredients: React.Dispatch<React.SetStateAction<RecipeIngredient[]>>;
  setCalculations: React.Dispatch<React.SetStateAction<any[]>>;
  calculateCOGS: (recipeIngredients: RecipeIngredient[]) => void;
  setError: (error: string) => void;
  setIsLoadingFromApi?: (loading: boolean) => void;
  shouldPreserveManualIngredients?: () => boolean;
}

export function useRecipeIngredients({
  setRecipeIngredients,
  setCalculations,
  calculateCOGS,
  setError,
  setIsLoadingFromApi,
  shouldPreserveManualIngredients,
}: UseRecipeIngredientsProps) {
  const { loadExistingRecipeIngredients } = useRecipeIngredientLoading({
    setCalculations,
    setRecipeIngredients,
    setError,
    setIsLoadingFromApi,
    preserveManualIngredients: shouldPreserveManualIngredients?.() || false,
  });

  const fetchRecipeIngredients = useCallback(
    async (recipeId: string) => {
      if (!recipeId) return;

      try {
        // Use loadExistingRecipeIngredients which properly joins with ingredients table
        // and calculates COGS with all necessary data
        await loadExistingRecipeIngredients(recipeId);
      } catch (err) {
        console.error('Failed to fetch recipe ingredients:', err);
        setError('Failed to fetch recipe ingredients');
      }
    },
    [loadExistingRecipeIngredients, setError],
  );

  const checkRecipeExists = useCallback(async (recipeName: string) => {
    if (!recipeName.trim()) {
      return { exists: null, recipeId: null };
    }

    try {
      const { data: existingRecipes, error } = await supabase
        .from('recipes')
        .select('id, name')
        .ilike('name', recipeName.trim());

      const existingRecipe =
        existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;

      if (error && error.code === 'PGRST116') {
        return { exists: false, recipeId: null };
      } else if (existingRecipe) {
        return { exists: true, recipeId: existingRecipe.id };
      } else {
        return { exists: false, recipeId: null };
      }
    } catch (err) {
      console.log('Error checking recipe:', err);
      return { exists: null, recipeId: null };
    }
  }, []);

  return {
    fetchRecipeIngredients,
    loadExistingRecipeIngredients,
    checkRecipeExists,
  };
}
