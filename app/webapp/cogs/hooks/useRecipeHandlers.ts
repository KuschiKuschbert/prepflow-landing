'use client';

import { useCallback } from 'react';
import type { Recipe } from '../types';
import { useRecipeSelectHandler } from './useRecipeHandlers/useRecipeSelect';
import { useRecipeCreateHandler } from './useRecipeHandlers/useRecipeCreate';
import { useRecipeFinishHandler } from './useRecipeHandlers/useRecipeFinish';

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

export function useRecipeHandlers(props: UseRecipeHandlersProps) {
  const handleRecipeSelect = useRecipeSelectHandler(
    props.recipes,
    props.setSelectedRecipe,
    props.setDishPortions,
  );

  const handleCreateNewRecipe = useCallback(() => {
    props.setShowCreateModal(true);
  }, [props.setShowCreateModal]);

  const handleCreateRecipe = useRecipeCreateHandler(props);
  const handleFinishRecipe = useRecipeFinishHandler(props);

  return {
    handleRecipeSelect,
    handleCreateNewRecipe,
    handleCreateRecipe,
    handleFinishRecipe,
  };
}
