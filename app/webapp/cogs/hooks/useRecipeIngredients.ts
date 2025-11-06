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
}

export function useRecipeIngredients({
  setRecipeIngredients,
  setCalculations,
  calculateCOGS,
  setError,
}: UseRecipeIngredientsProps) {
  const { loadExistingRecipeIngredients } = useRecipeIngredientLoading({
    setCalculations,
    setRecipeIngredients,
  });

  const fetchRecipeIngredients = useCallback(
    async (recipeId: string) => {
      if (!recipeId) return;

      try {
        const { data, error } = await supabase
          .from('recipe_ingredients')
          .select('*')
          .eq('recipe_id', recipeId);

        if (error) {
          setError(error.message);
        } else {
          setRecipeIngredients(data || []);
          calculateCOGS(data || []);
        }
      } catch (err) {
        setError('Failed to fetch recipe ingredients');
      }
    },
    [calculateCOGS, setError, setRecipeIngredients],
  );

  const checkRecipeExists = useCallback(
    async (recipeName: string) => {
      if (!recipeName.trim()) {
        return null;
      }

      try {
        const { data: existingRecipes, error } = await supabase
          .from('recipes')
          .select('id, name')
          .ilike('name', recipeName.trim());

        const existingRecipe =
          existingRecipes && existingRecipes.length > 0 ? existingRecipes[0] : null;

        if (error && error.code === 'PGRST116') {
          return false;
        } else if (existingRecipe) {
          await loadExistingRecipeIngredients(existingRecipe.id);
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.log('Error checking recipe:', err);
        return null;
      }
    },
    [loadExistingRecipeIngredients],
  );

  return {
    fetchRecipeIngredients,
    loadExistingRecipeIngredients,
    checkRecipeExists,
  };
}
