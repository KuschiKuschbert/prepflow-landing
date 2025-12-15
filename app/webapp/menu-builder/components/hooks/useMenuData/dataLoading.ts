/**
 * Data loading utilities for menu data.
 */
import { logger } from '@/lib/logger';
import { clearLoadingIfNeeded, setLoadingIfNeeded, shouldShowLoading } from './helpers/handleLoadingState';
import { handleStatistics } from './helpers/handleStatistics';
import { processDishesAndRecipes } from './helpers/processDishesAndRecipes';
import { processMenuResponse } from './helpers/processMenuResponse';
import type { Dish, MenuItem, MenuStatistics, Recipe } from '../../../types';

interface LoadMenuDataProps {
  menuId: string;
  menuCacheKey: string;
  dishesCacheKey: string;
  recipesCacheKey: string;
  onError?: (message: string) => void;
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setStatistics: React.Dispatch<React.SetStateAction<MenuStatistics | null>>;
  setLoading: (loading: boolean) => void;
  showLoading?: boolean; // Whether to show loading state (default: true)
}

/**
 * Load menu data from API.
 */
export async function loadMenuData({
  menuId,
  menuCacheKey,
  dishesCacheKey,
  recipesCacheKey,
  onError,
  setMenuItems,
  setDishes,
  setRecipes,
  setCategories,
  setStatistics,
  setLoading,
  showLoading = true,
}: LoadMenuDataProps): Promise<void> {
  setLoadingIfNeeded({ menuCacheKey, dishesCacheKey, recipesCacheKey, showLoading, setLoading });
  try {
    const [menuResponse, dishesResponse, recipesResponse, statsResponse] = await Promise.all([
      fetch(`/api/menus/${menuId}`, { cache: 'no-store' }),
      fetch('/api/dishes?pageSize=1000', { cache: 'no-store' }),
      fetch('/api/recipes?pageSize=1000', { cache: 'no-store' }),
      fetch(`/api/menus/${menuId}/statistics`, { cache: 'no-store' }),
    ]);
    const menuData = await menuResponse.json();
    const dishesData = await dishesResponse.json();
    const recipesData = await recipesResponse.json();
    const statsData = await statsResponse.json();

    const menuProcessed = processMenuResponse({
      menuResponse,
      menuData,
      menuId,
      menuCacheKey,
      statsData,
      setMenuItems,
      setCategories,
      onError,
    });
    if (!menuProcessed) {
      clearLoadingIfNeeded({ menuCacheKey, dishesCacheKey, recipesCacheKey, showLoading, setLoading });
      return;
    }

    processDishesAndRecipes({
      dishesData,
      recipesData,
      dishesCacheKey,
      recipesCacheKey,
      setDishes,
      setRecipes,
    });

    handleStatistics({
      statsResponse,
      statsData,
      menuId,
      menuCacheKey,
      setStatistics,
    });
  } catch (err) {
    logger.error('Failed to load menu data:', err);
    clearLoadingIfNeeded({ menuCacheKey, dishesCacheKey, recipesCacheKey, showLoading, setLoading });
  } finally {
    clearLoadingIfNeeded({ menuCacheKey, dishesCacheKey, recipesCacheKey, showLoading, setLoading });
  }
}
