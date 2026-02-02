import { convertIngredientCost } from '@/lib/unit-conversion';
import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '@/lib/types/recipes';

/**
 * Calculate the total cost per serving for a recipe
 */
export function calculateTotalCostPerServing(ingredients: RecipeIngredientWithDetails[]): number {
  let totalCostPerServing = 0;

  ingredients.forEach(ri => {
    const ingredient = ri.ingredients;
    const quantity = ri.quantity;
    const baseCostPerUnit = ingredient.cost_per_unit;
    const costPerUnit = convertIngredientCost(
      baseCostPerUnit,
      ingredient.unit || 'g',
      ri.unit || 'g',
      ri.quantity,
    );
    const wastePercent = ingredient.trim_peel_waste_percentage || 0;
    const yieldPercent = ingredient.yield_percentage || 100;

    const baseCost = quantity * costPerUnit;
    const wasteAdjustedCost = baseCost * (1 + wastePercent / 100);
    const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

    totalCostPerServing += yieldAdjustedCost;
  });

  return totalCostPerServing;
}

/**
 * Calculate recommended selling price matching COGS module calculation
 * Uses 70% gross profit target (equals 30% food cost) with charm pricing
 */
export function calculateRecommendedPrice(totalCostPerServing: number): RecipePriceData {
  const targetGrossProfit = 70; // 70% gross profit = 30% food cost
  const gstRate = 0.1;

  // Calculate GST-exclusive price first (matching COGS method)
  const sellPriceExclGST = totalCostPerServing / (1 - targetGrossProfit / 100);
  const gstAmount = sellPriceExclGST * gstRate;
  const sellPriceInclGST = sellPriceExclGST + gstAmount;

  // Apply charm pricing: Math.ceil() - 0.01 (matching COGS method)
  const finalPriceInclGST = Math.ceil(sellPriceInclGST) - 0.01;

  // Recalculate GST-exclusive from final price (matching COGS method)
  const finalPriceExclGST = finalPriceInclGST / (1 + gstRate);
  const _finalGstAmount = finalPriceInclGST - finalPriceExclGST;

  // Calculate contributing margin (Revenue excl GST - Food Cost)
  const contributingMargin = finalPriceExclGST - totalCostPerServing;
  const contributingMarginPercent = (contributingMargin / finalPriceExclGST) * 100;

  return {
    cost_per_serving: totalCostPerServing,
    recommendedPrice: finalPriceInclGST,
    foodCostPercent: (totalCostPerServing / finalPriceInclGST) * 100,
    selling_price: finalPriceInclGST,
    gross_profit: finalPriceExclGST - totalCostPerServing,
    gross_profit_margin: ((finalPriceExclGST - totalCostPerServing) / finalPriceExclGST) * 100,
    contributingMargin: contributingMargin,
    contributingMarginPercent: contributingMarginPercent,
  };
}

/**
 * Calculate price data for a single recipe
 * All metrics are calculated per single serving/portion
 */
export function calculateRecipePrice(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
): RecipePriceData | null {
  if (!ingredients || ingredients.length === 0) return null;

  // Calculate total cost for the entire recipe
  const totalCostForRecipe = calculateTotalCostPerServing(ingredients);

  // Divide by recipe yield to get cost per single serving
  const recipeYield = recipe.yield || 1;
  const costPerSingleServing = totalCostForRecipe / recipeYield;

  // Calculate all pricing metrics per single serving
  return calculateRecommendedPrice(costPerSingleServing);
}
