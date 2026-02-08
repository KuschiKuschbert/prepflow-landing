/**
 * Data loading utilities for menu data.
 */
import { logger } from '@/lib/logger';
import type { Dish, MenuItem, MenuStatistics, Recipe } from '@/lib/types/menu-builder';
import { setLoadingIfNeeded } from './dataLoading/helpers/handleLoadingState';
import { handleStatistics } from './dataLoading/helpers/handleStatistics';
import { processDishesAndRecipes } from './dataLoading/helpers/processDishesAndRecipes';
import { processMenuResponse } from './dataLoading/helpers/processMenuResponse';

/** Timeout in ms for menu data fetch; prevents infinite skeleton when a request hangs. */
const MENU_DATA_FETCH_TIMEOUT_MS = 20_000;

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
 * Uses a timeout so the UI never stays stuck on the loading skeleton if a request hangs.
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
  logger.dev('[loadMenuData] Starting menu data load', {
    menuId,
    menuCacheKey,
    showLoading,
    timestamp: new Date().toISOString(),
  });

  setLoadingIfNeeded({ menuCacheKey, dishesCacheKey, recipesCacheKey, showLoading, setLoading });

  const clearLoading = () => {
    // Always clear loading state, regardless of cache
    // The showLoading flag only controls whether we show loading initially, not whether we clear it
    logger.dev('[loadMenuData] clearLoading() called', { menuId });
    setLoading(false);
    logger.dev('[loadMenuData] Loading state cleared via clearLoading()', { menuId });
  };

  try {
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
      logger.dev('[loadMenuData] Menu processing failed, clearing loading', { menuId });
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

    // Get actual menu items count from the response
    const actualMenuItems = menuData?.menu?.items || menuData?.items || [];
    logger.dev('[loadMenuData] Menu data loaded successfully', {
      menuId,
      menuItemsCount: actualMenuItems.length,
      dishesCount: dishesData?.dishes?.length || 0,
      recipesCount: recipesData?.recipes?.length || 0,
      timestamp: new Date().toISOString(),
    });

    // CRITICAL: Clear loading state immediately after data is processed
    // The finally block will also call clearLoading(), but we clear it here too to be safe
    logger.dev('[loadMenuData] Clearing loading state after successful data load', { menuId });
    setLoading(false);
  } catch (err) {
    const isTimeout = err instanceof Error && err.message === 'MENU_DATA_FETCH_TIMEOUT';
    if (isTimeout) {
      logger.warn('Menu data fetch timed out; clearing loading so UI is not stuck', {
        menuId,
        timeoutMs: MENU_DATA_FETCH_TIMEOUT_MS,
      });
      onError?.('Menu took too long to load. You can try again or go back.');
    } else {
      logger.error('Failed to load menu data:', err);
    }
    setLoading(false);
    clearLoading();
  } finally {
    logger.dev('[loadMenuData] Finally block executing - calling clearLoading()', { menuId });
    clearLoading();
    logger.dev('[loadMenuData] Finally block completed', { menuId });
  }
}
