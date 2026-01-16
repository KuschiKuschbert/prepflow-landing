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

export interface RecipeRecord {
  recipe_name?: string | null;
  yield?: number | null;
  instructions?: string | null;
}

/**
 * Detects changes in recipe data
 */
export function detectRecipeChanges(
  currentRecipe: RecipeRecord | null,
  updateData: RecipeRecord,
  ingredientsChanged: boolean,
  yieldChanged: boolean,
): { changeType: string; changeDetails: RecipeChangeDetails } {
  const changeDetails: RecipeChangeDetails = {};
  let changeType = 'updated';

  if (currentRecipe) {
    if (
      yieldChanged &&
      updateData.yield !== undefined &&
      updateData.yield !== null &&
      updateData.yield !== currentRecipe.yield
    ) {
      changeType = 'yield_changed';
      changeDetails.yield = {
        field: 'yield',
        before: currentRecipe.yield,
        after: updateData.yield,
        change: (updateData.yield as number) > (currentRecipe.yield as number) ? 'increased' : 'decreased',
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
