import { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';

/**
 * Build recipe handler functions.
 *
 * @param {Object} params - Handler parameters
 */
export function buildRecipeHandlers({
  selectedRecipe,
  recipeIngredients,
  aiInstructions,
  setEditingRecipe,
  setShowRecipeEditDrawer,
  setShowUnifiedModal,
  handleShareRecipe,
}: {
  selectedRecipe: Recipe | null;
  recipeIngredients: RecipeIngredientWithDetails[];
  aiInstructions: string;
  setEditingRecipe: (recipe: Recipe | null) => void;
  setShowRecipeEditDrawer: (show: boolean) => void;
  setShowUnifiedModal: (show: boolean) => void;
  handleShareRecipe: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
    aiInstructions: string,
  ) => void;
}) {
  const handleEditRecipeWrapper = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowRecipeEditDrawer(true);
    setShowUnifiedModal(false);
  };

  const handleEditRecipeFromCard = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowRecipeEditDrawer(true);
  };

  const handleShareRecipeWrapper = () => {
    if (!selectedRecipe || !recipeIngredients.length) return;
    handleShareRecipe(selectedRecipe, recipeIngredients, aiInstructions);
  };

  const handlePrint = () => window.print();

  return {
    handleEditRecipeWrapper,
    handleEditRecipeFromCard,
    handleShareRecipeWrapper,
    handlePrint,
  };
}
