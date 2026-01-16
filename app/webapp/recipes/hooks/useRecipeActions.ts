'use client';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useOnRecipeCreated } from '@/lib/personality/hooks';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { createHandleAddRecipe } from './useRecipeActions/helpers/createHandleAddRecipe';
import { createHandleDuplicateRecipe } from './useRecipeActions/helpers/createHandleDuplicateRecipe';
import { handleEditFromPreview as handleEditFromPreviewHelper } from './useRecipeActions/helpers/handleEditFromPreview';
import { useRecipeBulkOperations } from './useRecipeBulkOperations';
import { useRecipeDeleteOperations } from './useRecipeDeleteOperations';
import { useRecipeShareOperations } from './useRecipeShareOperations';
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
    recipes,
    capitalizeRecipeName,
    optimisticallyUpdateRecipes,
  );
  const shareOps = useRecipeShareOperations();
  const handleAddRecipe = useCallback(
    async (newRecipe: Partial<Recipe>) => {
      const handler = createHandleAddRecipe(
        recipes,
        optimisticallyUpdateRecipes,
        onRecipeCreated,
        showErrorNotification,
        showSuccess,
      );
      return handler(newRecipe);
    },
    [recipes, optimisticallyUpdateRecipes, onRecipeCreated, showErrorNotification, showSuccess],
  );
  const handleEditFromPreview = useCallback(
    async (selectedRecipe: Recipe, recipeIngredients: RecipeIngredientWithDetails[]) => {
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
      const handler = createHandleDuplicateRecipe(
        recipes,
        fetchRecipeIngredients,
        optimisticallyUpdateRecipes,
        showErrorNotification,
        showSuccess,
      );
      return handler(recipe);
    },
    [
      recipes,
      fetchRecipeIngredients,
      optimisticallyUpdateRecipes,
      showErrorNotification,
      showSuccess,
    ],
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
