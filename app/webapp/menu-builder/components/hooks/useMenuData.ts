/**
 * Hook for managing menu data loading and caching
 */
import { logger } from '@/lib/logger';
import type { Dish, MenuItem, MenuStatistics, Recipe } from '@/lib/types/menu-builder';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadMenuData as loadMenuDataHelper } from './useMenuData/dataLoading';
import { initializeState } from './useMenuData/helpers/initializeState';
import { refreshStatistics as refreshStatisticsHelper } from './useMenuData/helpers/refreshStatistics';

interface UseMenuDataProps {
  menuId: string;
  onError?: (message: string) => void;
}

interface UseMenuDataReturn {
  menuItems: MenuItem[];
  dishes: Dish[];
  recipes: Recipe[];
  categories: string[];
  statistics: MenuStatistics | null;
  loading: boolean;
  loadMenuData: () => Promise<void>;
  refreshStatistics: () => Promise<void>;
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setStatistics: React.Dispatch<React.SetStateAction<MenuStatistics | null>>;
}

export function useMenuData({ menuId: rawMenuId, onError }: UseMenuDataProps): UseMenuDataReturn {
  // Defensive coding: Clean menu ID if it has trailing comma or other garbage
  // This fixes the "can't find menu,L" error where ",L" is appended to the ID
  const menuId = rawMenuId?.split(',')[0]?.trim();

  // VERSION MARKER: If you see this log, the new code is running
  logger.dev('🟢🟢🟢 USE_MENU_DATA_NEW_CODE_V2_2025_02_08 - CODE IS RUNNING 🟢🟢🟢', {
    rawMenuId,
    cleanedMenuId: menuId,
    timestamp: new Date().toISOString(),
    version: '2.0',
  });

  logger.dev('[useMenuData] Hook called', {
    rawMenuId,
    cleanedMenuId: menuId,
    timestamp: new Date().toISOString(),
  });

  const menuCacheKey = `menu_${menuId}_data`;
  const dishesCacheKey = 'menu_builder_dishes';
  const recipesCacheKey = 'menu_builder_recipes';

  // Track previous menuId to detect changes and prevent duplicate loads
  // Initialize as undefined to detect first load
  const prevMenuIdRef = useRef<string | undefined>(undefined);
  const isLoadingRef = useRef<boolean>(false);
  const loadPromiseRef = useRef<Promise<void> | null>(null);

  const initialState = useMemo(
    () => initializeState({ menuCacheKey, dishesCacheKey, recipesCacheKey }),
    [menuCacheKey, dishesCacheKey, recipesCacheKey],
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialState.menuItems);
  const [dishes, setDishes] = useState<Dish[]>(initialState.dishes);
  const [recipes, setRecipes] = useState<Recipe[]>(initialState.recipes);
  const [categories, setCategories] = useState<string[]>(initialState.categories);
  const [statistics, setStatistics] = useState<MenuStatistics | null>(initialState.statistics);
  const [loading, setLoading] = useState(initialState.loading);
  const refreshStatistics = useCallback(
    async () => refreshStatisticsHelper(menuId, setStatistics),
    [menuId, setStatistics],
  );
  const loadMenuData = useCallback(async () => {
    // Check cache directly instead of using initialState to avoid dependency issues
    const cachedMenuData =
      typeof window !== 'undefined' ? sessionStorage.getItem(`menu_${menuId}_data`) : null;
    const cachedDishes =
      typeof window !== 'undefined' ? sessionStorage.getItem('menu_builder_dishes') : null;
    const cachedRecipes =
      typeof window !== 'undefined' ? sessionStorage.getItem('menu_builder_recipes') : null;

    const hasCachedData = !!(cachedMenuData || cachedDishes || cachedRecipes);

    await loadMenuDataHelper({
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
      showLoading: !hasCachedData,
    });
  }, [
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
  ]);

  // Store latest loadMenuData in a ref to avoid stale closures
  const loadMenuDataRef = useRef(loadMenuData);
  loadMenuDataRef.current = loadMenuData;

  // Single effect: Reset state and load data when menuId changes
  useEffect(() => {
    logger.dev('[useMenuData] useEffect EXECUTING', {
      menuId,
      prevMenuId: prevMenuIdRef.current,
      isLoading: isLoadingRef.current,
      hasPromise: !!loadPromiseRef.current,
    });

    const isInitialLoad = prevMenuIdRef.current === undefined;
    const menuIdChanged = !isInitialLoad && prevMenuIdRef.current !== menuId;

    logger.dev('[useMenuData] useEffect - checking conditions', {
      menuId,
      prevMenuId: prevMenuIdRef.current,
      isInitialLoad,
      menuIdChanged,
    });

    // Skip if menuId hasn't changed (and this is not the initial load)
    if (!isInitialLoad && !menuIdChanged) {
      logger.dev('[useMenuData] useEffect skipped - menuId unchanged', {
        menuId,
        prevMenuId: prevMenuIdRef.current,
      });
      return;
    }

    // Skip if already loading the same menuId (prevent concurrent loads)
    // But allow if menuId changed (need to load new menu)
    if (
      isLoadingRef.current &&
      loadPromiseRef.current &&
      !menuIdChanged &&
      prevMenuIdRef.current === menuId
    ) {
      logger.dev('[useMenuData] useEffect skipped - already loading this menuId', {
        menuId,
        isLoading: isLoadingRef.current,
        hasPromise: !!loadPromiseRef.current,
        menuIdChanged,
      });
      return;
    }

    logger.dev('[useMenuData] useEffect triggered - WILL LOAD DATA', {
      menuId,
      prevMenuId: prevMenuIdRef.current,
      isInitialLoad,
      menuIdChanged,
      isLoading: isLoadingRef.current,
      willProceed: true,
    });

    // Update prevMenuIdRef immediately to prevent duplicate calls
    const currentMenuId = menuId;
    prevMenuIdRef.current = menuId;

    // Reset state when menuId changes (not on initial load if we have cached data)
    if (menuIdChanged) {
      logger.dev('[useMenuData] Resetting state for new menuId', { menuId });
      setMenuItems([]);
      setCategories(['Uncategorized']);
      setStatistics(null);
      setLoading(true);
    } else if (isInitialLoad) {
      // On initial load, set loading if we don't have cached data
      if (initialState.menuItems.length === 0) {
        logger.dev('[useMenuData] Initial load with no cache, setting loading', { menuId });
        setLoading(true);
      } else {
        logger.dev('[useMenuData] Initial load with cached data, keeping current loading state', {
          menuId,
          cachedItemsCount: initialState.menuItems.length,
        });
      }
    }

    // Mark as loading and store the promise
    isLoadingRef.current = true;
    logger.dev('[useMenuData] Calling loadMenuData', { menuId: currentMenuId });

    const loadPromise = loadMenuDataRef
      .current()
      .then(() => {
        logger.dev('[useMenuData] loadMenuData completed successfully', { menuId: currentMenuId });
      })
      .catch(err => {
        logger.error('[useMenuData] loadMenuData failed', {
          menuId: currentMenuId,
          error: err,
          errorMessage: err instanceof Error ? err.message : String(err),
          errorStack: err instanceof Error ? err.stack : undefined,
        });
        // Ensure loading is cleared on error
        setLoading(false);
      })
      .finally(() => {
        // Only reset if this is still the current menuId (prevent race conditions)
        if (prevMenuIdRef.current === currentMenuId) {
          isLoadingRef.current = false;
          loadPromiseRef.current = null;
          logger.dev('[useMenuData] loadMenuData finally - reset refs', { menuId: currentMenuId });
        } else {
          logger.dev(
            '[useMenuData] loadMenuData finally - menuId changed during load, skipping reset',
            {
              menuId: currentMenuId,
              currentMenuId: prevMenuIdRef.current,
            },
          );
        }
      });

    loadPromiseRef.current = loadPromise;
    // Only depend on menuId to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuId]);
  return useMemo(
    () => ({
      menuItems,
      dishes,
      recipes,
      categories,
      statistics,
      loading,
      loadMenuData,
      refreshStatistics,
      setMenuItems,
      setCategories,
      setStatistics,
    }),
    [menuItems, dishes, recipes, categories, statistics, loading, loadMenuData, refreshStatistics],
  );
}
