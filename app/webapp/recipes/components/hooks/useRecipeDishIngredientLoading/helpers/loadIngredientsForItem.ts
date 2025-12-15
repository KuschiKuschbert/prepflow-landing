/**
 * Load ingredients for a recipe or dish item.
 */
import type { COGSCalculation, Ingredient } from '../../../../cogs/types';
import type { Recipe } from '../../../types';
import {
  loadDishIngredients,
  loadRecipeIngredients,
} from '../../useRecipeDishIngredientLoading.helpers';
import type { RecipeDishItem } from '../useRecipeDishEditorData';

interface LoadIngredientsForItemParams {
  selectedItem: RecipeDishItem;
  allRecipes: Recipe[];
  recipes: Recipe[];
  ingredients: Ingredient[];
  convertIngredientQuantity: (
    quantity: number,
    fromUnit: string,
    toUnit: string,
  ) => { convertedQuantity: number; convertedUnit: string; conversionNote?: string };
}

export async function loadIngredientsForItem({
  selectedItem,
  allRecipes,
  recipes,
  ingredients,
  convertIngredientQuantity,
}: LoadIngredientsForItemParams): Promise<COGSCalculation[]> {
  if (selectedItem.type === 'recipe') {
    return loadRecipeIngredients({
      recipeId: selectedItem.id,
      allRecipes,
      ingredients,
      convertIngredientQuantity,
    });
  }
  return loadDishIngredients({
    dishId: selectedItem.id,
    recipes,
    ingredients,
    convertIngredientQuantity,
  });
}
