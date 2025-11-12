import { COGSCalculation, Ingredient } from '../../types';

export function createCalculation(
  ingredientId: string,
  ingredientData: Ingredient,
  convertedQuantity: number,
  convertedUnit: string,
  conversionNote: string,
  selectedRecipe: string | null,
): COGSCalculation {
  const baseCostPerUnit =
    ingredientData.cost_per_unit_incl_trim || ingredientData.cost_per_unit || 0;
  const totalCost = convertedQuantity * baseCostPerUnit;
  const wastePercent = ingredientData.trim_peel_waste_percentage || 0;
  const yieldPercent = ingredientData.yield_percentage || 100;
  const wasteAdjusted = totalCost * (1 + wastePercent / 100);
  const yieldAdjusted = wasteAdjusted / (yieldPercent / 100);
  const ingredientNameWithNote = ingredientData.ingredient_name + conversionNote;
  return {
    recipeId: selectedRecipe || 'temp',
    ingredientId,
    ingredientName: ingredientNameWithNote,
    quantity: convertedQuantity,
    unit: convertedUnit,
    costPerUnit: baseCostPerUnit,
    totalCost,
    wasteAdjustedCost: wasteAdjusted,
    yieldAdjustedCost: yieldAdjusted,
    ingredient_id: ingredientId,
    ingredient_name: ingredientNameWithNote,
    cost_per_unit: baseCostPerUnit,
    total_cost: totalCost,
  };
}
