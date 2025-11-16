import { Recipe } from '../../../types';

/**
 * Handle duplicate recipe action.
 *
 * @param {Object} params - Duplicate parameters
 */
export async function handleDuplicateRecipeWrapper({
  selectedRecipe,
  handleDuplicateRecipe,
  handlePreviewRecipe,
  setShowUnifiedModal,
}: {
  selectedRecipe: Recipe | null;
  handleDuplicateRecipe: (recipe: Recipe) => Promise<Recipe | null>;
  handlePreviewRecipe: (recipe: Recipe) => Promise<void>;
  setShowUnifiedModal: (show: boolean) => void;
}): Promise<void> {
  if (!selectedRecipe) return;
  const duplicated = await handleDuplicateRecipe(selectedRecipe);
  if (duplicated) {
    setShowUnifiedModal(false);
    setTimeout(() => {
      handlePreviewRecipe(duplicated);
    }, 500);
  }
}
