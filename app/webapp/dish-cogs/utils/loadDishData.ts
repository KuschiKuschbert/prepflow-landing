import { DishCOGSCalculation, Dish } from '../types';
import {
  calculateRecipeIngredientCost,
  calculateStandaloneIngredientCost,
} from './dishCogsCalculationHelpers';

export async function loadDishData(dish: Dish): Promise<DishCOGSCalculation[]> {
  try {
    const response = await fetch(`/api/dishes/${dish.id}`);
    const data = await response.json();

    if (!data.success || !data.dish) {
      return [];
    }

    const dishData = data.dish;
    const newCalculations: DishCOGSCalculation[] = [];

    // Process recipes
    if (dishData.recipes && Array.isArray(dishData.recipes)) {
      for (const dishRecipe of dishData.recipes) {
        const recipeId = dishRecipe.recipe_id;
        const recipeQuantity = parseFloat(dishRecipe.quantity) || 1;

        // Fetch recipe ingredients
        const ingredientsResponse = await fetch(`/api/recipes/${recipeId}/ingredients`);
        const ingredientsData = await ingredientsResponse.json();

        if (ingredientsData.items && Array.isArray(ingredientsData.items)) {
          for (const ri of ingredientsData.items) {
            const calc = calculateRecipeIngredientCost(
              ri,
              recipeId,
              dishRecipe.recipes?.name || 'Unknown',
              recipeQuantity,
            );
            if (calc) newCalculations.push(calc);
          }
        }
      }
    }

    // Process standalone ingredients
    if (dishData.ingredients && Array.isArray(dishData.ingredients)) {
      for (const di of dishData.ingredients) {
        const calc = calculateStandaloneIngredientCost(di);
        if (calc) newCalculations.push(calc);
      }
    }

    return newCalculations;
  } catch (err) {
    console.error('Failed to load dish data:', err);
    return [];
  }
}
