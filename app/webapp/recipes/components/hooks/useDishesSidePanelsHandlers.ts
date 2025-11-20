import { useCallback } from 'react';
import { Dish, Recipe } from '../../types';

interface UseDishesSidePanelsHandlersProps {
  setShowDishPanel: (show: boolean) => void;
  setSelectedDishForPreview: (dish: Dish | null) => void;
  setShowRecipePanel: (show: boolean) => void;
  setSelectedRecipeForPreview: (recipe: Recipe | null) => void;
  setRecipeIngredients: (ingredients: any[]) => void;
  setShowDishEditDrawer: (show: boolean) => void;
  setEditingDish: (dish: Dish | null) => void;
  handleEditDish: (dish: Dish) => void;
  handleDeleteDish: (dish: Dish) => void;
  handleEditRecipe: (recipe: Recipe) => void;
  handleDeleteRecipe: (recipe: Recipe) => void;
  confirmDeleteItem: () => void;
  cancelDeleteItem: () => void;
  fetchItems: () => Promise<void>;
}

export function useDishesSidePanelsHandlers({
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
}: UseDishesSidePanelsHandlersProps) {
  const onDishPanelClose = useCallback(() => {
    setShowDishPanel(false);
    setSelectedDishForPreview(null);
  }, [setShowDishPanel, setSelectedDishForPreview]);

  const onDishEdit = useCallback(
    (dish: Dish) => {
      setShowDishPanel(false);
      setSelectedDishForPreview(null);
      handleEditDish(dish);
    },
    [setShowDishPanel, setSelectedDishForPreview, handleEditDish],
  );

  const onDishDelete = useCallback(
    (dish: Dish) => {
      setShowDishPanel(false);
      setSelectedDishForPreview(null);
      handleDeleteDish(dish);
    },
    [setShowDishPanel, setSelectedDishForPreview, handleDeleteDish],
  );

  const onRecipePanelClose = useCallback(() => {
    setShowRecipePanel(false);
    setSelectedRecipeForPreview(null);
    setRecipeIngredients([]);
  }, [setShowRecipePanel, setSelectedRecipeForPreview, setRecipeIngredients]);

  const onRecipeEdit = useCallback(
    (recipe: Recipe) => {
      setShowRecipePanel(false);
      setSelectedRecipeForPreview(null);
      handleEditRecipe(recipe);
    },
    [setShowRecipePanel, setSelectedRecipeForPreview, handleEditRecipe],
  );

  const onRecipeDelete = useCallback(
    (recipe: Recipe) => {
      setShowRecipePanel(false);
      setSelectedRecipeForPreview(null);
      handleDeleteRecipe(recipe);
    },
    [setShowRecipePanel, setSelectedRecipeForPreview, handleDeleteRecipe],
  );

  const onDishEditDrawerClose = useCallback(() => {
    setShowDishEditDrawer(false);
    setEditingDish(null);
  }, [setShowDishEditDrawer, setEditingDish]);

  return {
    onDishPanelClose,
    onDishEdit,
    onDishDelete,
    onRecipePanelClose,
    onRecipeEdit,
    onRecipeDelete,
    onDeleteConfirm: confirmDeleteItem,
    onDeleteCancel: cancelDeleteItem,
    onDishEditDrawerClose,
    onDishEditDrawerSave: fetchItems,
  };
}

