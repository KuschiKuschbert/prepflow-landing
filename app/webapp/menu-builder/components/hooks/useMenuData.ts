/**
 * Hook for managing menu data loading and caching
 */
import type { Dish, MenuItem, MenuStatistics, Recipe } from '@/lib/types/menu-builder';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const menuCacheKey = `menu_${menuId}_data`;
  const dishesCacheKey = 'menu_builder_dishes';
  const recipesCacheKey = 'menu_builder_recipes';

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
    const hasCachedData =
      initialState.menuItems.length > 0 ||
      initialState.dishes.length > 0 ||
      initialState.recipes.length > 0;
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
    initialState,
    setMenuItems,
    setDishes,
    setRecipes,
    setCategories,
    setStatistics,
    setLoading,
  ]);
  useEffect(() => {
    loadMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMenuData, menuId]);
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
    [
      menuItems,
      dishes,
      recipes,
      categories,
      statistics,
      loading,
      loadMenuData,
      refreshStatistics,
    ],
  );
}
