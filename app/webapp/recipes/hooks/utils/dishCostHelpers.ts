interface RecipeIngredient {
  quantity: number | string;
  unit: string;
  ingredients: {
    cost_per_unit?: number;
    cost_per_unit_incl_trim?: number;
  } | null;
}

interface SelectedRecipe {
  recipe_id: string;
  quantity: number;
}

interface SelectedIngredient {
  ingredient_id: string;
  quantity: number;
}

interface Ingredient {
  id: string;
  cost_per_unit?: number;
  cost_per_unit_incl_trim?: number;
}

export function calculateRecipeCost(
  recipeIngredients: RecipeIngredient[],
  recipeQuantity: number,
): number {
  let cost = 0;
  recipeIngredients.forEach(ri => {
    const ingredient = ri.ingredients;
    if (ingredient) {
      const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
      const quantity = typeof ri.quantity === 'string' ? parseFloat(ri.quantity) : ri.quantity || 0;
      const qty =
        typeof recipeQuantity === 'string' ? parseFloat(recipeQuantity) : recipeQuantity || 1;
      cost += quantity * qty * costPerUnit;
    }
  });
  return cost;
}

export function calculateStandaloneIngredientCost(
  selectedIngredients: SelectedIngredient[],
  ingredients: Ingredient[],
): number {
  let cost = 0;
  selectedIngredients.forEach(si => {
    const ingredient = ingredients.find(i => i.id === si.ingredient_id);
    if (ingredient) {
      const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
      cost += costPerUnit * si.quantity;
    }
  });
  return cost;
}

export function calculateRecommendedPrice(totalCost: number): {
  recommendedPrice: number;
  foodCostPercent: number;
  grossProfit: number;
  grossProfitMargin: number;
} {
  const targetFoodCostPercent = 30;
  const recommendedPrice = totalCost / (targetFoodCostPercent / 100);
  const charmPrice = Math.floor(recommendedPrice) + 0.95;

  const grossProfit = charmPrice - totalCost;
  const grossProfitMargin = charmPrice > 0 ? (grossProfit / charmPrice) * 100 : 0;
  const foodCostPercent = charmPrice > 0 ? (totalCost / charmPrice) * 100 : 0;

  return {
    recommendedPrice: charmPrice,
    foodCostPercent,
    grossProfit,
    grossProfitMargin,
  };
}
