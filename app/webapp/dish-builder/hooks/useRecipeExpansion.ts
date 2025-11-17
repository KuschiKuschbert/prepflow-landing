'use client';

import { useCallback } from 'react';
import { ExpandedRecipeIngredient } from '../types';
import { Ingredient } from '../../cogs/types';

import { logger } from '../../lib/logger';
interface UseRecipeExpansionProps {
  ingredients: Ingredient[];
  onIngredientsExpanded: (ingredients: ExpandedRecipeIngredient[]) => void;
  setError: (error: string) => void;
}

export function useRecipeExpansion({
  ingredients,
  onIngredientsExpanded,
  setError,
}: UseRecipeExpansionProps) {
  const expandRecipe = useCallback(
    async (recipeId: string) => {
      try {
        const response = await fetch(`/api/recipes/${recipeId}/ingredients`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Failed to fetch recipe ingredients');
        }

        const result = await response.json();
        const recipeIngredients = result.items || [];

        if (recipeIngredients.length === 0) {
          setError('Recipe has no ingredients');
          return;
        }

        // Expand recipe ingredients to individual dish ingredients
        // Map recipe ingredients to expanded format
        const expandedIngredients: ExpandedRecipeIngredient[] = recipeIngredients.map((ri: any) => {
          // Find the ingredient data to get the name
          const ingredientData = ingredients.find(ing => ing.id === ri.ingredient_id);
          return {
            ingredient_id: ri.ingredient_id,
            ingredient_name: ingredientData?.ingredient_name || ri.ingredient_name || 'Unknown',
            quantity: ri.quantity,
            unit: ri.unit,
          };
        });

        onIngredientsExpanded(expandedIngredients);
      } catch (err) {
        logger.error('Failed to expand recipe:', err);
        setError(err instanceof Error ? err.message : 'Failed to expand recipe');
      }
    },
    [ingredients, onIngredientsExpanded, setError],
  );

  return { expandRecipe };
}
