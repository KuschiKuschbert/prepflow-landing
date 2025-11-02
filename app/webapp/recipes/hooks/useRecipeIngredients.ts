'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { RecipeIngredientWithDetails } from '../types';

export function useRecipeIngredients(setError: (error: string) => void) {
  const fetchRecipeIngredients = useCallback(
    async (recipeId: string): Promise<RecipeIngredientWithDetails[]> => {
      try {
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select(
            `
          id,
          recipe_id,
          ingredient_id,
          quantity,
          unit,
          ingredients (
            id,
            ingredient_name,
            cost_per_unit,
            unit,
            trim_peel_waste_percentage,
            yield_percentage
          )
        `,
          )
          .eq('recipe_id', recipeId);

        if (ingredientsError) {
          setError(ingredientsError.message);
          return [];
        }

        return (ingredientsData || []) as unknown as RecipeIngredientWithDetails[];
      } catch (err) {
        setError('Failed to fetch recipe ingredients');
        return [];
      }
    },
    [setError],
  );

  return { fetchRecipeIngredients };
}
