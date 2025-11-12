'use client';

import { useCallback } from 'react';
import { Recipe } from '../types';

interface UseRecipeHandlersProps {
  recipes: Recipe[];
  selectedRecipe: string;
  dishPortions: number;
  setSelectedRecipe: (id: string) => void;
  setDishPortions: (portions: number) => void;
  setShowCreateModal: (show: boolean) => void;
  createOrUpdateRecipe: (
    name: string,
    portions: number,
  ) => Promise<{ recipe: Recipe; isNew: boolean } | null>;
  fetchData: () => Promise<void>;
  setSuccessMessage: (msg: string | null) => void;
}

export function useRecipeHandlers({
  recipes,
  selectedRecipe,
  dishPortions,
  setSelectedRecipe,
  setDishPortions,
  setShowCreateModal,
  createOrUpdateRecipe,
  fetchData,
  setSuccessMessage,
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
          setSuccessMessage(`Recipe "${result.recipe.name}" created successfully!`);
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

  const handleFinishRecipe = useCallback(() => {
    const selectedRecipeData = recipes.find(r => r.id === selectedRecipe);
    if (selectedRecipeData) {
      setSuccessMessage(`Recipe "${selectedRecipeData.name}" is complete! 🎉`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  }, [recipes, selectedRecipe, setSuccessMessage]);

  return {
    handleRecipeSelect,
    handleCreateNewRecipe,
    handleCreateRecipe,
    handleFinishRecipe,
  };
}
