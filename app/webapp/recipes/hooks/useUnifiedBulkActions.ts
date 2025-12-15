'use client';
import { useCallback, useState } from 'react';
import { Recipe, Dish } from '../types';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { performBulkDelete as performBulkDeleteHelper } from './useUnifiedBulkActions/helpers/performBulkDelete';

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
  const selectedRecipeIds = Array.from(selectedItems).filter(id => selectedItemTypes.get(id) === 'recipe');
  const selectedDishIds = Array.from(selectedItems).filter(id => selectedItemTypes.get(id) === 'dish');

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
      await performBulkDeleteHelper(selectedRecipeIds, selectedDishIds, showSuccess, showError);
      onClearSelection();
    } catch (err) {
      if (selectedRecipeIds.length > 0) rollbackRecipes();
      if (selectedDishIds.length > 0) rollbackDishes();
      logger.error('Bulk delete failed:', err);
      showError('Failed to delete items. Please check your connection and try again.');
    } finally {
      setBulkActionLoading(false);
    }
  }, [
    selectedItems.size,
    selectedRecipeIds,
    selectedDishIds,
    recipes,
    dishes,
    optimisticallyUpdateRecipes,
    optimisticallyUpdateDishes,
    rollbackRecipes,
    rollbackDishes,
    onClearSelection,
    showSuccess,
    showError,
  ]);
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
