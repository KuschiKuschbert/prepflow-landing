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
      // Use single portion cost (quantity = 1) regardless of recipeQuantity
      cost += quantity * costPerUnit;
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
  const targetGrossProfit = 70; // 70% gross profit = 30% food cost
  const gstRate = 0.1;

  // Calculate GST-exclusive price first (matching COGS method)
  const sellPriceExclGST = totalCost / (1 - targetGrossProfit / 100);
  const gstAmount = sellPriceExclGST * gstRate;
  const sellPriceInclGST = sellPriceExclGST + gstAmount;

  // Apply charm pricing: Math.ceil() - 0.01 (matching COGS method)
  const finalPriceInclGST = Math.ceil(sellPriceInclGST) - 0.01;

  // Recalculate GST-exclusive from final price (matching COGS method)
  const finalPriceExclGST = finalPriceInclGST / (1 + gstRate);

  const grossProfit = finalPriceExclGST - totalCost;
  const grossProfitMargin = finalPriceExclGST > 0 ? (grossProfit / finalPriceExclGST) * 100 : 0;
  const foodCostPercent = finalPriceInclGST > 0 ? (totalCost / finalPriceInclGST) * 100 : 0;

  return {
    recommendedPrice: finalPriceInclGST,
    foodCostPercent,
    grossProfit,
    grossProfitMargin,
  };
}
