/**
 * Process recipe ingredients into COGS calculations.
 */
import { createCalculation } from '../../../../../cogs/hooks/utils/createCalculation';
import type { COGSCalculation, Ingredient } from '@/lib/types/recipes';
import type { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';

export function processRecipeIngredients(
  recipeIngredients: RecipeIngredientWithDetails[],
  recipe: Recipe,
  ingredients: Ingredient[],
  convertIngredientQuantity: (
    quantity: number,
    fromUnit: string,
    toUnit: string,
  ) => { convertedQuantity: number; convertedUnit: string; conversionNote?: string },
): COGSCalculation[] {
  const recipeYield = recipe.yield || 1;
  return recipeIngredients
    .map(ri => {
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
        recipe.id,
      );
    })
    .filter(Boolean) as COGSCalculation[];
}
