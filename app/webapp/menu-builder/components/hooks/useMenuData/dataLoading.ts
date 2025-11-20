/**
 * Data loading utilities for menu data.
 */
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
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
}: LoadMenuDataProps): Promise<void> {
  setLoading(true);
  try {
    const [menuResponse, dishesResponse, recipesResponse, statsResponse] = await Promise.all([
      fetch(`/api/menus/${menuId}`),
      fetch('/api/dishes?pageSize=1000'),
      fetch('/api/recipes?pageSize=1000'),
      fetch(`/api/menus/${menuId}/statistics`),
    ]);
    const menuData = await menuResponse.json();
    const dishesData = await dishesResponse.json();
    const recipesData = await recipesResponse.json();
    const statsData = await statsResponse.json();

    if (!menuResponse.ok) {
      logger.error('Failed to load menu:', {
        error: menuData.error || menuData.message,
        status: menuResponse.status,
        menuId,
        fullResponse: menuData,
      });
      onError?.(`Failed to load menu: ${menuData.error || menuData.message || 'Unknown error'}`);
      return;
    }
    if (menuData.success) {
      const items = menuData.menu.items || [];
      setMenuItems(items);
      const uniqueCategories = Array.from(
        new Set(items.map((item: MenuItem) => item.category || 'Uncategorized')),
      ) as string[];
      const finalCategories = uniqueCategories.length > 0 ? uniqueCategories : ['Uncategorized'];
      setCategories(finalCategories);
      cacheData(menuCacheKey, {
        menuItems: items,
        categories: finalCategories,
        statistics: statsData.success ? statsData.statistics : null,
      });
    }

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

    if (statsResponse.ok && statsData.success) {
      setStatistics(statsData.statistics);
      const currentCached = getCachedData<{
        menuItems: MenuItem[];
        categories: string[];
        statistics: MenuStatistics | null;
      }>(menuCacheKey);
      if (currentCached)
        cacheData(menuCacheKey, { ...currentCached, statistics: statsData.statistics });
    } else {
      if (statsResponse.status !== 404) {
        logger.warn('[Menu Data Loading] Failed to load statistics', {
          status: statsResponse.status,
          error: statsData.error || statsData.message,
          menuId,
        });
      }
      setStatistics({
        total_items: 0,
        total_dishes: 0,
        total_recipes: 0,
        total_cogs: 0,
        total_revenue: 0,
        gross_profit: 0,
        average_profit_margin: 0,
        food_cost_percent: 0,
      });
    }
  } catch (err) {
    logger.error('Failed to load menu data:', err);
  } finally {
    setLoading(false);
  }
}
