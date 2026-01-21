export function calculateRecipesCost(dishRecipes: any[] | null): number {
  let totalCost = 0;

  if (dishRecipes) {
    for (const dr of dishRecipes) {
      const recipes = dr.recipes as Array<{
        recipe_ingredients: Array<{
          quantity: number;
          ingredients:
            | {
                cost_per_unit_incl_trim?: number;
                cost_per_unit?: number;
              }
            | Array<{
                cost_per_unit_incl_trim?: number;
                cost_per_unit?: number;
              }>;
        }>;
      }>;
      const recipe = Array.isArray(recipes) && recipes.length > 0 ? recipes[0] : null;
      if (!recipe || !recipe.recipe_ingredients) continue;

      const recipeQuantity = Number(dr.quantity) || 1;

      for (const ri of recipe.recipe_ingredients) {
        const ingredient = Array.isArray(ri.ingredients) ? ri.ingredients[0] : ri.ingredients;
        if (!ingredient) continue;

        const ingredientQuantity = Number(ri.quantity) || 0;
        const costPerUnit =
          Number(ingredient.cost_per_unit_incl_trim) || Number(ingredient.cost_per_unit) || 0;
        const ingredientCost = ingredientQuantity * costPerUnit;

        totalCost += ingredientCost * recipeQuantity;
      }
    }
  }

  return totalCost;
}
