import { formatRecipeName } from '@/lib/text-utils';
import { Dish, Recipe } from '@/lib/types/recipes';
import React, { useCallback, useEffect, useMemo } from 'react';
import { createRecipeImagesGeneratedHandler } from '../DishesClient/helpers/handleRecipeImagesGenerated';
import {
  EditingItemShape,
  UseDishesClientControllerResult,
} from './useDishesClientController.types';

export function useResetStateOnViewModeChange(
  viewMode: string,
  fetchItems: () => void,
  setEditingRecipe: (val: Recipe | null) => void,
  setEditingItem: (val: EditingItemShape | null) => void,
  setHighlightingRowId: (val: string | null) => void,
  setHighlightingRowType: (val: 'dish' | 'recipe' | null) => void,
) {
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
}

export function useSelectedItemTypes(
  dishes: Dish[],
  recipes: Recipe[],
  selectedItems: Set<string>,
) {
  return useMemo(() => {
    const types = new Map<string, 'recipe' | 'dish'>();
    dishes.forEach(d => {
      if (selectedItems.has(d.id)) types.set(d.id, 'dish');
    });
    recipes.forEach(r => {
      if (selectedItems.has(r.id)) types.set(r.id, 'recipe');
    });
    return types;
  }, [dishes, recipes, selectedItems]);
}

export function useRecipeImagesHandler(
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  selectedRecipeForPreview: Recipe | null,
  setSelectedRecipeForPreview: React.Dispatch<React.SetStateAction<Recipe | null>>,
) {
  return useCallback(
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
}

export function buildControllerResult(
  // State
  loading: boolean,
  error: any,
  viewMode: any,
  setViewMode: any,

  // Selection
  isSelectionMode: boolean,
  selectedItems: Set<string>,
  selectedRecipeCount: number,
  handleExitSelectionMode: any,

  // Bulk Actions
  bulkActions: any, // useDishesClientBulkActions result
  selectedItemTypes: any,

  // Data
  dishes: any[],
  recipes: any[],

  // Editing & Pagination & Others
  editingItem: any,
  setEditingItem: any,
  editingRecipe: any,
  setEditingRecipe: any,
  fetchItems: any,
  pagination: any, // useDishesClientPagination result
  dishCosts: any,
  recipePrices: any,

  previewState: any, // useDishesClientPreview result
  handlers: any, // useDishesClientHandlers result
  sidePanelsHandlers: any,
  selectionHandlers: any, // useDishesClientSelection result - destructuring handled inside or passed whole?
  selectionModeHelpers: any, // useSelectionMode result
): UseDishesClientControllerResult {
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
  } = bulkActions;

  const {
    allItems,
    paginatedItems,
    paginatedDishesList,
    paginatedRecipesList,
    filters,
    updateFilters,
  } = pagination;

  const {
    selectedRecipeForPreview,
    showRecipePanel,
    selectedDishForPreview,
    showDishPanel,
    editingDish,
    showDishEditDrawer,
    highlightingRowId,
    highlightingRowType,
    handlePreviewDish,
    handlePreviewRecipe,
    recipeIngredients,
    previewYield,
  } = previewState;

  const {
    showDeleteConfirm,
    itemToDelete,
    handleEditDish,
    handleEditRecipe,
    handleDeleteDish,
    handleDeleteRecipe,
    confirmDeleteItem, // Not defined in interface? Copied from source hook usage.
    // cancelDeleteItem // unused in interface but potentially used in side panels
  } = handlers;

  const { handleSelectAll, handleSelectItem } = selectionHandlers;

  const { startLongPress, cancelLongPress, enterSelectionMode } = selectionModeHelpers;

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
    capitalizeRecipeName: formatRecipeName,
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
