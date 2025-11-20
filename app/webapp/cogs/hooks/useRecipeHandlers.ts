'use client';

import { useCallback } from 'react';
import { Recipe } from '../types';
import { useNotification } from '@/contexts/NotificationContext';

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
  saveNow,
  setSaveError,
}: UseRecipeHandlersProps) {
  const { showSuccess, showError } = useNotification();
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
          showSuccess(`Recipe "${result.recipe.recipe_name}" created successfully!`);
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
      showSuccess,
    ],
  );

  const handleFinishRecipe = useCallback(async () => {
    const selectedRecipeData = recipes.find(r => r.id === selectedRecipe);
    if (!selectedRecipeData || calculations.length === 0) return;
    try {
      if (saveNow) await saveNow();
      showSuccess(`Recipe "${selectedRecipeData.recipe_name}" is complete! 🎉`);
    } catch (err) {
      const errorMsg = 'Failed to save recipe. Please try again.';
      if (setSaveError) setSaveError(errorMsg);
      showError(errorMsg);
    }
  }, [recipes, selectedRecipe, calculations, saveNow, showSuccess, showError, setSaveError]);

  return {
    handleRecipeSelect,
    handleCreateNewRecipe,
    handleCreateRecipe,
    handleFinishRecipe,
  };
}
