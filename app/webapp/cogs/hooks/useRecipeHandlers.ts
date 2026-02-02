'use client';

import { useCallback } from 'react';
import type { Recipe } from '@/lib/types/cogs';
import { useRecipeSelectHandler } from './useRecipeHandlers/useRecipeSelect';
import { useRecipeCreateHandler } from './useRecipeHandlers/useRecipeCreate';
import { useRecipeFinishHandler } from './useRecipeHandlers/useRecipeFinish';

interface UseRecipeHandlersProps {
  recipes: Recipe[];
  selectedRecipe: string;
  dishPortions: number;
  calculations: import('@/lib/types/recipes').COGSCalculation[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setSelectedRecipe: (id: string) => void;
  setDishPortions: (portions: number) => void;
  setShowCreateModal: (show: boolean) => void;
  createOrUpdateRecipe: (
    name: string,
    portions: number,
  ) => Promise<{ recipe: Recipe; isNew: boolean } | null>;
  saveNow?: () => Promise<void>;
  setSaveError?: (error: string) => void;
}

export function useRecipeHandlers(props: UseRecipeHandlersProps) {
  const { setShowCreateModal } = props;
  const handleRecipeSelect = useRecipeSelectHandler(
    props.recipes,
    props.setSelectedRecipe,
    props.setDishPortions,
  );

  const handleCreateNewRecipe = useCallback(() => {
    setShowCreateModal(true);
  }, [setShowCreateModal]);

  const handleCreateRecipe = useRecipeCreateHandler({
    dishPortions: props.dishPortions,
    recipes: props.recipes,
    createOrUpdateRecipe: props.createOrUpdateRecipe,
    setRecipes: props.setRecipes,
    setSelectedRecipe: props.setSelectedRecipe,
    setDishPortions: props.setDishPortions,
  });
  const handleFinishRecipe = useRecipeFinishHandler(props);

  return {
    handleRecipeSelect,
    handleCreateNewRecipe,
    handleCreateRecipe,
    handleFinishRecipe,
  };
}
