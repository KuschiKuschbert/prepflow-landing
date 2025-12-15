/**
 * Fetch Recipe Ingredients Helper
 * Fetches ingredients from a recipe and adds them to the ingredients list
 */

import { logger } from '@/lib/logger';
import { IngredientData } from '../../useIngredientData';

export async function fetchRecipeIngredients(
  recipeId: string,
  allIngredients: IngredientData[],
): Promise<void> {
  try {
    const recipeResponse = await fetch(`/api/recipes/${recipeId}/ingredients`);
    const recipeData = await recipeResponse.json();
    if (recipeData.items && Array.isArray(recipeData.items)) {
      recipeData.items.forEach((ri: any) => {
        const ingredient = ri.ingredients;
        if (ingredient) {
          const existingIndex = allIngredients.findIndex(ing => ing.id === ingredient.id);
          if (existingIndex === -1) {
            const ingredientData: IngredientData = {
              id: ingredient.id,
              ingredient_name: ingredient.ingredient_name || 'Unknown',
              brand: ingredient.brand || undefined,
              quantity: ri.quantity,
              unit: ri.unit,
              allergens: Array.isArray(ingredient.allergens) ? ingredient.allergens : [],
              allergen_source: ingredient.allergen_source || undefined,
            };

            if (!ingredient.ingredient_name) {
              logger.warn('[IngredientPopover] Recipe ingredient missing ingredient_name', {
                recipeId,
                ingredientId: ingredient.id,
              });
            }

            allIngredients.push(ingredientData);
          }
        }
      });
    }
  } catch (err) {
    logger.error(`[IngredientPopover] Error fetching recipe ingredients:`, err);
  }
}
