import { useMemo, useState } from 'react';
import type { Dish, Recipe } from '@/app/webapp/recipes/types';
import { useUnifiedBulkActions } from '../../../hooks/useUnifiedBulkActions';
import { useBulkShare } from '../../../hooks/useBulkShare';
import { useBulkAddToMenu } from '../../../hooks/useBulkAddToMenu';
import { useDishesOptimisticUpdates } from '../../hooks/useDishesOptimisticUpdates';

interface UseDishesClientBulkActionsProps {
  dishes: Dish[];
  recipes: Recipe[];
  selectedItems: Set<string>;
  selectedItemTypes: Map<string, 'recipe' | 'dish'>;
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  onClearSelection: () => void;
}

/**
 * Hook for managing bulk actions in DishesClient
 */
export function useDishesClientBulkActions({
  dishes,
  recipes,
  selectedItems,
  selectedItemTypes,
  setDishes,
  setRecipes,
  onClearSelection,
}: UseDishesClientBulkActionsProps) {
  const {
    optimisticallyUpdateDishes,
    optimisticallyUpdateRecipes,
    rollbackDishes,
    rollbackRecipes,
  } = useDishesOptimisticUpdates({ dishes, recipes, selectedItems, setDishes, setRecipes });

  const selectedRecipeIds = useMemo(() => {
    return Array.from(selectedItems).filter(id => selectedItemTypes.get(id) === 'recipe');
  }, [selectedItems, selectedItemTypes]);

  const selectedDishIds = useMemo(() => {
    return Array.from(selectedItems).filter(id => selectedItemTypes.get(id) === 'dish');
  }, [selectedItems, selectedItemTypes]);

  const {
    bulkActionLoading,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
  } = useUnifiedBulkActions({
    recipes,
    dishes,
    selectedItems,
    selectedItemTypes,
    optimisticallyUpdateRecipes,
    optimisticallyUpdateDishes,
    rollbackRecipes,
    rollbackDishes,
    onClearSelection,
  });

  const { handleBulkShare, shareLoading: bulkShareLoading } = useBulkShare({
    selectedRecipeIds,
    onSuccess: onClearSelection,
  });

  const {
    handleBulkAddToMenu,
    handleSelectMenu,
    handleCreateNewMenu,
    menus,
    loadingMenus,
    addLoading: addToMenuLoading,
    showMenuDialog,
    setShowMenuDialog,
  } = useBulkAddToMenu({
    selectedItems,
    selectedItemTypes,
    onSuccess: onClearSelection,
  });

  const [showBulkMenu, setShowBulkMenu] = useState(false);

  return {
    bulkActionLoading,
    bulkShareLoading,
    addToMenuLoading,
    showBulkMenu,
    setShowBulkMenu,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
    handleBulkShare,
    handleBulkAddToMenu,
    handleSelectMenu,
    handleCreateNewMenu,
    menus,
    loadingMenus,
    showMenuDialog,
    setShowMenuDialog,
    selectedRecipeIds,
    selectedDishIds,
  };
}
