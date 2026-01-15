import { useCallback } from 'react';
import { Dish, Recipe, RecipeIngredientWithDetails } from '../../types';

interface UseDishesSidePanelsHandlersProps {
  setShowDishPanel: (show: boolean) => void;
  setSelectedDishForPreview: (dish: Dish | null) => void;
  setShowRecipePanel: (show: boolean) => void;
  setSelectedRecipeForPreview: (recipe: Recipe | null) => void;
  setRecipeIngredients: (ingredients: RecipeIngredientWithDetails[]) => void;
  setShowDishEditDrawer: (show: boolean) => void;
  setEditingDish: (dish: Dish | null) => void;
  handleEditDish: (dish: Dish) => void;
  handleDeleteDish: (dish: Dish) => void;
  handleEditRecipe: (recipe: Recipe) => void;
  handleDeleteRecipe: (recipe: Recipe) => void;
  confirmDeleteItem: () => void;
  cancelDeleteItem: () => void;
  fetchItems: () => Promise<void>;
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
  onRecipeImagesGenerated,
}: UseDishesSidePanelsHandlersProps) {
  const closeDishPanel = useCallback(() => {
    setShowDishPanel(false);
    setSelectedDishForPreview(null);
  }, [setShowDishPanel, setSelectedDishForPreview]);
  const onDishPanelClose = closeDishPanel;
  const onDishEdit = useCallback(
    (dish: Dish) => {
      closeDishPanel();
      handleEditDish(dish);
    },
    [closeDishPanel, handleEditDish],
  );
  const onDishDelete = useCallback(
    (dish: Dish) => {
      closeDishPanel();
      handleDeleteDish(dish);
    },
    [closeDishPanel, handleDeleteDish],
  );
  const closeRecipePanel = useCallback(() => {
    setShowRecipePanel(false);
    setSelectedRecipeForPreview(null);
    setRecipeIngredients([]);
  }, [setShowRecipePanel, setSelectedRecipeForPreview, setRecipeIngredients]);
  const onRecipePanelClose = closeRecipePanel;
  const onRecipeEdit = useCallback(
    (recipe: Recipe) => {
      closeRecipePanel();
      handleEditRecipe(recipe);
    },
    [closeRecipePanel, handleEditRecipe],
  );
  const onRecipeDelete = useCallback(
    (recipe: Recipe) => {
      closeRecipePanel();
      handleDeleteRecipe(recipe);
    },
    [closeRecipePanel, handleDeleteRecipe],
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
    onRecipeImagesGenerated,
  };
}
