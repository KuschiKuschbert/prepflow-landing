import { Recipe } from '@/lib/types/recipes';
import { Ingredient } from '@/lib/types/recipes';

export interface ConvertQuantityFn {
  (
    qty: number,
    fromUnit: string,
    toUnit: string,
  ): { convertedQuantity: number; convertedUnit: string; conversionNote?: string };
}

export interface LoadRecipeIngredientsParams {
  recipeId: string;
  allRecipes: Recipe[];
  ingredients: Ingredient[];
  convertIngredientQuantity: ConvertQuantityFn;
}

export interface LoadDishIngredientsParams {
  dishId: string;
  recipes: Recipe[];
  ingredients: Ingredient[];
  convertIngredientQuantity: ConvertQuantityFn;
}
