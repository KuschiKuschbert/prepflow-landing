/**
 * Initialize state from cache.
 */
import { getCachedData } from '@/lib/cache/data-cache';
import type { Dish, MenuItem, MenuStatistics, Recipe } from '../../../../types';

interface InitializeStateParams {
  menuCacheKey: string;
  dishesCacheKey: string;
  recipesCacheKey: string;
}

interface InitializedState {
  menuItems: MenuItem[];
  dishes: Dish[];
  recipes: Recipe[];
  categories: string[];
  statistics: MenuStatistics | null;
  loading: boolean;
}

export function initializeState({
  menuCacheKey,
  dishesCacheKey,
  recipesCacheKey,
}: InitializeStateParams): InitializedState {
  const cachedMenuData = getCachedData<{
    menuItems: MenuItem[];
    categories: string[];
    statistics: MenuStatistics | null;
  }>(menuCacheKey);
  const cachedDishes = getCachedData<Dish[]>(dishesCacheKey);
  const cachedRecipes = getCachedData<Recipe[]>(recipesCacheKey);

  return {
    menuItems: cachedMenuData?.menuItems || [],
    dishes: cachedDishes || [],
    recipes: cachedRecipes || [],
    categories: cachedMenuData?.categories || ['Uncategorized'],
    statistics: cachedMenuData?.statistics || null,
    loading: !cachedMenuData && !cachedDishes && !cachedRecipes,
  };
}
