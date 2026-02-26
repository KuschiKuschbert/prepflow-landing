/**
 * Load locked menu data (Phase 1: menu only, Phase 2: background dishes/recipes/stats)
 */
import { logger } from '@/lib/logger';
import type { Dish, MenuItem, MenuStatistics, Recipe } from '@/lib/types/menu-builder';
import { handleStatistics } from './helpers/handleStatistics';
import { processDishesAndRecipes } from './helpers/processDishesAndRecipes';
import { processMenuResponse } from './helpers/processMenuResponse';

interface LoadLockedMenuParams {
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
  shouldUpdateState: () => boolean;
}

export async function loadLockedMenu({
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
  shouldUpdateState,
}: LoadLockedMenuParams): Promise<void> {
  const menuResponse = await fetch(`/api/menus/${menuId}?locked=1`, { cache: 'no-store' });
  const menuData = await menuResponse.json();

  const menuProcessed = processMenuResponse({
    menuResponse,
    menuData,
    menuId,
    menuCacheKey,
    statsData: {
      success: false,
      statistics: {
        total_items: 0,
        total_dishes: 0,
        total_recipes: 0,
        total_cogs: 0,
        total_revenue: 0,
        gross_profit: 0,
        average_profit_margin: 0,
        food_cost_percent: 0,
      },
    },
    setMenuItems,
    setCategories,
    onError,
  });
  if (!menuProcessed) {
    setLoading(false);
    return;
  }

  const actualMenuItems = menuData?.menu?.items || menuData?.items || [];
  logger.dev('[loadMenuData] Locked menu - Phase 1 complete, showing view', {
    menuId,
    menuItemsCount: actualMenuItems.length,
  });
  setLoading(false);

  const bgFetch = async () => {
    try {
      const [dishesResponse, recipesResponse, statsResponse] = await Promise.all([
        fetch('/api/dishes/catalog', { cache: 'no-store' }),
        fetch('/api/recipes/catalog', { cache: 'no-store' }),
        fetch(`/api/menus/${menuId}/statistics`, { cache: 'no-store' }),
      ]);
      const dishesData = await dishesResponse.json();
      const recipesData = await recipesResponse.json();
      const statsData = await statsResponse.json();

      if (!shouldUpdateState()) return;

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
    } catch (bgErr) {
      logger.warn('[loadMenuData] Background fetch failed (non-blocking)', {
        menuId,
        error: bgErr instanceof Error ? bgErr.message : String(bgErr),
      });
    }
  };
  void bgFetch();
}
