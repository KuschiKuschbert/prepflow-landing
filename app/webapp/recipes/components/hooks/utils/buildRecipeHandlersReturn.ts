import { Recipe } from '@/lib/types/recipes';

/**
 * Build return object for useRecipeHandlers hook.
 *
 * @param {Object} params - Return parameters
 */
export function buildRecipeHandlersReturn({
  formatQuantity,
  handlePreviewRecipe,
  handleEditRecipeWrapper,
  handleEditRecipeFromCard,
  handleDuplicateRecipeWrapper,
  handleShareRecipeWrapper,
  handlePrint,
  handleRefreshIngredients,
}: {
  formatQuantity: (q: number, u: string) => { value: string; unit: string; original: string };
  handlePreviewRecipe: (recipe: Recipe) => Promise<void>;
  handleEditRecipeWrapper: (recipe: Recipe) => void;
  handleEditRecipeFromCard: (recipe: Recipe) => void;
  handleDuplicateRecipeWrapper: () => Promise<void>;
  handleShareRecipeWrapper: () => void;
  handlePrint: () => void;
  handleRefreshIngredients: () => Promise<void>;
}) {
  return {
    formatQuantity,
    handlePreviewRecipe,
    handleEditRecipeWrapper,
    handleEditRecipeFromCard,
    handleDuplicateRecipeWrapper,
    handleShareRecipeWrapper,
    handlePrint,
    handleRefreshIngredients,
  };
}
