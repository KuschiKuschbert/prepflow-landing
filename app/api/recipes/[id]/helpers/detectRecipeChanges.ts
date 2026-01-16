/**
 * Helper for detecting recipe changes
 */

export interface RecipeChangeDetails {
  yield?: {
    field: string;
    before: unknown;
    after: unknown;
    change: string;
  };
  instructions?: {
    field: string;
    change: string;
  };
  ingredients?: {
    field: string;
    change: string;
  };
}

/**
 * Detects changes in recipe data
 *
 * @param {any} currentRecipe - Current recipe data
 * @param {any} updateData - Update data
 * @param {boolean} ingredientsChanged - Whether ingredients changed
 * @param {boolean} yieldChanged - Whether yield changed
 * @returns {Object} Change type and details
 */
export function detectRecipeChanges(
  currentRecipe: unknown,
  updateData: unknown,
  ingredientsChanged: boolean,
  yieldChanged: boolean,
): { changeType: string; changeDetails: RecipeChangeDetails } {
  const changeDetails: RecipeChangeDetails = {};
  let changeType = 'updated';

  if (currentRecipe) {
    if (
      yieldChanged &&
      updateData.yield !== undefined &&
      updateData.yield !== currentRecipe.yield
    ) {
      changeType = 'yield_changed';
      changeDetails.yield = {
        field: 'yield',
        before: currentRecipe.yield,
        after: updateData.yield,
        change: updateData.yield > currentRecipe.yield ? 'increased' : 'decreased',
      };
    }

    if (
      updateData.instructions !== undefined &&
      updateData.instructions !== currentRecipe.instructions
    ) {
      changeDetails.instructions = {
        field: 'instructions',
        change: 'instructions updated',
      };
    }
  }

  if (ingredientsChanged) {
    changeType = 'ingredients_changed';
    changeDetails.ingredients = {
      field: 'ingredients',
      change: 'ingredients updated',
    };
  }

  return { changeType, changeDetails };
}
