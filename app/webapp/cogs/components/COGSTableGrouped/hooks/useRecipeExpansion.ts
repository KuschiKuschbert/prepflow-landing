/**
 * Hook for managing recipe expansion state.
 */

import { useState, useEffect } from 'react';
import type { RecipeGroup } from '@/lib/types/cogs';

export function useRecipeExpansion(recipeGroups: RecipeGroup[]) {
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());

  const toggleRecipe = (recipeId: string) => {
    setExpandedRecipes(prev => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  };

  // Expand all recipes by default
  useEffect(() => {
    if (recipeGroups.length > 0 && expandedRecipes.size === 0) {
      setExpandedRecipes(new Set(recipeGroups.map(g => g.recipeId)));
    }
  }, [recipeGroups, expandedRecipes.size]);

  return { expandedRecipes, toggleRecipe };
}
