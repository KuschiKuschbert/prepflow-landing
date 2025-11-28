import { COGSCalculation, RecipeIngredientWithDetails } from '../../types';

/**
 * Convert recipe ingredients to COGS calculation format
 */
export function convertToCOGSCalculations(
  recipeIngredients: RecipeIngredientWithDetails[],
  recipeId: string = 'temp',
): COGSCalculation[] {
  return recipeIngredients.map(ri => {
    const ingredient = ri.ingredients;
    // Parse quantity to handle string/number conversion
    const quantity =
      typeof ri.quantity === 'number' ? ri.quantity : parseFloat(String(ri.quantity)) || 0;
    const isConsumable = ingredient.category === 'Consumables';
    // Use cost_per_unit_incl_trim if available, otherwise cost_per_unit
    const baseCostPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
    const costPerUnit = baseCostPerUnit;
    const totalCost = quantity * costPerUnit;

    // For consumables: simple calculation (no waste/yield)
    if (isConsumable) {
      return {
        recipeId: ri.recipe_id || recipeId,
        ingredientId: ingredient.id,
        ingredientName: ingredient.ingredient_name,
        quantity: quantity,
        unit: ri.unit,
        costPerUnit: costPerUnit,
        totalCost: totalCost,
        wasteAdjustedCost: totalCost,
        yieldAdjustedCost: totalCost,
        isConsumable: true,
        // Legacy properties for compatibility
        id: ri.id,
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.ingredient_name,
        cost_per_unit: costPerUnit,
        total_cost: totalCost,
        supplier_name: ingredient.supplier_name,
        category: ingredient.category,
      };
    }

    // For regular ingredients: apply waste and yield adjustments
    const wastePercent = ingredient.trim_peel_waste_percentage || 0;
    const yieldPercent = ingredient.yield_percentage || 100;

    // Calculate waste-adjusted cost (if not already included in cost_per_unit_incl_trim)
    let wasteAdjustedCost = totalCost;
    if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
      wasteAdjustedCost = totalCost / (1 - wastePercent / 100);
    }

    // Calculate yield-adjusted cost (final cost per usable portion)
    const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

    return {
      recipeId: ri.recipe_id || recipeId,
      ingredientId: ingredient.id,
      ingredientName: ingredient.ingredient_name,
      quantity: quantity,
      unit: ri.unit,
      costPerUnit: costPerUnit,
      totalCost: totalCost,
      wasteAdjustedCost: wasteAdjustedCost,
      yieldAdjustedCost: yieldAdjustedCost,
      isConsumable: false,
      // Legacy properties for compatibility
      id: ri.id,
      ingredient_id: ingredient.id,
      ingredient_name: ingredient.ingredient_name,
      cost_per_unit: costPerUnit,
      total_cost: totalCost,
      supplier_name: ingredient.supplier_name,
      category: ingredient.category,
    };
  });
}
