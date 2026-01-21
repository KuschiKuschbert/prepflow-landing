export function calculateIngredientsCost(dishIngredients: any[] | null): number {
  let totalCost = 0;

  if (dishIngredients) {
    for (const di of dishIngredients) {
      const ingredient = Array.isArray(di.ingredients) ? di.ingredients[0] : di.ingredients;
      if (!ingredient) continue;

      const ingredientQuantity = Number(di.quantity) || 0;
      const costPerUnit =
        Number(ingredient.cost_per_unit_incl_trim) || Number(ingredient.cost_per_unit) || 0;
      const ingredientCost = ingredientQuantity * costPerUnit;

      totalCost += ingredientCost;
    }
  }

  return totalCost;
}
