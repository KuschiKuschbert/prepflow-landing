/**
 * Hook for recipe selection handler
 */

import { useCallback } from 'react';
import type { Recipe } from '../../types';

/**
 * Hook for recipe selection handler
 *
 * @param {Recipe[]} recipes - Available recipes
 * @param {Function} setSelectedRecipe - Set selected recipe ID
 * @param {Function} setDishPortions - Set dish portions
 * @returns {Function} Recipe selection handler
 */
export function useRecipeSelectHandler(
  recipes: Recipe[],
  setSelectedRecipe: (id: string) => void,
  setDishPortions: (portions: number) => void,
) {
  return useCallback(
    (recipeId: string) => {
      setSelectedRecipe(recipeId);
      if (recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) setDishPortions(recipe.yield || 1);
      }
    },
    [recipes, setSelectedRecipe, setDishPortions],
  );
}
