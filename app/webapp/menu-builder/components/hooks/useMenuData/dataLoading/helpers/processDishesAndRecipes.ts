/**
 * Process dishes and recipes responses.
 */
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';

interface ProcessDishesAndRecipesParams {
  dishesData: any;
  recipesData: any;
  dishesCacheKey: string;
  recipesCacheKey: string;
  setDishes: React.Dispatch<React.SetStateAction<any[]>>;
  setRecipes: React.Dispatch<React.SetStateAction<any[]>>;
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
