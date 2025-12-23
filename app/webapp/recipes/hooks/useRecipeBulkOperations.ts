'use client';

import { useCallback, useState } from 'react';
import { Recipe } from '../types';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

export function useRecipeBulkOperations(
  recipes: Recipe[],
  fetchRecipes: () => Promise<void>,
  capitalizeRecipeName: (name: string) => string,
  optimisticallyUpdateRecipes: (updater: (recipes: Recipe[]) => Recipe[]) => void,
  rollbackRecipes: () => void,
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

    const selectedRecipeIds = Array.from(selectedRecipes);
    const count = selectedRecipes.size;

    try {
      optimisticallyUpdateRecipes(prev => prev.filter(r => !selectedRecipeIds.includes(r.id)));
      const response = await fetch('/api/recipes/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeIds: selectedRecipeIds }),
      });

      const result = await response.json();

      if (!response.ok) {
        rollbackRecipes();
        const errorMessage = result.message || result.error || 'Failed to delete recipes';
        showErrorNotification(errorMessage);
        return;
      }
      // Success - optimistic update already applied, no need to refetch
      showSuccess(`${count} recipe${count > 1 ? 's' : ''} deleted successfully!`);
      setSelectedRecipes(new Set());
      setShowBulkDeleteConfirm(false);
    } catch (err) {
      logger.error('[useRecipeBulkOperations.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

      rollbackRecipes();
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete recipes';
      showErrorNotification(errorMessage);
    }
  }, [
    selectedRecipes,
    showSuccess,
    showErrorNotification,
    optimisticallyUpdateRecipes,
    rollbackRecipes,
  ]);

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
