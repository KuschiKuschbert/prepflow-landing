'use client';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useOnRecipeCreated } from '@/lib/personality/hooks';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { useRecipeBulkOperations } from './useRecipeBulkOperations';
import { useRecipeDeleteOperations } from './useRecipeDeleteOperations';
import { useRecipeShareOperations } from './useRecipeShareOperations';
import { handleAddRecipe as handleAddRecipeHelper } from './useRecipeActions/helpers/handleAddRecipe';
import { handleEditFromPreview as handleEditFromPreviewHelper } from './useRecipeActions/helpers/handleEditFromPreview';
import { handleDuplicateRecipe as handleDuplicateRecipeHelper } from './useRecipeActions/helpers/handleDuplicateRecipe';
interface UseRecipeActionsProps {
  recipes: Recipe[];
  fetchRecipes: () => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  setError: (error: string) => void;
  capitalizeRecipeName: (name: string) => string;
  optimisticallyUpdateRecipes: (updater: (recipes: Recipe[]) => Recipe[]) => void;
  rollbackRecipes: () => void;
}
export function useRecipeActions({
  recipes,
  fetchRecipes,
  fetchRecipeIngredients,
  setError,
  capitalizeRecipeName,
  optimisticallyUpdateRecipes,
  rollbackRecipes,
}: UseRecipeActionsProps) {
  const router = useRouter();
  const { showError: showErrorNotification, showSuccess } = useNotification();
  const onRecipeCreated = useOnRecipeCreated();
  const bulkOps = useRecipeBulkOperations(
    recipes,
    fetchRecipes,
    capitalizeRecipeName,
    optimisticallyUpdateRecipes,
    rollbackRecipes,
  );
  const deleteOps = useRecipeDeleteOperations(
    fetchRecipes,
    capitalizeRecipeName,
    optimisticallyUpdateRecipes,
    rollbackRecipes,
  );
  const shareOps = useRecipeShareOperations();
  const handleAddRecipe = useCallback(
    async (newRecipe: Partial<Recipe>) => {
      try {
        return await handleAddRecipeHelper(
          newRecipe,
          fetchRecipes,
          onRecipeCreated,
          showErrorNotification,
        );
      } catch {
        showErrorNotification('Failed to add recipe');
        return false;
      }
    },
    [fetchRecipes, showErrorNotification, onRecipeCreated],
  );
  const handleEditFromPreview = useCallback(
    async (selectedRecipe: Recipe, recipeIngredients: any[]) => {
      try {
        handleEditFromPreviewHelper(
          selectedRecipe,
          recipeIngredients,
          router,
          showErrorNotification,
        );
      } catch (err) {
        logger.error('❌ Error in handleEditFromPreview:', err);
        showErrorNotification('Failed to load recipe for editing');
      }
    },
    [router, showErrorNotification],
  );
  const handleDuplicateRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        return await handleDuplicateRecipeHelper(
          recipe,
          fetchRecipeIngredients,
          fetchRecipes,
          showErrorNotification,
          showSuccess,
        );
      } catch (err) {
        logger.error('Error duplicating recipe:', err);
        showErrorNotification('Failed to duplicate recipe');
        return null;
      }
    },
    [fetchRecipes, fetchRecipeIngredients, showErrorNotification, showSuccess],
  );
  return {
    ...deleteOps,
    ...bulkOps,
    ...shareOps,
    handleAddRecipe,
    handleEditFromPreview,
    handleDuplicateRecipe,
  };
}
