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
  /** When true, fetch only menu first (show LockedMenuView immediately), then load dishes/recipes/stats in background */
  isLockedMenu?: boolean;
  /** Called before updating state from background fetch; if returns a different menuId, skip state updates (user switched menus) */
  getCurrentMenuId?: () => string | undefined;
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
  isLockedMenu = false,
  getCurrentMenuId,
}: LoadMenuDataProps): Promise<void> {
  logger.dev('[loadMenuData] Starting menu data load', {
    menuId,
    menuCacheKey,
    showLoading,
    isLockedMenu,
    timestamp: new Date().toISOString(),
  });

  setLoadingIfNeeded({ menuCacheKey, dishesCacheKey, recipesCacheKey, showLoading, setLoading });

  const clearLoading = () => {
    logger.dev('[loadMenuData] clearLoading() called', { menuId });
    setLoading(false);
  };

  const shouldUpdateState = (): boolean => {
    if (!getCurrentMenuId) return true;
    return getCurrentMenuId() === menuId;
  };

  try {
    if (isLockedMenu) {
      // Phase 1: Fetch only menu (includes items) - show LockedMenuView immediately
      // Use ?locked=1 for light API response (skips per-item price/dietary enrichment)
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
        timestamp: new Date().toISOString(),
      });
      setLoading(false);

      // Phase 2: Background fetch dishes, recipes, stats (for when user unlocks)
      const bgFetch = async () => {
        try {
          const [dishesResponse, recipesResponse, statsResponse] = await Promise.all([
            fetch('/api/dishes?pageSize=1000', { cache: 'no-store' }),
            fetch('/api/recipes?pageSize=1000', { cache: 'no-store' }),
            fetch(`/api/menus/${menuId}/statistics`, { cache: 'no-store' }),
          ]);
          const dishesData = await dishesResponse.json();
          const recipesData = await recipesResponse.json();
          const statsData = await statsResponse.json();

          if (!shouldUpdateState()) {
            logger.dev(
              '[loadMenuData] Background fetch complete but user switched menus, skipping state update',
              {
                menuId,
                currentMenuId: getCurrentMenuId?.(),
              },
            );
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

          logger.dev('[loadMenuData] Locked menu - Phase 2 background fetch complete', {
            menuId,
            dishesCount: dishesData?.dishes?.length || 0,
            recipesCount: recipesData?.recipes?.length || 0,
          });
        } catch (bgErr) {
          logger.warn('[loadMenuData] Background fetch failed (non-blocking)', {
            menuId,
            error: bgErr instanceof Error ? bgErr.message : String(bgErr),
          });
        }
      };
      void bgFetch();
      return;
    }

    // Unlocked menu: full fetch (all 4 requests, wait for completion)
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

    const actualMenuItems = menuData?.menu?.items || menuData?.items || [];
    logger.dev('[loadMenuData] Menu data loaded successfully', {
      menuId,
      menuItemsCount: actualMenuItems.length,
      dishesCount: dishesData?.dishes?.length || 0,
      recipesCount: recipesData?.recipes?.length || 0,
      timestamp: new Date().toISOString(),
    });

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
  } finally {
    clearLoading();
  }
}
