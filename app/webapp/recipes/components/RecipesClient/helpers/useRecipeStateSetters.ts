import { useCallback } from 'react';
import { Recipe } from '../../../types';

interface UseRecipeStateSettersProps {
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setShowUnifiedModal: (show: boolean) => void;
  setPreviewYield: (yieldValue: number) => void;
  setShowRecipeEditDrawer: (show: boolean) => void;
  setEditingRecipe: (recipe: Recipe | null) => void;
  fetchRecipes: () => Promise<void>;
}

/**
 * Memoized setter callbacks for recipe state management
 */
export function useRecipeStateSetters({
  setSelectedRecipe,
  setShowUnifiedModal,
  setPreviewYield,
  setShowRecipeEditDrawer,
  setEditingRecipe,
  fetchRecipes,
}: UseRecipeStateSettersProps) {
  const handleCloseModal = useCallback(() => {
    setShowUnifiedModal(false);
    setSelectedRecipe(null);
  }, [setShowUnifiedModal, setSelectedRecipe]);

  const handleSetSelectedRecipe = useCallback(
    (recipe: Recipe | null) => setSelectedRecipe(recipe),
    [setSelectedRecipe],
  );
  const handleSetShowUnifiedModal = useCallback(
    (show: boolean) => setShowUnifiedModal(show),
    [setShowUnifiedModal],
  );
  const handleSetPreviewYield = useCallback(
    (yieldValue: number) => setPreviewYield(yieldValue),
    [setPreviewYield],
  );
  const handleSetShowRecipeEditDrawer = useCallback(
    (show: boolean) => setShowRecipeEditDrawer(show),
    [setShowRecipeEditDrawer],
  );
  const handleSetEditingRecipe = useCallback(
    (recipe: Recipe | null) => setEditingRecipe(recipe),
    [setEditingRecipe],
  );
  const handleRefreshRecipes = useCallback(() => fetchRecipes(), [fetchRecipes]);

  return {
    handleCloseModal,
    handleSetSelectedRecipe,
    handleSetShowUnifiedModal,
    handleSetPreviewYield,
    handleSetShowRecipeEditDrawer,
    handleSetEditingRecipe,
    handleRefreshRecipes,
  };
}




