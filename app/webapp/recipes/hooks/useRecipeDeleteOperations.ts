'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { useCallback, useState } from 'react';
import { Recipe } from '../types';

import { logger } from '@/lib/logger';
export function useRecipeDeleteOperations(
  fetchRecipes: () => Promise<void>,
  capitalizeRecipeName: (name: string) => string,
  optimisticallyUpdateRecipes: (updater: (recipes: Recipe[]) => Recipe[]) => void,
  rollbackRecipes: () => void,
) {
  const { showSuccess, showError: showErrorNotification } = useNotification();
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteRecipe = useCallback((recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDeleteRecipe = useCallback(async () => {
    if (!recipeToDelete) return;

    const recipeIdToDelete = recipeToDelete.id;
    const recipeName = capitalizeRecipeName(recipeToDelete.name);

    try {
      // Optimistically remove recipe from list
      optimisticallyUpdateRecipes(prev => prev.filter(r => r.id !== recipeIdToDelete));

      // Call API endpoint for deletion
      logger.dev('[RecipeDelete] Attempting to delete recipe:', recipeIdToDelete);
      const response = await fetch(`/api/recipes/${recipeIdToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      logger.dev('[RecipeDelete] API response:', { status: response.status, result });

      if (!response.ok) {
        rollbackRecipes();
        const errorMessage = result.message || result.error || 'Failed to delete recipe';
        logger.error('[RecipeDelete] Deletion failed:', errorMessage, result);
        showErrorNotification(errorMessage);
        return;
      }

      // Success - optimistic update already applied, no need to refetch
      showSuccess(`Recipe "${recipeName}" deleted successfully!`);
      setShowDeleteConfirm(false);
      setRecipeToDelete(null);
    } catch (err) {
      rollbackRecipes();
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete recipe';
      showErrorNotification(errorMessage);
    }
  }, [
    recipeToDelete,
    capitalizeRecipeName,
    showSuccess,
    showErrorNotification,
    optimisticallyUpdateRecipes,
    rollbackRecipes,
  ]);

  const cancelDeleteRecipe = useCallback(() => {
    setShowDeleteConfirm(false);
    setRecipeToDelete(null);
  }, []);

  return {
    recipeToDelete,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDeleteRecipe,
    confirmDeleteRecipe,
    cancelDeleteRecipe,
  };
}
