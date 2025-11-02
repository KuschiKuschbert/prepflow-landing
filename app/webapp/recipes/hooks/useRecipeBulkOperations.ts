'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Recipe } from '../types';
import { useNotification } from '@/contexts/NotificationContext';

export function useRecipeBulkOperations(
  recipes: Recipe[],
  fetchRecipes: () => Promise<void>,
  capitalizeRecipeName: (name: string) => string,
) {
  const { showSuccess, showError: showErrorNotification } = useNotification();
  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const handleSelectRecipe = useCallback((recipeId: string) => {
    setSelectedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRecipes.size === recipes.length) {
      setSelectedRecipes(new Set());
    } else {
      setSelectedRecipes(new Set(recipes.map(r => r.id)));
    }
  }, [selectedRecipes.size, recipes]);

  const handleBulkDelete = useCallback(() => {
    if (selectedRecipes.size === 0) return;
    setShowBulkDeleteConfirm(true);
  }, [selectedRecipes.size]);

  const confirmBulkDelete = useCallback(async () => {
    if (selectedRecipes.size === 0) return;

    try {
      const selectedRecipeIds = Array.from(selectedRecipes);

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .in('recipe_id', selectedRecipeIds);

      if (ingredientsError) {
        showErrorNotification(ingredientsError.message);
        return;
      }

      const { error: recipesError } = await supabase
        .from('recipes')
        .delete()
        .in('id', selectedRecipeIds);

      if (recipesError) {
        showErrorNotification(recipesError.message);
        return;
      }

      await fetchRecipes();
      showSuccess(
        `${selectedRecipes.size} recipe${selectedRecipes.size > 1 ? 's' : ''} deleted successfully!`,
      );
      setSelectedRecipes(new Set());
      setShowBulkDeleteConfirm(false);
    } catch (err) {
      showErrorNotification('Failed to delete recipes');
    }
  }, [selectedRecipes, fetchRecipes, showSuccess, showErrorNotification]);

  const cancelBulkDelete = useCallback(() => {
    setShowBulkDeleteConfirm(false);
  }, []);

  return {
    selectedRecipes,
    setSelectedRecipes,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    handleSelectRecipe,
    handleSelectAll,
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
  };
}
