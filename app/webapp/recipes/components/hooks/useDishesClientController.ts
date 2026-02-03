import { useSelectionMode } from '@/app/webapp/ingredients/hooks/useSelectionMode';
import { useAIInstructions } from '../../hooks/useAIInstructions';
import { useRecipeIngredients } from '../../hooks/useRecipeIngredients';
import { useRecipePricing } from '../../hooks/useRecipePricing';
import { useDishesClientBulkActions } from '../DishesClient/hooks/useDishesClientBulkActions';
import {
  buildControllerResult,
  useRecipeImagesHandler,
  useResetStateOnViewModeChange,
  useSelectedItemTypes,
} from './useDishesClientController.helpers';
import { UseDishesClientControllerResult } from './useDishesClientController.types';
import { useDishesClientData } from './useDishesClientData';
import { useDishesClientHandlers } from './useDishesClientHandlers';
import { useDishesClientPagination } from './useDishesClientPagination';
import { useDishesClientPreview } from './useDishesClientPreview';
import { useDishesClientRecipePricing } from './useDishesClientRecipePricing';
import { useDishesClientSelection } from './useDishesClientSelection';
import { useDishesClientViewMode } from './useDishesClientViewMode';
import { useDishesSidePanelsHandlers } from './useDishesSidePanelsHandlers';

export function useDishesClientController(): UseDishesClientControllerResult {
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
    setRecipeIngredients,
    setShowDishPanel,
    setSelectedDishForPreview,
    setShowRecipePanel,
    setEditingDish,
    setShowDishEditDrawer,
    editingItem,
    setEditingItem,
    setEditingRecipe,
    setHighlightingRowId,
    setHighlightingRowType,
  } = previewState;

  const selectionHandlers = useDishesClientSelection(dishes, recipes);
  const { selectedItems, isSelectionMode, handleExitSelectionMode } = selectionHandlers;

  const pagination = useDishesClientPagination({ dishes, recipes, dishCosts, recipePrices });
  const { paginatedRecipesList } = pagination;

  const handlers = useDishesClientHandlers({
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
  const {
    handleEditDish,
    handleDeleteDish,
    handleEditRecipe,
    handleDeleteRecipe,
    confirmDeleteItem,
    cancelDeleteItem,
  } = handlers;

  const selectionModeHelpers = useSelectionMode();

  useResetStateOnViewModeChange(
    viewMode,
    fetchItems,
    setEditingRecipe,
    setEditingItem,
    setHighlightingRowId,
    setHighlightingRowType,
  );

  useDishesClientRecipePricing({
    paginatedRecipesList,
    recipePrices,
    updateVisibleRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
  });

  const selectedItemTypes = useSelectedItemTypes(dishes, recipes, selectedItems);
  const selectedRecipeCount = Array.from(selectedItemTypes.values()).filter(
    t => t === 'recipe',
  ).length;

  const bulkActions = useDishesClientBulkActions({
    dishes,
    recipes,
    selectedItems,
    selectedItemTypes,
    setDishes,
    setRecipes,
    onClearSelection: handleExitSelectionMode,
  });

  const { selectedRecipeIds } = bulkActions; // Used in original code for count??
  // Wait, selectedRecipeCount logic was: const selectedRecipeCount = selectedRecipeIds.length;
  // I replaced it with manual calculation above. Check if selectedRecipeIds is used elsewhere.
  // It was used for 'selectedRecipeCount' in return.

  const handleRecipeImagesGenerated = useRecipeImagesHandler(
    setRecipes,
    selectedRecipeForPreview,
    setSelectedRecipeForPreview,
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

  return buildControllerResult(
    loading,
    error,
    viewMode,
    setViewMode,
    isSelectionMode,
    selectedItems,
    selectedRecipeCount, // Using my calculation or bulkActions.selectedRecipeIds.length
    handleExitSelectionMode,
    bulkActions,
    selectedItemTypes,
    dishes,
    recipes,
    editingItem,
    setEditingItem,
    previewState.editingRecipe, // Was editingRecipe
    setEditingRecipe,
    fetchItems,
    pagination,
    dishCosts,
    recipePrices,
    previewState,
    handlers,
    sidePanelsHandlers,
    selectionHandlers,
    selectionModeHelpers,
  );
}
