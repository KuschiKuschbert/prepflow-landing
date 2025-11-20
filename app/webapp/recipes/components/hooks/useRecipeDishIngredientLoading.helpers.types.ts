import { Recipe } from '../../types';
import { Ingredient } from '../../../cogs/types';

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
