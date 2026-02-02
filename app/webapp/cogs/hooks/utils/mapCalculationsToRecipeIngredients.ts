import { COGSCalculation, RecipeIngredient } from '@/lib/types/cogs';

export function mapCalculationsToRecipeIngredients(
  calculations: COGSCalculation[],
): RecipeIngredient[] {
  return calculations.map(calc => ({
    id: calc.ingredientId,
    recipe_id: calc.recipeId || '',
    ingredient_id: calc.ingredientId,
    ingredient_name: calc.ingredientName,
    quantity: calc.quantity,
    unit: calc.unit,
    cost_per_unit: calc.costPerUnit,
    total_cost: calc.totalCost,
  }));
}
