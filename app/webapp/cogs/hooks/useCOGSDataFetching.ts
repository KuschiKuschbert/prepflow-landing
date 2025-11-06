// PrepFlow - COGS Data Fetching Hook
// Extracted from useCOGSCalculations.ts to meet file size limits

'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Ingredient, Recipe } from '../types';

export function useCOGSDataFetching() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .order('ingredient_name');

      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('name');

      if (ingredientsError) {
        console.error('Error fetching ingredients:', ingredientsError);
        setError(`Failed to load ingredients: ${ingredientsError.message}`);
        setIngredients([]);
      } else {
        setIngredients(ingredientsData || []);
      }

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError);
        setError(
          prev => `${prev ? prev + ' ' : ''}Failed to load recipes: ${recipesError.message}`,
        );
        setRecipes([]);
      } else {
        setRecipes(recipesData || []);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ingredients,
    recipes,
    loading,
    error,
    setError,
    fetchData,
    setIngredients,
    setRecipes,
  };
}
