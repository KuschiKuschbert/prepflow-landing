import { convertIngredientCost } from '@/lib/unit-conversion';
import { COGSCalculation, RecipeIngredient } from '../../types';

type ApiIngredientItem = {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    unit: string;
    trim_peel_waste_percentage: number;
    yield_percentage: number;
  };
};

export function mapApiItemsToCalculations(
  items: ApiIngredientItem[],
  recipeId: string,
): COGSCalculation[] {
  return items.map(item => {
    const ing = item.ingredients;
    const costPerUnit = convertIngredientCost(
      ing.cost_per_unit || 0,
      ing.unit || 'g',
      item.unit || 'g',
      item.quantity,
    );
    const totalCost = item.quantity * costPerUnit;
    const wastePercent = ing.trim_peel_waste_percentage || 0;
    const yieldPercent = ing.yield_percentage || 100;
    const wasteAdjusted = totalCost * (1 + wastePercent / 100);
    return {
      recipeId: item.recipe_id || recipeId,
      ingredientId: ing.id,
      ingredientName: ing.ingredient_name,
      quantity: item.quantity,
      unit: item.unit,
      costPerUnit,
      totalCost,
      wasteAdjustedCost: wasteAdjusted,
      yieldAdjustedCost: wasteAdjusted / (yieldPercent / 100),
      id: item.id,
      ingredient_id: ing.id,
      ingredient_name: ing.ingredient_name,
      cost_per_unit: costPerUnit,
      total_cost: totalCost,
    };
  });
}

export function mapApiItemsToRecipeIngredients(
  items: ApiIngredientItem[],
  recipeId: string,
): RecipeIngredient[] {
  return items.map(item => ({
    id: item.id,
    recipe_id: item.recipe_id || recipeId,
    ingredient_id: item.ingredients.id,
    ingredient_name: item.ingredients.ingredient_name,
    quantity: item.quantity,
    unit: item.unit,
    cost_per_unit: item.ingredients.cost_per_unit || 0,
    total_cost: item.quantity * (item.ingredients.cost_per_unit || 0),
  }));
}
