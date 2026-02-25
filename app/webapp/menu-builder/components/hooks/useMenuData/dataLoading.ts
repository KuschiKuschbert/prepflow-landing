/**
 * Data loading utilities for menu data.
 */
import { logger } from '@/lib/logger';
import type { Dish, MenuItem, MenuStatistics, Recipe } from '@/lib/types/menu-builder';
import { setLoadingIfNeeded } from './dataLoading/helpers/handleLoadingState';
import { loadLockedMenu } from './dataLoading/loadLockedMenu';
import { loadUnlockedMenu } from './dataLoading/loadUnlockedMenu';

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
  showLoading?: boolean;
  isLockedMenu?: boolean;
  getCurrentMenuId?: () => string | undefined;
}

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
  });

  setLoadingIfNeeded({ menuCacheKey, dishesCacheKey, recipesCacheKey, showLoading, setLoading });

  const shouldUpdateState = (): boolean =>
    !getCurrentMenuId ? true : getCurrentMenuId() === menuId;

  try {
    if (isLockedMenu) {
      await loadLockedMenu({
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
      });
      return;
    }

    await loadUnlockedMenu({
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
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.message === 'MENU_DATA_FETCH_TIMEOUT';
    if (isTimeout) {
      logger.warn('Menu data fetch timed out; clearing loading so UI is not stuck', {
        menuId,
        timeoutMs: 20_000,
      });
      onError?.('Menu took too long to load. You can try again or go back.');
    } else {
      logger.error('Failed to load menu data:', err);
    }
    setLoading(false);
  } finally {
    setLoading(false);
  }
}
