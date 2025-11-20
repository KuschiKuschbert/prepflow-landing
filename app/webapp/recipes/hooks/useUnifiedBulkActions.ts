'use client';
import { useCallback, useState } from 'react';
import { Recipe, Dish } from '../types';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

interface UseUnifiedBulkActionsProps {
  recipes: Recipe[];
  dishes: Dish[];
  selectedItems: Set<string>;
  selectedItemTypes: Map<string, 'recipe' | 'dish'>;
  optimisticallyUpdateRecipes: (updater: (recipes: Recipe[]) => Recipe[]) => void;
  optimisticallyUpdateDishes: (updater: (dishes: Dish[]) => Dish[]) => void;
  rollbackRecipes: () => void;
  rollbackDishes: () => void;
  onClearSelection: () => void;
}

export function useUnifiedBulkActions({
  recipes,
  dishes,
  selectedItems,
  selectedItemTypes,
  optimisticallyUpdateRecipes,
  optimisticallyUpdateDishes,
  rollbackRecipes,
  rollbackDishes,
  onClearSelection,
}: UseUnifiedBulkActionsProps) {
  const { showSuccess, showError } = useNotification();
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const selectedRecipeIds = Array.from(selectedItems).filter(
    id => selectedItemTypes.get(id) === 'recipe',
  );
  const selectedDishIds = Array.from(selectedItems).filter(
    id => selectedItemTypes.get(id) === 'dish',
  );

  const handleBulkDelete = useCallback(() => {
    if (selectedItems.size === 0) return;
    setShowBulkDeleteConfirm(true);
  }, [selectedItems.size]);

  const confirmBulkDelete = useCallback(async () => {
    if (selectedItems.size === 0) return;
    const originalRecipes = [...recipes];
    const originalDishes = [...dishes];
    if (selectedRecipeIds.length > 0) {
      optimisticallyUpdateRecipes(prev => prev.filter(r => !selectedRecipeIds.includes(r.id)));
    }
    if (selectedDishIds.length > 0) {
      optimisticallyUpdateDishes(prev => prev.filter(d => !selectedDishIds.includes(d.id)));
    }

    setBulkActionLoading(true);
    setShowBulkDeleteConfirm(false);
    try {
      const deletePromises: Promise<Response>[] = [];
      if (selectedRecipeIds.length > 0) {
        deletePromises.push(
          fetch('/api/recipes/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipeIds: selectedRecipeIds }),
          }),
        );
      }
      if (selectedDishIds.length > 0) {
        deletePromises.push(
          fetch('/api/dishes/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dishIds: selectedDishIds }),
          }),
        );
      }

      const responses = await Promise.all(deletePromises);
      const results = await Promise.all(responses.map(r => r.json()));
      const errors: string[] = [];
      for (let i = 0; i < responses.length; i++) {
        if (!responses[i].ok) {
          errors.push(results[i].message || results[i].error || 'Deletion failed');
        }
      }

      if (errors.length > 0) {
        if (selectedRecipeIds.length > 0) rollbackRecipes();
        if (selectedDishIds.length > 0) rollbackDishes();
        showError(errors.join('; '));
        return;
      }
      const recipeCount = selectedRecipeIds.length;
      const dishCount = selectedDishIds.length;
      const message = recipeCount > 0 && dishCount > 0
        ? `${recipeCount} recipe${recipeCount > 1 ? 's' : ''} and ${dishCount} dish${dishCount > 1 ? 'es' : ''} deleted successfully!`
        : recipeCount > 0
          ? `${recipeCount} recipe${recipeCount > 1 ? 's' : ''} deleted successfully!`
          : `${dishCount} dish${dishCount > 1 ? 'es' : ''} deleted successfully!`;
      showSuccess(message);
      onClearSelection();
    } catch (err) {
      if (selectedRecipeIds.length > 0) rollbackRecipes();
      if (selectedDishIds.length > 0) rollbackDishes();
      logger.error('Bulk delete failed:', err);
      showError('Failed to delete items. Please check your connection and try again.');
    } finally {
      setBulkActionLoading(false);
    }
  }, [selectedItems.size, selectedRecipeIds, selectedDishIds, recipes, dishes, optimisticallyUpdateRecipes, optimisticallyUpdateDishes, rollbackRecipes, rollbackDishes, onClearSelection, showSuccess, showError]);
  const cancelBulkDelete = useCallback(() => {
    setShowBulkDeleteConfirm(false);
  }, []);

  return {
    bulkActionLoading,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
    selectedRecipeIds,
    selectedDishIds,
  };
}
