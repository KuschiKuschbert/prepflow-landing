import { COGSCalculation, RecipeIngredientWithDetails } from '../../types';

/**
 * Convert recipe ingredients to COGS calculation format
 */
export function convertToCOGSCalculations(
  recipeIngredients: RecipeIngredientWithDetails[],
): COGSCalculation[] {
  return recipeIngredients.map(ri => {
    const ingredient = ri.ingredients;
    const quantity = ri.quantity;
    const costPerUnit = ingredient.cost_per_unit;
    const totalCost = quantity * costPerUnit;

    // Apply waste and yield adjustments
    const wastePercent = ingredient.trim_peel_waste_percentage || 0;
    const yieldPercent = ingredient.yield_percentage || 100;
    const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
    const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

    return {
      id: ri.id,
      ingredient_id: ingredient.id,
      ingredientId: ingredient.id,
      ingredient_name: ingredient.ingredient_name,
      ingredientName: ingredient.ingredient_name,
      quantity: quantity,
      unit: ri.unit,
      cost_per_unit: costPerUnit,
      total_cost: totalCost,
      yieldAdjustedCost: yieldAdjustedCost,
      supplier_name: ingredient.supplier_name,
      category: ingredient.category,
    };
  });
}
