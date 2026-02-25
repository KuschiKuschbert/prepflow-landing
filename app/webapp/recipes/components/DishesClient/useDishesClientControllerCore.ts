/**
 * Core dishes client controller hook. Lives under DishesClient (component limit) to avoid hook size limit.
 */
import { useSelectionMode } from '@/app/webapp/ingredients/hooks/useSelectionMode';
import type { Dish, Recipe } from '@/lib/types/recipes';
import { markFirstDone } from '@/lib/page-help/first-done-storage';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useAIInstructions } from '../../hooks/useAIInstructions';
import { useRecipeIngredients } from '../../hooks/useRecipeIngredients';
import { useRecipePricing } from '../../hooks/useRecipePricing';
import { buildControllerResult } from './buildControllerResult';
import { createRecipeImagesGeneratedHandler } from './helpers/handleRecipeImagesGenerated';
import { useDishesClientBulkActions } from './hooks/useDishesClientBulkActions';
import type {
  EditingItemShape,
  UseDishesClientControllerResult,
} from '../hooks/useDishesClientController.types';
import { useDishesClientData } from '../hooks/useDishesClientData';
import { useDishesClientHandlers } from '../hooks/useDishesClientHandlers';
import { useDishesClientPagination } from '../hooks/useDishesClientPagination';
import { useDishesClientPreview } from '../hooks/useDishesClientPreview';
import { useDishesClientRecipePricing } from '../hooks/useDishesClientRecipePricing';
import { useDishesClientSelection } from '../hooks/useDishesClientSelection';
import { useDishesClientViewMode } from '../hooks/useDishesClientViewMode';
import { useDishesSidePanelsHandlers } from '../hooks/useDishesSidePanelsHandlers';

export interface UseDishesClientControllerProps {
  initialDishes?: Dish[];
  initialRecipes?: Recipe[];
  preselectedRecipeId?: string;
}

function useResetStateOnViewModeChange(
  viewMode: string,
  fetchItems: () => void,
  setEditingRecipe: (val: Recipe | null) => void,
  setEditingItem: (val: EditingItemShape | null) => void,
  settingHighlightingRowId: (val: string | null) => void,
  setHighlightingRowType: (val: 'dish' | 'recipe' | null) => void,
) {
  useEffect(() => {
    if (viewMode === 'list') {
      fetchItems();
      setEditingRecipe(null);
      setEditingItem(null);
      settingHighlightingRowId(null);
      setHighlightingRowType(null);
    }
  }, [
    viewMode,
    fetchItems,
    setEditingRecipe,
    setEditingItem,
    settingHighlightingRowId,
    setHighlightingRowType,
  ]);
}

function useSelectedItemTypes(
  dishes: { id: string }[],
  recipes: { id: string }[],
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

function useDishesClientControllerEffects(
  dishesLength: number,
  recipesLength: number,
  preselectedRecipeId: string | undefined,
  loading: boolean,
  recipes: Recipe[],
  handlePreviewRecipe: (recipe: Recipe) => void,
) {
  const router = useRouter();
  useEffect(() => {
    if (dishesLength + recipesLength > 0) markFirstDone('dishes');
  }, [dishesLength, recipesLength]);
  useEffect(() => {
    if (!preselectedRecipeId || loading || recipes.length === 0) return;
    const recipe = recipes.find(r => r.id === preselectedRecipeId);
    if (recipe) {
      handlePreviewRecipe(recipe);
      router.replace('/webapp/recipes', { scroll: false });
    }
  }, [preselectedRecipeId, loading, recipes, handlePreviewRecipe, router]);
}

function useRecipeImagesHandler(
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
      return createRecipeImagesGeneratedHandler(
        setRecipes,
        selectedRecipeForPreview,
        setSelectedRecipeForPreview,
      )(recipeId, images);
    },
    [setRecipes, selectedRecipeForPreview, setSelectedRecipeForPreview],
  );
}

export function useDishesClientControllerCore(
  props: UseDishesClientControllerProps,
): UseDishesClientControllerResult {
  const { initialDishes, initialRecipes, preselectedRecipeId } = props;
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
  } = useDishesClientData({ initialDishes, initialRecipes });
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
    handlePreviewRecipe,
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

  useDishesClientControllerEffects(
    dishes.length,
    recipes.length,
    preselectedRecipeId,
    loading,
    recipes,
    handlePreviewRecipe,
  );
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
    selectedRecipeCount,
    handleExitSelectionMode,
    bulkActions,
    selectedItemTypes,
    dishes,
    recipes,
    editingItem,
    setEditingItem,
    previewState.editingRecipe,
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
