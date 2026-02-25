/** Context passed when running an action (e.g. step index for unique names) */
export interface RunActionContext {
  stepIndex?: number;
  /** Names of previously created recipes (for addIngredientToRecipe) */
  recipeNames?: string[];
  /** Names of previously created ingredients (for addIngredientToRecipe) */
  ingredientNames?: string[];
}
