import { convertIngredientCost } from '@/lib/unit-conversion';
import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../types';

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
 * Calculate recommended selling price with 30% food cost target and charm pricing
 */
export function calculateRecommendedPrice(totalCostPerServing: number): RecipePriceData {
  const targetFoodCostPercent = 30;
  const recommendedPrice = totalCostPerServing / (targetFoodCostPercent / 100);
  const charmPrice = Math.floor(recommendedPrice) + 0.95;

  // Calculate GST-exclusive price (10% GST in Australia)
  const gstRate = 0.1;
  const priceExclGST = charmPrice / (1 + gstRate);

  // Calculate contributing margin (Revenue excl GST - Food Cost)
  const contributingMargin = priceExclGST - totalCostPerServing;
  const contributingMarginPercent = (contributingMargin / priceExclGST) * 100;

  return {
    cost_per_serving: totalCostPerServing,
    recommendedPrice: charmPrice,
    foodCostPercent: (totalCostPerServing / charmPrice) * 100,
    selling_price: charmPrice,
    gross_profit: charmPrice - totalCostPerServing,
    gross_profit_margin: ((charmPrice - totalCostPerServing) / charmPrice) * 100,
    contributingMargin: contributingMargin,
    contributingMarginPercent: contributingMarginPercent,
  };
}

/**
 * Calculate price data for a single recipe
 */
export function calculateRecipePrice(
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
): RecipePriceData | null {
  if (!ingredients || ingredients.length === 0) return null;

  const totalCost = calculateTotalCostPerServing(ingredients);
  return calculateRecommendedPrice(totalCost);
}
