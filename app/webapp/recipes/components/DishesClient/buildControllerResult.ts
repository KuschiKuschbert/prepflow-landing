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
import type {
  EditingItemShape,
  SidePanelHandlers,
  UseDishesClientControllerResult,
} from '../hooks/useDishesClientController.types';
import type { UnifiedFilters } from '../hooks/useDishesClientPagination/helpers/useFilterState';

type ViewMode = 'list' | 'editor' | 'builder';

export interface BulkActionsResult {
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

export interface PaginationResult {
  allItems: UnifiedItem[];
  paginatedItems: UnifiedItem[];
  paginatedDishesList: (Dish & { itemType: 'dish' })[];
  paginatedRecipesList: (Recipe & { itemType: 'recipe' })[];
  filters: UnifiedFilters;
  updateFilters: (filters: Partial<UnifiedFilters>) => void;
}

export interface PreviewStateResult {
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

export interface HandlersResult {
  showDeleteConfirm: boolean;
  itemToDelete: (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' }) | null;
  handleEditDish: (dish: Dish) => void;
  handleEditRecipe: (recipe: Recipe) => void;
  handleDeleteDish: (dish: Dish) => void;
  handleDeleteRecipe: (recipe: Recipe) => void;
  confirmDeleteItem: () => void;
}

export interface SelectionHandlersResult {
  handleSelectAll: () => void;
  handleSelectItem: (id: string) => void;
}

export interface SelectionModeHelpersResult {
  startLongPress: (id: string) => void;
  cancelLongPress: () => void;
  enterSelectionMode: () => void;
}

export function buildControllerResult(
  loading: boolean,
  error: string | null,
  viewMode: ViewMode,
  setViewMode: (mode: ViewMode) => void,
  isSelectionMode: boolean,
  selectedItems: Set<string>,
  selectedRecipeCount: number,
  handleExitSelectionMode: () => void,
  bulkActions: BulkActionsResult,
  selectedItemTypes: Map<string, 'recipe' | 'dish'>,
  dishes: Dish[],
  recipes: Recipe[],
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
    confirmDeleteItem,
  } = handlers;

  const { handleSelectAll, handleSelectItem } = selectionHandlers;
  const { startLongPress, cancelLongPress, enterSelectionMode } = selectionModeHelpers;

  return {
    loading,
    error,
    viewMode,
    setViewMode,
    isSelectionMode,
    selectedItems,
    selectedRecipeCount,
    handleExitSelectionMode,
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
    editingItem,
    setEditingItem,
    editingRecipe,
    setEditingRecipe,
    fetchItems,
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
