import { useRouter } from 'next/navigation';
import { Recipe } from '../../types';
import { RecipeIngredientWithDetails } from '../../types';
import { convertToCOGSCalculations } from './recipeCalculationHelpers';
import { storeRecipeForEditing } from './recipeEditHelpers';

/**
 * Handle editing a recipe by loading it into COGS calculator.
 *
 * @param {Recipe} recipe - Recipe to edit
 * @param {Function} fetchRecipeIngredients - Function to fetch recipe ingredients
 * @param {Function} setError - State setter for error
 * @param {Function} router - Next.js router instance
 */
export async function handleEditRecipe(
  recipe: Recipe,
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
  setError: (error: string) => void,
  router: ReturnType<typeof useRouter>,
): Promise<void> {
  try {
    const ingredients = await fetchRecipeIngredients(recipe.id);
    const calculations = convertToCOGSCalculations(ingredients, recipe.id);
    storeRecipeForEditing(recipe, calculations);
    router.push('/webapp/cogs');
  } catch (err) {
    setError('Failed to load recipe for editing');
  }
}
