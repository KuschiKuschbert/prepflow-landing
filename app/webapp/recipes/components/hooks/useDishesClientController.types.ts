import { Menu } from '@/lib/types/menu-builder';
import {
  Dish,
  DishCostData,
  Recipe,
  RecipeIngredientWithDetails,
  RecipePriceData,
  UnifiedItem,
} from '@/lib/types/recipes';
import { UnifiedFilters } from './useDishesClientPagination/helpers/useFilterState';

/**
 * Shape used by the editor view for editing items
 */
export interface EditingItemShape {
  item: Recipe | Dish;
  type: 'recipe' | 'dish';
}

export interface UseDishesClientControllerResult {
  // State
  loading: boolean;
  error: string | null;
  viewMode: 'list' | 'editor' | 'builder';
  setViewMode: (mode: 'list' | 'editor' | 'builder') => void;

  // Selection
  isSelectionMode: boolean;
  selectedItems: Set<string>;
  selectedRecipeCount: number;
  handleExitSelectionMode: () => void;

  // Bulk Actions
  bulkActionLoading: boolean;
  showBulkMenu: boolean;
  setShowBulkMenu: (show: boolean) => void;
  handleBulkDelete: () => void;
  handleBulkShare: (format: string) => void;
  handleBulkAddToMenu: () => void;
  showBulkDeleteConfirm: boolean;
  confirmBulkDelete: () => void;
  cancelBulkDelete: () => void;
  showMenuDialog: boolean;
  setShowMenuDialog: (show: boolean) => void;
  menus: Menu[];
  loadingMenus: boolean;
  selectedItemTypes: Map<string, 'recipe' | 'dish'>;
  recipes: Recipe[];
  dishes: Dish[];
  capitalizeRecipeName: (name: string) => string;
  handleSelectMenu: (menuId: string) => void;
  handleCreateNewMenu: () => void;

  // Editing - uses wrapper shape for editor compatibility
  editingItem: EditingItemShape | null;
  setEditingItem: (item: EditingItemShape | null) => void;
  editingRecipe: Recipe | null;
  setEditingRecipe: (recipe: Recipe | null) => void;
  fetchItems: () => Promise<void>;

  // List View
  allItems: UnifiedItem[];
  paginatedItems: UnifiedItem[];
  paginatedDishesList: (Dish & { itemType: 'dish' })[];
  paginatedRecipesList: (Recipe & { itemType: 'recipe' })[];
  dishCosts: Map<string, DishCostData>;
  recipePrices: Record<string, RecipePriceData>;
  highlightingRowId: string | null;
  highlightingRowType: 'dish' | 'recipe' | null;
  filters: UnifiedFilters;
  updateFilters: (filters: Partial<UnifiedFilters>) => void;
  showDishPanel: boolean;
  selectedDishForPreview: Dish | null;
  showRecipePanel: boolean;
  selectedRecipeForPreview: Recipe | null;
  recipeIngredients: RecipeIngredientWithDetails[];
  previewYield: number;
  showDeleteConfirm: boolean;
  itemToDelete: (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' }) | null;
  showDishEditDrawer: boolean;
  editingDish: Dish | null;
  sidePanelsHandlers: SidePanelHandlers;
  handleSelectAll: () => void;
  handleSelectItem: (id: string) => void;
  handlePreviewDish: (dish: Dish) => void;
  handlePreviewRecipe: (recipe: Recipe) => void;
  handleEditDish: (dish: Dish) => void;
  handleEditRecipe: (recipe: Recipe) => void;
  handleDeleteDish: (dish: Dish) => void;
  handleDeleteRecipe: (recipe: Recipe) => void;
  startLongPress: (id: string) => void;
  cancelLongPress: () => void;
  enterSelectionMode: () => void;
}

/**
 * Handler functions for side panels - matches DishesSidePanelsProps handlers
 */
export interface SidePanelHandlers {
  onDishPanelClose: () => void;
  onDishEdit: (dish: Dish) => void;
  onDishDelete: (dish: Dish) => void;
  onRecipePanelClose: () => void;
  onRecipeEdit: (recipe: Recipe) => void;
  onRecipeDelete: (recipe: Recipe) => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onDishEditDrawerClose: () => void;
  onDishEditDrawerSave: () => Promise<void>;
  onRecipeImagesGenerated?: (
    recipeId: string,
    images: {
      classic: string | null;
      modern: string | null;
      rustic: string | null;
      minimalist: string | null;
    },
  ) => void;
}
