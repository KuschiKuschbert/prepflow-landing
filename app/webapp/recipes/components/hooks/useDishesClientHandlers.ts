import { useCallback } from 'react';
import { Dish, Recipe } from '@/lib/types/recipes';
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
  setEditingRecipe: _setEditingRecipe,
  setShowRecipePanel,
  setSelectedRecipeForPreview,
  setHighlightingRowId,
  setHighlightingRowType,
  setError,
}: UseDishesClientHandlersProps) {
  const deleteHandlers = useDishesClientDelete({
    dishes,
    recipes,
    setDishes,
    setRecipes,
    setError,
  });

  const resetEditor = useCallback(() => {
    if (viewMode === 'editor' && editingItem) {
      setViewMode('list');
      setEditingItem(null);
    }
  }, [viewMode, editingItem, setViewMode, setEditingItem]);

  const handleEditDish = useCallback(
    (dish: Dish) => {
      resetEditor();
      setHighlightingRowId(dish.id);
      setHighlightingRowType('dish');
      setTimeout(() => {
        setEditingItem({ item: dish, type: 'dish' });
        setViewMode('editor');
        setHighlightingRowId(null);
        setHighlightingRowType(null);
      }, 500);
    },
    [resetEditor, setHighlightingRowId, setHighlightingRowType, setEditingItem, setViewMode],
  );

  const handleEditRecipe = useCallback(
    (recipe: Recipe) => {
      setShowRecipePanel(false);
      setSelectedRecipeForPreview(null);
      resetEditor();
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
      resetEditor,
      setShowRecipePanel,
      setSelectedRecipeForPreview,
      setHighlightingRowId,
      setHighlightingRowType,
      setEditingItem,
      setViewMode,
    ],
  );

  return {
    ...deleteHandlers,
    handleEditDish,
    handleEditRecipe,
  };
}
