import { useEffect } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../../types';

/**
 * Hook to handle ingredients change effect for modal refresh.
 *
 * @param {Object} params - Effect parameters
 */
export function useIngredientsChangeEffect({
  showUnifiedModal,
  selectedRecipe,
  changedRecipeIds,
  fetchRecipeIngredients,
  setRecipeIngredients,
  clearChangedFlag,
  handleIngredientsChangeRef,
}: {
  showUnifiedModal: boolean;
  selectedRecipe: Recipe | null;
  changedRecipeIds: Set<string>;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  setRecipeIngredients: (ingredients: RecipeIngredientWithDetails[]) => void;
  clearChangedFlag: (recipeId: string) => void;
  handleIngredientsChangeRef: React.MutableRefObject<((recipeId: string) => void) | null>;
}): void {
  useEffect(() => {
    handleIngredientsChangeRef.current = (recipeId: string) => {
      if (showUnifiedModal && selectedRecipe && selectedRecipe.id === recipeId) {
        fetchRecipeIngredients(recipeId)
          .then(ingredients => {
            setRecipeIngredients(ingredients);
            clearChangedFlag(recipeId);
          })
          .catch(err => console.error('Failed to refresh preview ingredients:', err));
      }
    };
    if (showUnifiedModal && selectedRecipe && changedRecipeIds.has(selectedRecipe.id)) {
      fetchRecipeIngredients(selectedRecipe.id)
        .then(ingredients => {
          setRecipeIngredients(ingredients);
          clearChangedFlag(selectedRecipe.id);
        })
        .catch(err => console.error('Failed to refresh on open:', err));
    }
  }, [
    showUnifiedModal,
    selectedRecipe,
    changedRecipeIds,
    fetchRecipeIngredients,
    clearChangedFlag,
    setRecipeIngredients,
    handleIngredientsChangeRef,
  ]);
}
