import { useSelectionMode } from '@/app/webapp/ingredients/hooks/useSelectionMode';
import { formatRecipeName } from '@/lib/text-utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useAIInstructions } from '../../hooks/useAIInstructions';
import { useRecipeIngredients } from '../../hooks/useRecipeIngredients';
import { useRecipePricing } from '../../hooks/useRecipePricing';
import { createRecipeImagesGeneratedHandler } from '../DishesClient/helpers/handleRecipeImagesGenerated';
import { useDishesClientBulkActions } from '../DishesClient/hooks/useDishesClientBulkActions';
import { useDishesClientData } from './useDishesClientData';
import { useDishesClientHandlers } from './useDishesClientHandlers';
import { useDishesClientPagination } from './useDishesClientPagination';
import { useDishesClientPreview } from './useDishesClientPreview';
import { useDishesClientRecipePricing } from './useDishesClientRecipePricing';
import { useDishesClientSelection } from './useDishesClientSelection';
import { useDishesClientViewMode } from './useDishesClientViewMode';
import { useDishesSidePanelsHandlers } from './useDishesSidePanelsHandlers';

export function useDishesClientController() {
  const { viewMode, setViewMode } = useDishesClientViewMode();
  const { recipePrices, updateVisibleRecipePrices } = useRecipePricing();
  const {
    dishes,
    recipes,
    loading,
    error,
    dishCosts,
    setDishes,
    setRecipes,
    setError,
    fetchItems,
  } = useDishesClientData();
  const { fetchRecipeIngredients, fetchBatchRecipeIngredients } = useRecipeIngredients(setError);

  const { generateAIInstructions } = useAIInstructions();
  const previewState = useDishesClientPreview({
    fetchRecipeIngredients,
    generateAIInstructions,
    setError,
  });

  const {
    selectedRecipeForPreview,
    setSelectedRecipeForPreview,
    recipeIngredients,
    setRecipeIngredients,
    showRecipePanel,
    setShowRecipePanel,
    previewYield,
    selectedDishForPreview,
    setSelectedDishForPreview,
    showDishPanel,
    setShowDishPanel,
    editingDish,
    setEditingDish,
    showDishEditDrawer,
    setShowDishEditDrawer,
    editingRecipe,
    setEditingRecipe,
    editingItem,
    setEditingItem,
    highlightingRowId,
    setHighlightingRowId,
    highlightingRowType,
    setHighlightingRowType,
    handlePreviewDish,
    handlePreviewRecipe,
  } = previewState;

  const {
    selectedItems,
    isSelectionMode,
    handleSelectItem,
    handleSelectAll,
    handleExitSelectionMode,
  } = useDishesClientSelection(dishes, recipes);

  const {
    allItems,
    paginatedItems,
    paginatedDishesList,
    paginatedRecipesList,
    filters,
    updateFilters,
  } = useDishesClientPagination({ dishes, recipes, dishCosts, recipePrices });

  const {
    showDeleteConfirm,
    itemToDelete,
    handleEditDish,
    handleEditRecipe,
    handleDeleteDish,
    handleDeleteRecipe,
    confirmDeleteItem,
    cancelDeleteItem,
  } = useDishesClientHandlers({
    dishes,
    recipes,
    viewMode,
    editingItem,
    setDishes,
    setRecipes,
    setViewMode,
    setEditingItem,
    setEditingRecipe,
    setShowRecipePanel,
    setSelectedRecipeForPreview,
    setHighlightingRowId,
    setHighlightingRowType,
    setError,
  });

  const { startLongPress, cancelLongPress, enterSelectionMode } = useSelectionMode();

  useEffect(() => {
    if (viewMode === 'list') {
      fetchItems();
      setEditingRecipe(null);
      setEditingItem(null);
      setHighlightingRowId(null);
      setHighlightingRowType(null);
    }
  }, [
    viewMode,
    fetchItems,
    setEditingRecipe,
    setEditingItem,
    setHighlightingRowId,
    setHighlightingRowType,
  ]);

  useDishesClientRecipePricing({
    paginatedRecipesList,
    recipePrices,
    updateVisibleRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
  });

  const selectedItemTypes = useMemo(() => {
    const types = new Map<string, 'recipe' | 'dish'>();
    dishes.forEach(d => {
      if (selectedItems.has(d.id)) types.set(d.id, 'dish');
    });
    recipes.forEach(r => {
      if (selectedItems.has(r.id)) types.set(r.id, 'recipe');
    });
    return types;
  }, [dishes, recipes, selectedItems]);

  const {
    bulkActionLoading,
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
  } = useDishesClientBulkActions({
    dishes,
    recipes,
    selectedItems,
    selectedItemTypes,
    setDishes,
    setRecipes,
    onClearSelection: handleExitSelectionMode,
  });

  const handleRecipeImagesGenerated = useCallback(
    (
      recipeId: string,
      images: {
        classic: string | null;
        modern: string | null;
        rustic: string | null;
        minimalist: string | null;
      },
    ) => {
      const handler = createRecipeImagesGeneratedHandler(
        setRecipes,
        selectedRecipeForPreview,
        setSelectedRecipeForPreview,
      );
      return handler(recipeId, images);
    },
    [setRecipes, selectedRecipeForPreview, setSelectedRecipeForPreview],
  );

  const sidePanelsHandlers = useDishesSidePanelsHandlers({
    setShowDishPanel,
    setSelectedDishForPreview,
    setShowRecipePanel,
    setSelectedRecipeForPreview,
    setRecipeIngredients,
    setShowDishEditDrawer,
    setEditingDish,
    handleEditDish,
    handleDeleteDish,
    handleEditRecipe,
    handleDeleteRecipe,
    confirmDeleteItem,
    cancelDeleteItem,
    fetchItems,
    onRecipeImagesGenerated: handleRecipeImagesGenerated,
  });

  const capitalizeRecipeName = formatRecipeName;
  const selectedRecipeCount = selectedRecipeIds.length;

  return {
    // State
    loading,
    error,
    viewMode,
    setViewMode,

    // Selection
    isSelectionMode,
    selectedItems,
    selectedRecipeCount,
    handleExitSelectionMode,

    // Bulk Actions
    bulkActionLoading,
    showBulkMenu,
    setShowBulkMenu,
    handleBulkDelete,
    handleBulkShare,
    handleBulkAddToMenu,
    showBulkDeleteConfirm,
    confirmBulkDelete,
    cancelBulkDelete,
    showMenuDialog,
    setShowMenuDialog,
    menus,
    loadingMenus,
    selectedItemTypes,
    recipes,
    dishes,
    capitalizeRecipeName,
    handleSelectMenu,
    handleCreateNewMenu,

    // Editing
    editingItem,
    setEditingItem,
    editingRecipe,
    setEditingRecipe,
    fetchItems,

    // List View
    allItems,
    paginatedItems,
    paginatedDishesList,
    paginatedRecipesList,
    dishCosts,
    recipePrices,
    highlightingRowId,
    highlightingRowType,
    filters,
    updateFilters,
    showDishPanel,
    selectedDishForPreview,
    showRecipePanel,
    selectedRecipeForPreview,
    recipeIngredients,
    previewYield,
    showDeleteConfirm,
    itemToDelete,
    showDishEditDrawer,
    editingDish,
    sidePanelsHandlers,
    handleSelectAll,
    handleSelectItem,
    handlePreviewDish,
    handlePreviewRecipe,
    handleEditDish,
    handleEditRecipe,
    handleDeleteDish,
    handleDeleteRecipe,
    startLongPress,
    cancelLongPress,
    enterSelectionMode,
  };
}
