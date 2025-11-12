import { COGSCalculation, RecipeIngredient } from '../../types';

export function createRecipeIngredientFromCalculation(
  calculation: COGSCalculation,
  selectedRecipe: string,
): RecipeIngredient {
  return {
    id: calculation.ingredientId,
    recipe_id: calculation.recipeId || selectedRecipe || '',
    ingredient_id: calculation.ingredientId,
    ingredient_name: calculation.ingredientName,
    quantity: calculation.quantity,
    unit: calculation.unit,
    cost_per_unit: calculation.costPerUnit,
    total_cost: calculation.totalCost,
  };
}
