// PrepFlow - COGS Data Fetching Hook
// Extracted from useCOGSCalculations.ts to meet file size limits

'use client';

import { useCallback, useState } from 'react';
import { Ingredient, Recipe } from '@/lib/types/cogs';

import { logger } from '@/lib/logger';
export function useCOGSDataFetching() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ingredients and recipes in parallel
      const [ingredientsResponse, recipesResponse] = await Promise.all([
        fetch('/api/ingredients?pageSize=1000', { cache: 'no-store' }),
        fetch('/api/recipes?pageSize=1000', { cache: 'no-store' }),
      ]);
      const [ingredientsResult, recipesResult] = await Promise.all([
        ingredientsResponse.json(),
        recipesResponse.json(),
      ]);

      if (!ingredientsResponse.ok || ingredientsResult.error) {
        logger.error('Error fetching ingredients:', ingredientsResult.error);
        setError(`Failed to load ingredients: ${ingredientsResult.error || 'Unknown error'}`);
        setIngredients([]);
      } else {
        const ingredientsData = ingredientsResult.data?.items || [];
        logger.dev('🔍 DEBUG useCOGSDataFetching: Ingredients fetched', {
          ingredientsCount: ingredientsData.length,
        });
        setIngredients(ingredientsData);
      }

      if (!recipesResponse.ok || recipesResult.error) {
        logger.error('Error fetching recipes:', recipesResult.error);
        setError(
          prev =>
            `${prev ? prev + ' ' : ''}Failed to load recipes: ${recipesResult.error || 'Unknown error'}`,
        );
        setRecipes([]);
      } else {
        const recipesData = recipesResult.recipes || [];
        logger.dev('🔍 DEBUG useCOGSDataFetching: Recipes fetched', {
          recipesCount: recipesData.length,
        });
        setRecipes(recipesData);
      }
    } catch (err) {
      logger.error('Failed to fetch data:', err);
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
