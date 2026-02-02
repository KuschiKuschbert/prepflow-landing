/**
 * Hook for expanding recipes (loading all ingredients from a recipe).
 */

import { useState } from 'react';
import { logger } from '@/lib/logger';
import type { Recipe } from '@/lib/types/cogs';
import type { Ingredient } from '@/lib/types/cogs';

interface UseRecipeExpansionProps {
  ingredients: Ingredient[];
  handleIngredientAdded: (ingredient: Ingredient, quantity: number, unit: string) => void;
  setError: (error: string) => void;
}

export function useRecipeExpansion({
  ingredients,
  handleIngredientAdded,
  setError,
}: UseRecipeExpansionProps) {
  const [expandingRecipe, setExpandingRecipe] = useState<Recipe | null>(null);

  const handleRecipeTap = async (recipe: Recipe) => {
    try {
      setExpandingRecipe(recipe);
      const response = await fetch(`/api/recipes/${recipe.id}/ingredients`, {
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
        setExpandingRecipe(null);
        return;
      }

      // Add all ingredients from recipe using single serve quantities
      // Divide recipe ingredient quantities by recipe yield to get per-serving amounts
      const recipeYield = recipe.yield || 1; // Default to 1 if yield is missing

      for (const ri of recipeIngredients) {
        const ingredientData = ingredients.find(ing => ing.id === ri.ingredient_id);
        if (ingredientData) {
          // Calculate single serve quantity
          const singleServeQuantity = ri.quantity / recipeYield;
          handleIngredientAdded(ingredientData, singleServeQuantity, ri.unit);
        }
      }

      setExpandingRecipe(null);
    } catch (err) {
      logger.error('Failed to expand recipe:', err);
      setError(err instanceof Error ? err.message : 'Failed to expand recipe');
      setExpandingRecipe(null);
    }
  };

  return { expandingRecipe, handleRecipeTap };
}
