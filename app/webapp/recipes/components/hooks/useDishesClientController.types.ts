import { Dish, DishCostData, Recipe, RecipePriceData } from '../../types';

// We might need to adjust these imports based on where Dish/Recipe are actually defined.
// Based on typical project structure, checking shared types or inferring from usage.

// Since I don't have the exact type definitions for every sub-hook at hand,
// I will define the interface with 'any' for complex hook-specific return types initially
// to avoid compilation errors due to missing imports, then specific types can be refined.
// However, the goal is strict safety.
// Let's rely on type inference for now in the helper, but the calling code needs an interface?
// Actually, explicitly typing a huge return object with 50+ fields is tedious and error-prone.
// Better approach: Define the interface using ReturnType of the hook if possible, or
// just define the shape required by the view.

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
  menus: any[]; // Todo: Type strictly
  loadingMenus: boolean;
  selectedItemTypes: Map<string, 'recipe' | 'dish'>;
  recipes: any[]; // Todo: Type strictly
  dishes: any[]; // Todo: Type strictly
  capitalizeRecipeName: (name: string) => string;
  handleSelectMenu: (menuId: string) => void;
  handleCreateNewMenu: any;

  // Editing
  editingItem: any | null; // Todo: Type strictly (Dish | Recipe)
  setEditingItem: (item: any | null) => void;
  editingRecipe: any | null; // Todo: Recipe
  setEditingRecipe: (recipe: any | null) => void;
  fetchItems: () => Promise<void>;

  // List View
  allItems: any[];
  paginatedItems: any[];
  paginatedDishesList: any[];
  paginatedRecipesList: any[];
  dishCosts: Map<string, DishCostData>;
  recipePrices: Record<string, RecipePriceData>;
  highlightingRowId: string | null;
  highlightingRowType: 'dish' | 'recipe' | null;
  filters: any; // Todo: Filter types
  updateFilters: (filters: any) => void;
  showDishPanel: boolean;
  selectedDishForPreview: any | null;
  showRecipePanel: boolean;
  selectedRecipeForPreview: any | null;
  recipeIngredients: any[]; // RecipeIngredient[]
  previewYield: number; // or string?
  showDeleteConfirm: boolean;
  itemToDelete: (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' }) | null;
  showDishEditDrawer: boolean;
  editingDish: any | null;
  sidePanelsHandlers: any; // Complex object
  handleSelectAll: () => void;
  handleSelectItem: (id: string) => void;
  handlePreviewDish: (dish: any) => void;
  handlePreviewRecipe: (recipe: any) => void;
  handleEditDish: (dish: any) => void;
  handleEditRecipe: (recipe: any) => void;
  handleDeleteDish: (dish: any) => void;
  handleDeleteRecipe: (recipe: any) => void;
  startLongPress: (id: string) => void;
  cancelLongPress: () => void;
  enterSelectionMode: () => void;
}
