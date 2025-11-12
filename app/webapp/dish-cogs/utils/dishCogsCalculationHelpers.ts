import { convertIngredientCost } from '@/lib/unit-conversion';
import { DishCOGSCalculation } from '../types';

interface RecipeIngredient {
  ingredient_id: string;
  quantity: number | string;
  unit: string;
  ingredients: {
    ingredient_name?: string;
    unit?: string;
    cost_per_unit?: number;
    cost_per_unit_incl_trim?: number;
    trim_peel_waste_percentage?: number;
    yield_percentage?: number;
  } | null;
}

interface DishIngredient {
  ingredient_id: string;
  quantity: number | string;
  unit: string;
  ingredients: {
    ingredient_name?: string;
    unit?: string;
    cost_per_unit?: number;
    cost_per_unit_incl_trim?: number;
    trim_peel_waste_percentage?: number;
    yield_percentage?: number;
  } | null;
}

export function calculateRecipeIngredientCost(
  ri: RecipeIngredient,
  recipeId: string,
  recipeName: string,
  recipeQuantity: number,
): DishCOGSCalculation | null {
  const ingredient = ri.ingredients;
  if (!ingredient) return null;

  const baseCostPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
  const qty = typeof ri.quantity === 'string' ? parseFloat(ri.quantity) : ri.quantity;
  const costPerUnit = convertIngredientCost(
    baseCostPerUnit,
    ingredient.unit || 'g',
    ri.unit || 'g',
    qty,
  );

  const quantity = typeof ri.quantity === 'string' ? parseFloat(ri.quantity) : ri.quantity || 0;
  const totalQuantity = quantity * recipeQuantity;
  const totalCost = totalQuantity * costPerUnit;

  const wastePercent = ingredient.trim_peel_waste_percentage || 0;
  const yieldPercent = ingredient.yield_percentage || 100;
  const wasteAdjustedCost =
    !ingredient.cost_per_unit_incl_trim && wastePercent > 0
      ? totalCost / (1 - wastePercent / 100)
      : totalCost;
  const yieldAdjustedCost = wasteAdjustedCost * (yieldPercent / 100);

  return {
    source: 'recipe',
    recipeId,
    recipeName,
    recipeQuantity,
    ingredientId: ri.ingredient_id,
    ingredientName: ingredient.ingredient_name || 'Unknown',
    quantity: totalQuantity,
    unit: ri.unit || ingredient.unit || 'g',
    costPerUnit,
    totalCost,
    wasteAdjustedCost,
    yieldAdjustedCost,
  };
}

export function calculateStandaloneIngredientCost(di: DishIngredient): DishCOGSCalculation | null {
  const ingredient = di.ingredients;
  if (!ingredient) return null;

  const baseCostPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
  const qty = typeof di.quantity === 'string' ? parseFloat(di.quantity) : di.quantity;
  const costPerUnit = convertIngredientCost(
    baseCostPerUnit,
    ingredient.unit || 'g',
    di.unit || 'g',
    qty,
  );

  const quantity = typeof di.quantity === 'string' ? parseFloat(di.quantity) : di.quantity || 0;
  const totalCost = quantity * costPerUnit;

  const wastePercent = ingredient.trim_peel_waste_percentage || 0;
  const yieldPercent = ingredient.yield_percentage || 100;
  const wasteAdjustedCost =
    !ingredient.cost_per_unit_incl_trim && wastePercent > 0
      ? totalCost / (1 - wastePercent / 100)
      : totalCost;
  const yieldAdjustedCost = wasteAdjustedCost * (yieldPercent / 100);

  return {
    source: 'ingredient',
    ingredientId: di.ingredient_id,
    ingredientName: ingredient.ingredient_name || 'Unknown',
    quantity,
    unit: di.unit || ingredient.unit || 'g',
    costPerUnit,
    totalCost,
    wasteAdjustedCost,
    yieldAdjustedCost,
  };
}
