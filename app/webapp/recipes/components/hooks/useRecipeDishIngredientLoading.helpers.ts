import { COGSCalculation } from '../../../cogs/types';
import { createCalculation } from '../../../cogs/hooks/utils/createCalculation';
import { logger } from '@/lib/logger';
import {
  LoadRecipeIngredientsParams,
  LoadDishIngredientsParams,
} from './useRecipeDishIngredientLoading.helpers.types';

export async function loadRecipeIngredients({
  recipeId,
  allRecipes,
  ingredients,
  convertIngredientQuantity,
}: LoadRecipeIngredientsParams): Promise<COGSCalculation[]> {
  const response = await fetch(`/api/recipes/${recipeId}/ingredients`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to fetch recipe ingredients: ${response.statusText}`);
  const data = await response.json();
  const recipeIngredients = data.items || [];
  const recipe = allRecipes.find(r => r.id === recipeId);
  const recipeYield = recipe?.yield || 1;
  return recipeIngredients
    .map((ri: any) => {
      const ingredientData = ingredients.find(ing => ing.id === ri.ingredient_id);
      if (!ingredientData) return null;
      const { convertedQuantity, convertedUnit, conversionNote } = convertIngredientQuantity(
        ri.quantity / recipeYield,
        ri.unit,
        ingredientData.unit || 'kg',
      );
      return createCalculation(
        ri.ingredient_id,
        ingredientData,
        convertedQuantity,
        convertedUnit,
        conversionNote || '',
        recipeId,
      );
    })
    .filter(Boolean) as COGSCalculation[];
}

export async function loadDishIngredients({
  dishId,
  recipes,
  ingredients,
  convertIngredientQuantity,
}: LoadDishIngredientsParams): Promise<COGSCalculation[]> {
  const response = await fetch(`/api/dishes/${dishId}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to fetch dish: ${response.statusText}`);
  const data = await response.json();
  if (!data.success || !data.dish) {
    logger.warn('[loadDishIngredients] Dish not found or invalid response', { dishId, data });
    return [];
  }
  const dishRecipes = data.dish.recipes || [];
  const dishIngredients = data.dish.ingredients || [];

  logger.dev('[loadDishIngredients] Fetched dish data', {
    dishId,
    dishRecipesCount: dishRecipes.length,
    dishIngredientsCount: dishIngredients.length,
    dishRecipes: dishRecipes,
    dishIngredients: dishIngredients,
    availableIngredientsCount: ingredients.length,
    availableRecipesCount: recipes.length,
  });

  const allCalculations: COGSCalculation[] = [];
  const processIngredient = (ingId: string, qty: number, unit: string) => {
    const ingredientData = ingredients.find(ing => ing.id === ingId);
    if (!ingredientData) return;
    const { convertedQuantity, convertedUnit, conversionNote } = convertIngredientQuantity(
      qty,
      unit,
      ingredientData.unit || 'kg',
    );
    allCalculations.push(
      createCalculation(
        ingId,
        ingredientData,
        convertedQuantity,
        convertedUnit,
        conversionNote || '',
        dishId,
      ),
    );
  };
  dishIngredients.forEach((di: { ingredient_id: string; quantity: number; unit: string }) =>
    processIngredient(di.ingredient_id, di.quantity, di.unit),
  );
  for (const dr of dishRecipes) {
    const recipe = recipes.find(r => r.id === dr.recipe_id);
    if (!recipe) continue;
    const recipeResponse = await fetch(`/api/recipes/${recipe.id}/ingredients`, {
      cache: 'no-store',
    });
    const recipeData = await recipeResponse.json();
    const recipeYield = recipe.yield || 1;
    const quantity = dr.quantity || 1;
    (recipeData.items || []).forEach(
      (ri: { ingredient_id: string; quantity: number; unit: string }) =>
        processIngredient(ri.ingredient_id, (ri.quantity / recipeYield) * quantity, ri.unit),
    );
  }
  return allCalculations;
}
