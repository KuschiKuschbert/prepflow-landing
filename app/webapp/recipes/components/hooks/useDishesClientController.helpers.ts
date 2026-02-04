import { formatRecipeName } from '@/lib/text-utils';
import { Menu } from '@/lib/types/menu-builder';
import {
  Dish,
  DishCostData,
  Recipe,
  RecipeIngredientWithDetails,
  RecipePriceData,
  UnifiedItem,
} from '@/lib/types/recipes';
import React, { useCallback, useEffect, useMemo } from 'react';
import { createRecipeImagesGeneratedHandler } from '../DishesClient/helpers/handleRecipeImagesGenerated';
import {
  EditingItemShape,
  SidePanelHandlers,
  UseDishesClientControllerResult,
} from './useDishesClientController.types';
import { UnifiedFilters } from './useDishesClientPagination/helpers/useFilterState';

type ViewMode = 'list' | 'editor' | 'builder';

interface BulkActionsResult {
  bulkActionLoading: boolean;
  showBulkMenu: boolean;
  setShowBulkMenu: (show: boolean) => void;
  showBulkDeleteConfirm: boolean;
  setShowBulkDeleteConfirm: (show: boolean) => void;
  handleBulkDelete: () => void;
  confirmBulkDelete: () => void;
  cancelBulkDelete: () => void;
  handleBulkShare: (format: string) => void;
  handleBulkAddToMenu: () => void;
  handleSelectMenu: (menuId: string) => void;
  handleCreateNewMenu: () => void;
  menus: Menu[];
  loadingMenus: boolean;
  showMenuDialog: boolean;
  setShowMenuDialog: (show: boolean) => void;
}

interface PaginationResult {
  allItems: UnifiedItem[];
  paginatedItems: UnifiedItem[];
  paginatedDishesList: (Dish & { itemType: 'dish' })[];
  paginatedRecipesList: (Recipe & { itemType: 'recipe' })[];
  filters: UnifiedFilters;
  updateFilters: (filters: Partial<UnifiedFilters>) => void;
}

interface PreviewStateResult {
  selectedRecipeForPreview: Recipe | null;
  showRecipePanel: boolean;
  selectedDishForPreview: Dish | null;
  showDishPanel: boolean;
  editingDish: Dish | null;
  showDishEditDrawer: boolean;
  highlightingRowId: string | null;
  highlightingRowType: 'dish' | 'recipe' | null;
  handlePreviewDish: (dish: Dish) => void;
  handlePreviewRecipe: (recipe: Recipe) => void;
  recipeIngredients: RecipeIngredientWithDetails[];
  previewYield: number;
}

interface HandlersResult {
  showDeleteConfirm: boolean;
  itemToDelete: (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' }) | null;
  handleEditDish: (dish: Dish) => void;
  handleEditRecipe: (recipe: Recipe) => void;
  handleDeleteDish: (dish: Dish) => void;
  handleDeleteRecipe: (recipe: Recipe) => void;
  confirmDeleteItem: () => void;
}

interface SelectionHandlersResult {
  handleSelectAll: () => void;
  handleSelectItem: (id: string) => void;
}

interface SelectionModeHelpersResult {
  startLongPress: (id: string) => void;
  cancelLongPress: () => void;
  enterSelectionMode: () => void;
}

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
  error: string | null,
  viewMode: ViewMode,
  setViewMode: (mode: ViewMode) => void,

  // Selection
  isSelectionMode: boolean,
  selectedItems: Set<string>,
  selectedRecipeCount: number,
  handleExitSelectionMode: () => void,

  // Bulk Actions
  bulkActions: BulkActionsResult,
  selectedItemTypes: Map<string, 'recipe' | 'dish'>,

  // Data
  dishes: Dish[],
  recipes: Recipe[],

  // Editing & Pagination & Others
  editingItem: EditingItemShape | null,
  setEditingItem: (item: EditingItemShape | null) => void,
  editingRecipe: Recipe | null,
  setEditingRecipe: (recipe: Recipe | null) => void,
  fetchItems: () => Promise<void>,
  pagination: PaginationResult,
  dishCosts: Map<string, DishCostData>,
  recipePrices: Record<string, RecipePriceData>,

  previewState: PreviewStateResult,
  handlers: HandlersResult,
  sidePanelsHandlers: SidePanelHandlers,
  selectionHandlers: SelectionHandlersResult,
  selectionModeHelpers: SelectionModeHelpersResult,
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
