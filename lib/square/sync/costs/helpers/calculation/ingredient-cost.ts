interface IngredientCost {
  cost_per_unit_incl_trim?: number;
  cost_per_unit?: number;
}

interface DishIngredientItem {
  quantity?: number;
  ingredients: IngredientCost | IngredientCost[];
}

export function calculateIngredientsCost(dishIngredients: DishIngredientItem[] | null): number {
  let totalCost = 0;

  if (dishIngredients) {
    for (const di of dishIngredients) {
      const ingredient = Array.isArray(di.ingredients) ? di.ingredients[0] : di.ingredients;

      const ingredientQuantity = Number(di.quantity) || 0;
      const costPerUnit =
        Number(ingredient.cost_per_unit_incl_trim) || Number(ingredient.cost_per_unit) || 0;
      const ingredientCost = ingredientQuantity * costPerUnit;

      totalCost += ingredientCost;
    }
  }

  return totalCost;
}
