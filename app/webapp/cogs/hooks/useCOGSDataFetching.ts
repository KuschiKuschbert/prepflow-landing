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

      // Fetch ingredients using Supabase client
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .order('ingredient_name');

      // Fetch recipes using API endpoint (same as recipes page) to avoid RLS issues
      const recipesResponse = await fetch('/api/recipes?pageSize=1000', { cache: 'no-store' });
      const recipesResult = await recipesResponse.json();

      if (ingredientsError) {
        console.error('Error fetching ingredients:', ingredientsError);
        setError(`Failed to load ingredients: ${ingredientsError.message}`);
        setIngredients([]);
      } else {
        setIngredients(ingredientsData || []);
      }

      if (!recipesResponse.ok || recipesResult.error) {
        console.error('Error fetching recipes:', recipesResult.error);
        setError(
          prev =>
            `${prev ? prev + ' ' : ''}Failed to load recipes: ${recipesResult.error || 'Unknown error'}`,
        );
        setRecipes([]);
      } else {
        const recipesData = recipesResult.recipes || [];
        // Debug: Log recipes data to verify fetch is working
        console.log('🔍 DEBUG useCOGSDataFetching: Recipes fetched', {
          recipesCount: recipesData.length,
          recipes: recipesData,
        });
        setRecipes(recipesData);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
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
