'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Recipe } from '../types';
import { useNotification } from '@/contexts/NotificationContext';

export function useRecipeDeleteOperations(
  fetchRecipes: () => Promise<void>,
  capitalizeRecipeName: (name: string) => string,
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

    try {
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeToDelete.id);

      if (ingredientsError) {
        showErrorNotification(ingredientsError.message);
        return;
      }

      const { error: recipeError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeToDelete.id);

      if (recipeError) {
        showErrorNotification(recipeError.message);
        return;
      }

      await fetchRecipes();
      showSuccess(`Recipe "${capitalizeRecipeName(recipeToDelete.name)}" deleted successfully!`);
      setShowDeleteConfirm(false);
      setRecipeToDelete(null);
    } catch (err) {
      showErrorNotification('Failed to delete recipe');
    }
  }, [recipeToDelete, fetchRecipes, capitalizeRecipeName, showSuccess, showErrorNotification]);

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
