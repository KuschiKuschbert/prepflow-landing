/**
 * Hook for managing menu data loading and caching
 */
import type { Dish, MenuItem, MenuStatistics, Recipe } from '@/lib/types/menu-builder';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildLoadMenuData } from './useMenuData/buildLoadMenuData';
import { initializeState } from './useMenuData/helpers/initializeState';
import { refreshStatistics as refreshStatisticsHelper } from './useMenuData/helpers/refreshStatistics';
import { runLoadEffect } from './useMenuData/runLoadEffect';
import type { UseMenuDataProps, UseMenuDataReturn } from './useMenuData/types';

export function useMenuData({
  menuId: rawMenuId,
  onError,
  isLocked = false,
}: UseMenuDataProps): UseMenuDataReturn {
  // Defensive coding: Clean menu ID if it has trailing comma or other garbage
  // This fixes the "can't find menu,L" error where ",L" is appended to the ID
  const menuId = rawMenuId?.split(',')[0]?.trim();

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
  const loadMenuData = useCallback(
    buildLoadMenuData({
      menuId,
      menuCacheKey,
      dishesCacheKey,
      recipesCacheKey,
      onError,
      isLocked,
      getCurrentMenuId: () => prevMenuIdRef.current,
      setMenuItems,
      setDishes,
      setRecipes,
      setCategories,
      setStatistics,
      setLoading,
    }),
    [
      menuId,
      menuCacheKey,
      dishesCacheKey,
      recipesCacheKey,
      onError,
      isLocked,
      setMenuItems,
      setDishes,
      setRecipes,
      setCategories,
      setStatistics,
      setLoading,
    ],
  );

  // Store latest loadMenuData in a ref to avoid stale closures
  const loadMenuDataRef = useRef(loadMenuData);
  loadMenuDataRef.current = loadMenuData;

  useEffect(() => {
    runLoadEffect<MenuItem, MenuStatistics>({
      menuId,
      initialState,
      prevMenuIdRef,
      isLoadingRef,
      loadPromiseRef,
      loadMenuDataRef,
      setMenuItems,
      setCategories,
      setStatistics,
      setLoading,
    });
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
