'use client';

import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { COGSCalculation, Recipe } from '@/lib/types/cogs';
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
  const { exists: recipeExists, loading: recipeExistsLoading } = useRecipeExistence(selectedRecipe);

  const recipeMetadata = selectedRecipeData
    ? {
        yield: dishPortions,
        yield_unit: selectedRecipeData.yield_unit || 'servings',
      }
    : null;

  const recipeMetadataAutosaveId = selectedRecipe
    ? deriveAutosaveId('recipes', selectedRecipe, [selectedRecipeData?.recipe_name || ''])
    : null;

  const { status: recipeMetadataStatus } = useAutosave({
    entityType: 'recipes',
    entityId: recipeMetadataAutosaveId || null,
    data: recipeMetadata,
    enabled: Boolean(selectedRecipe && recipeMetadata && recipeExists),
  });

  // Enable autosave optimistically when loading (recipeExists might be false initially)
  // or when recipe exists. This prevents losing changes while checking recipe existence.
  const ingredientsAutosaveEnabled =
    Boolean(selectedRecipe && calculations.length > 0) && (recipeExists || recipeExistsLoading);

  const {
    status: ingredientsAutosaveStatus,
    error: ingredientsAutosaveError,
    saveNow: saveIngredientsNow,
  } = useRecipeIngredientsAutosave({
    recipeId: selectedRecipe,
    calculations,
    enabled: ingredientsAutosaveEnabled,
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
