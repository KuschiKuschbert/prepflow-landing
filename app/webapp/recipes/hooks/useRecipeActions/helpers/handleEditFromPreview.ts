/**
 * Handle editing recipe from preview.
 */
import { convertToCOGSCalculations } from '../../utils/recipeCalculationHelpers';
import { storeRecipeForEditing } from '../../utils/recipeEditHelpers';
import type { Recipe, RecipeIngredientWithDetails } from '../../../types';

export function handleEditFromPreview(
  selectedRecipe: Recipe,
  recipeIngredients: RecipeIngredientWithDetails[],
  router: { push: (path: string) => void },
  showErrorNotification: (message: string) => void,
): void {
  if (!selectedRecipe || !recipeIngredients.length) {
    showErrorNotification('No recipe data available for editing');
    return;
  }
  try {
    const calculations = convertToCOGSCalculations(recipeIngredients, selectedRecipe.id);
    storeRecipeForEditing(selectedRecipe, calculations);
    router.push('/webapp/recipes#dishes');
  } catch (err) {
    throw new Error('Failed to load recipe for editing');
  }
}
