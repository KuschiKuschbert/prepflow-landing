/**
 * Load unlocked menu data (full fetch, all 4 requests)
 */
import { logger } from '@/lib/logger';
import type { Dish, MenuItem, MenuStatistics, Recipe } from '@/lib/types/menu-builder';
import { handleStatistics } from './helpers/handleStatistics';
import { processDishesAndRecipes } from './helpers/processDishesAndRecipes';
import { processMenuResponse } from './helpers/processMenuResponse';

const MENU_DATA_FETCH_TIMEOUT_MS = 20_000;

interface LoadUnlockedMenuParams {
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

export async function loadUnlockedMenu({
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
}: LoadUnlockedMenuParams): Promise<void> {
  const fetchPromise = Promise.all([
    fetch(`/api/menus/${menuId}`, { cache: 'no-store' }),
    fetch('/api/dishes?pageSize=1000', { cache: 'no-store' }),
    fetch('/api/recipes?pageSize=1000', { cache: 'no-store' }),
    fetch(`/api/menus/${menuId}/statistics`, { cache: 'no-store' }),
  ]);

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('MENU_DATA_FETCH_TIMEOUT')), MENU_DATA_FETCH_TIMEOUT_MS);
  });

  const [menuResponse, dishesResponse, recipesResponse, statsResponse] = await Promise.race([
    fetchPromise,
    timeoutPromise,
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
    setLoading(false);
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

  logger.dev('[loadMenuData] Menu data loaded successfully', {
    menuId,
    menuItemsCount: (menuData?.menu?.items || menuData?.items || []).length,
    dishesCount: dishesData?.dishes?.length || 0,
    recipesCount: recipesData?.recipes?.length || 0,
  });
  setLoading(false);
}
