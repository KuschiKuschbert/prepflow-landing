import { logger } from '@/lib/logger';
import { IngredientData } from '../../useIngredientData';

export async function fetchRecipeIngredients(recipeId: string): Promise<IngredientData[]> {
  const response = await fetch(`/api/recipes/${recipeId}/ingredients`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch recipe ingredients');
  }

  if (!data.items || !Array.isArray(data.items)) {
    logger.warn('[IngredientPopover] Recipe ingredients API returned no items', {
      recipeId,
      responseData: data,
    });
    return [];
  }

  return data.items.map((item: any) => {
    const ingredient = item.ingredients;

    const ingredientData: IngredientData = {
      id: item.ingredient_id || ingredient?.id,
      ingredient_name: ingredient?.ingredient_name || 'Unknown',
      brand: ingredient?.brand || undefined,
      quantity: item.quantity,
      unit: item.unit,
      allergens: Array.isArray(ingredient?.allergens) ? ingredient.allergens : [],
      allergen_source: ingredient?.allergen_source || undefined,
    };

    if (!ingredient?.ingredient_name) {
      logger.warn('[IngredientPopover] Recipe ingredient missing ingredient_name', {
        recipeId,
        ingredientId: ingredient?.id || item.ingredient_id,
      });
    }

    return ingredientData;
  });
}
