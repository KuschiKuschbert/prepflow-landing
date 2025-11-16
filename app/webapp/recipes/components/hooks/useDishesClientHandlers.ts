import { useCallback } from 'react';
import { Dish, Recipe } from '../../types';
import { useDishesClientDelete } from './useDishesClientDelete';

type ViewMode = 'list' | 'editor' | 'builder';

interface UseDishesClientHandlersProps {
  dishes: Dish[];
  recipes: Recipe[];
  viewMode: ViewMode;
  editingItem: { item: Recipe | Dish; type: 'recipe' | 'dish' } | null;
  setDishes: (dishes: Dish[]) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setViewMode: (mode: ViewMode) => void;
  setEditingItem: (item: { item: Recipe | Dish; type: 'recipe' | 'dish' } | null) => void;
  setEditingRecipe: (recipe: Recipe | null) => void;
  setShowRecipePanel: (show: boolean) => void;
  setSelectedRecipeForPreview: (recipe: Recipe | null) => void;
  setHighlightingRowId: (id: string | null) => void;
  setHighlightingRowType: (type: 'recipe' | 'dish' | null) => void;
  setSuccessMessage: (message: string | null) => void;
  setError: (error: string | null) => void;
}

export function useDishesClientHandlers({
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
  setSuccessMessage,
  setError,
}: UseDishesClientHandlersProps) {
  const deleteHandlers = useDishesClientDelete({
    dishes,
    recipes,
    setDishes,
    setRecipes,
    setError,
    setSuccessMessage,
  });

  const handleEditDish = useCallback(
    (dish: Dish) => {
      if (viewMode === 'editor' && editingItem) {
        setViewMode('list');
        setEditingItem(null);
      }
      setHighlightingRowId(dish.id);
      setHighlightingRowType('dish');
      setTimeout(() => {
        setEditingItem({ item: dish, type: 'dish' });
        setViewMode('editor');
        setHighlightingRowId(null);
        setHighlightingRowType(null);
      }, 500);
    },
    [
      viewMode,
      editingItem,
      setViewMode,
      setEditingItem,
      setHighlightingRowId,
      setHighlightingRowType,
    ],
  );

  const handleEditRecipe = useCallback(
    (recipe: Recipe) => {
      setShowRecipePanel(false);
      setSelectedRecipeForPreview(null);
      if (viewMode === 'editor' && editingItem) {
        setViewMode('list');
        setEditingItem(null);
      }
      setHighlightingRowId(recipe.id);
      setHighlightingRowType('recipe');
      setTimeout(() => {
        setEditingItem({ item: recipe, type: 'recipe' });
        setViewMode('editor');
        setHighlightingRowId(null);
        setHighlightingRowType(null);
      }, 500);
    },
    [
      viewMode,
      editingItem,
      setViewMode,
      setEditingItem,
      setShowRecipePanel,
      setSelectedRecipeForPreview,
      setHighlightingRowId,
      setHighlightingRowType,
    ],
  );

  return {
    ...deleteHandlers,
    handleEditDish,
    handleEditRecipe,
  };
}
