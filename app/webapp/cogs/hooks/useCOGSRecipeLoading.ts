import { useEffect, RefObject } from 'react';
import { logger } from '@/lib/logger';
import { Recipe } from '../types';

interface UseCOGSRecipeLoadingProps {
  selectedRecipe: string | null;
  recipes: Recipe[];
  hasManualIngredientsRef: RefObject<boolean | null> | undefined;
  lastManualChangeTimeRef: RefObject<number | null> | undefined;
  hasManualPortionsRef: RefObject<boolean | null>;
  lastPortionChangeTimeRef: RefObject<number | null>;
  loadExistingRecipeIngredients: (recipeId: string) => void;
  handleDishPortionsFromRecipe: (portions: number) => void;
}

export function useCOGSRecipeLoading({
  selectedRecipe,
  recipes,
  hasManualIngredientsRef,
  lastManualChangeTimeRef,
  hasManualPortionsRef,
  lastPortionChangeTimeRef,
  loadExistingRecipeIngredients,
  handleDishPortionsFromRecipe,
}: UseCOGSRecipeLoadingProps) {
  useEffect(() => {
    // Only run when selectedRecipe ID changes, not when selectedRecipeData object reference changes
    if (!selectedRecipe) return;

    // Derive selectedRecipeData inside effect to avoid dependency on object reference
    const recipeData = recipes.find(r => r.id === selectedRecipe);
    if (!recipeData) return;

    if (hasManualIngredientsRef?.current) {
      logger.dev('[CogsClient] Skipping loadExistingRecipeIngredients - manual changes exist');
      return;
    }
    const timeSinceLastChange = Date.now() - (lastManualChangeTimeRef?.current || 0);
    if (timeSinceLastChange < 10000) {
      logger.dev('[CogsClient] Skipping loadExistingRecipeIngredients - recent change detected');
      return;
    }
    // Only reset portions if they haven't been manually changed
    if (!hasManualPortionsRef.current) {
      const timeSincePortionChange = Date.now() - (lastPortionChangeTimeRef.current || 0);
      if (timeSincePortionChange > 10000) {
        handleDishPortionsFromRecipe(recipeData.yield || 1);
      }
    }
    loadExistingRecipeIngredients(selectedRecipe);
  }, [
    selectedRecipe,
    recipes,
    loadExistingRecipeIngredients,
    hasManualIngredientsRef,
    lastManualChangeTimeRef,
    hasManualPortionsRef,
    lastPortionChangeTimeRef,
    handleDishPortionsFromRecipe,
  ]);
}
