'use client';

import { useCallback } from 'react';
import { Recipe } from '../types';

interface UseRecipeHandlersProps {
  recipes: Recipe[];
  selectedRecipe: string;
  dishPortions: number;
  calculations: import('../types').COGSCalculation[];
  setSelectedRecipe: (id: string) => void;
  setDishPortions: (portions: number) => void;
  setShowCreateModal: (show: boolean) => void;
  createOrUpdateRecipe: (
    name: string,
    portions: number,
  ) => Promise<{ recipe: Recipe; isNew: boolean } | null>;
  fetchData: () => Promise<void>;
  setSuccessMessage: (msg: string | null) => void;
  saveNow?: () => Promise<void>;
  setSaveError?: (error: string) => void;
}

export function useRecipeHandlers({
  recipes,
  selectedRecipe,
  dishPortions,
  calculations,
  setSelectedRecipe,
  setDishPortions,
  setShowCreateModal,
  createOrUpdateRecipe,
  fetchData,
  setSuccessMessage,
  saveNow,
  setSaveError,
}: UseRecipeHandlersProps) {
  const handleRecipeSelect = useCallback(
    (recipeId: string) => {
      setSelectedRecipe(recipeId);
      if (recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) setDishPortions(recipe.yield || 1);
      }
    },
    [recipes, setSelectedRecipe, setDishPortions],
  );

  const handleCreateNewRecipe = useCallback(() => {
    setShowCreateModal(true);
  }, [setShowCreateModal]);

  const handleCreateRecipe = useCallback(
    async (name: string) => {
      const result = await createOrUpdateRecipe(name, dishPortions);
      if (result) {
        await fetchData();
        if (result.recipe) {
          setSelectedRecipe(result.recipe.id);
          setDishPortions(result.recipe.yield || 1);
          setSuccessMessage(`Recipe "${result.recipe.recipe_name}" created successfully!`);
          setTimeout(() => setSuccessMessage(null), 3000);
        }
        return result.recipe;
      }
      return null;
    },
    [
      dishPortions,
      createOrUpdateRecipe,
      fetchData,
      setSelectedRecipe,
      setDishPortions,
      setSuccessMessage,
    ],
  );

  const handleFinishRecipe = useCallback(async () => {
    const selectedRecipeData = recipes.find(r => r.id === selectedRecipe);
    if (!selectedRecipeData || calculations.length === 0) return;
    try {
      if (saveNow) await saveNow();
      setSuccessMessage(`Recipe "${selectedRecipeData.recipe_name}" is complete! 🎉`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = 'Failed to save recipe. Please try again.';
      if (setSaveError) setSaveError(errorMsg);
      setSuccessMessage(errorMsg);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  }, [recipes, selectedRecipe, calculations, saveNow, setSuccessMessage, setSaveError]);

  return {
    handleRecipeSelect,
    handleCreateNewRecipe,
    handleCreateRecipe,
    handleFinishRecipe,
  };
}
