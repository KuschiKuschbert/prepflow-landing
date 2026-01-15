/**
 * Process dishes and recipes responses.
 */
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { Dish, Recipe } from '../../../../../types';

interface DishesApiResponse {
  success: boolean;
  dishes?: Dish[];
  message?: string;
  error?: string;
}

interface RecipesApiResponse {
  success: boolean;
  recipes?: Recipe[];
  message?: string;
  error?: string;
}

interface ProcessDishesAndRecipesParams {
  dishesData: DishesApiResponse;
  recipesData: RecipesApiResponse;
  dishesCacheKey: string;
  recipesCacheKey: string;
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

export function processDishesAndRecipes({
  dishesData,
  recipesData,
  dishesCacheKey,
  recipesCacheKey,
  setDishes,
  setRecipes,
}: ProcessDishesAndRecipesParams): void {
  if (dishesData.success) {
    const dishesList = dishesData.dishes || [];
    setDishes(dishesList);
    cacheData(dishesCacheKey, dishesList);
  } else {
    logger.warn('Failed to load dishes:', dishesData.error || dishesData.message);
    setDishes([]);
  }

  if (recipesData.success) {
    const recipesList = recipesData.recipes || [];
    setRecipes(recipesList);
    cacheData(recipesCacheKey, recipesList);
  } else {
    logger.warn('Failed to load recipes:', recipesData.error || recipesData.message);
    setRecipes([]);
  }
}
