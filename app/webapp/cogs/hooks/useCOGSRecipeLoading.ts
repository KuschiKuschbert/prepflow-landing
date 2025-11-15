import { useEffect, RefObject } from 'react';

interface Recipe {
  id: string;
  name: string;
  yield?: number;
}

interface UseCOGSRecipeLoadingProps {
  selectedRecipe: string | null;
  recipes: Recipe[];
  hasManualIngredientsRef: RefObject<boolean> | undefined;
  lastManualChangeTimeRef: RefObject<number> | undefined;
  hasManualPortionsRef: RefObject<boolean>;
  lastPortionChangeTimeRef: RefObject<number>;
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
      console.log('[CogsClient] Skipping loadExistingRecipeIngredients - manual changes exist');
      return;
    }
    const timeSinceLastChange = Date.now() - (lastManualChangeTimeRef?.current || 0);
    if (timeSinceLastChange < 10000) {
      console.log('[CogsClient] Skipping loadExistingRecipeIngredients - recent change detected');
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
