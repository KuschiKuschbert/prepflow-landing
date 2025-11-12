'use client';

import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { COGSCalculation, Recipe } from '../types';
import { useRecipeIngredientsAutosave } from './useRecipeIngredientsAutosave';
import { useRecipeExistence } from './useRecipeExistence';

interface UseCOGSAutosaveProps {
  selectedRecipe: string;
  selectedRecipeData: Recipe | undefined;
  dishPortions: number;
  calculations: COGSCalculation[];
  onError: (error: string) => void;
}

export function useCOGSAutosave({
  selectedRecipe,
  selectedRecipeData,
  dishPortions,
  calculations,
  onError,
}: UseCOGSAutosaveProps) {
  // Check if recipe exists in database before enabling autosave
  const { exists: recipeExists } = useRecipeExistence(selectedRecipe);

  const recipeMetadata = selectedRecipeData
    ? {
        yield: dishPortions,
        yield_unit: selectedRecipeData.yield_unit || 'servings',
      }
    : null;

  const recipeMetadataAutosaveId = selectedRecipe
    ? deriveAutosaveId('recipes', selectedRecipe, [selectedRecipeData?.name || ''])
    : null;

  const { status: recipeMetadataStatus } = useAutosave({
    entityType: 'recipes',
    entityId: recipeMetadataAutosaveId || null,
    data: recipeMetadata,
    enabled: Boolean(selectedRecipe && recipeMetadata && recipeExists),
  });

  const {
    status: ingredientsAutosaveStatus,
    error: ingredientsAutosaveError,
    saveNow: saveIngredientsNow,
  } = useRecipeIngredientsAutosave({
    recipeId: selectedRecipe,
    calculations,
    enabled: Boolean(selectedRecipe && calculations.length > 0 && recipeExists),
    onError,
  });

  const autosaveStatus =
    ingredientsAutosaveStatus !== 'idle' ? ingredientsAutosaveStatus : recipeMetadataStatus;

  return {
    autosaveStatus,
    ingredientsAutosaveError,
    saveNow: saveIngredientsNow,
  };
}
