/**
 * Recipe saving logic for COGS calculations
 */

import { logger } from '@/lib/logger';
import type { COGSCalculation, Recipe } from '@/lib/types/cogs';

interface SaveRecipeParams {
  calculations: COGSCalculation[];
  dishName: string;
  dishPortions: number;
  validateCalculations: (calculations: COGSCalculation[]) => COGSCalculation[];
  createOrUpdateRecipe: (
    name: string,
    portions: number,
  ) => Promise<{ recipe: Recipe; isNew: boolean } | null>;
  saveRecipeIngredients: (
    recipeId: string,
    inserts: Array<{ recipe_id: string; ingredient_id: string; quantity: number; unit: string }>,
    isUpdate: boolean,
  ) => Promise<{ error?: string }>;
  setError: (error: string | null) => void;
  showSuccess: (message: string) => void;
  onRecipeCreated: () => void;
}

/**
 * Save recipe with ingredients
 *
 * @param {SaveRecipeParams} params - Save recipe parameters
 * @returns {Promise<Recipe | null>} Saved recipe or null
 */
export async function saveRecipeWithIngredients({
  calculations,
  dishName,
  dishPortions,
  validateCalculations,
  createOrUpdateRecipe,
  saveRecipeIngredients,
  setError,
  showSuccess,
  onRecipeCreated,
}: SaveRecipeParams): Promise<Recipe | null> {
  if (calculations.length === 0) {
    setError('No calculations to save. Please calculate COGS first.');
    return null;
  }

  try {
    setError(null);

    const result = await createOrUpdateRecipe(dishName, dishPortions);
    if (!result) return null;

    const { recipe, isNew } = result;

    const validCalculations = validateCalculations(calculations);
    if (validCalculations.length === 0) {
      setError(
        'No valid ingredients to save. Please ensure all ingredients have valid IDs and quantities.',
      );
      return null;
    }

    const recipeIngredientInserts = validCalculations.map(calc => ({
      recipe_id: recipe.id,
      ingredient_id: calc.ingredientId,
      quantity: calc.quantity,
      unit: calc.unit,
    }));

    const saveResult = await saveRecipeIngredients(recipe.id, recipeIngredientInserts, !isNew);
    if (saveResult.error) {
      setError(saveResult.error);
      return null;
    }

    setError(null);
    showSuccess(
      `Recipe "${recipe.recipe_name}" ${isNew ? 'saved' : 'updated'} successfully to Recipe Book!`,
    );
    if (isNew) onRecipeCreated();
    return recipe;
  } catch (err: unknown) {
    logger.error('Recipe save error:', err);

    let errorMessage = 'Failed to save recipe';
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'object' && err !== null) {
      const errorObj = err as Record<string, unknown>;
      if (typeof errorObj.message === 'string') {
        errorMessage = errorObj.message;
      } else if (typeof errorObj.code === 'string') {
        errorMessage = `Database error (${errorObj.code})`;
      }
    }

    setError(`Failed to save recipe: ${errorMessage}`);
    return null;
  }
}
