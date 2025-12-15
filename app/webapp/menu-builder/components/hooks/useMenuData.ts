/**
 * Hook for managing menu data loading and caching
 */
import { useState, useEffect, useCallback } from 'react';
import type { MenuItem, MenuStatistics, Dish, Recipe } from '../../types';
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

export function useMenuData({ menuId, onError }: UseMenuDataProps): UseMenuDataReturn {
  const menuCacheKey = `menu_${menuId}_data`;
  const dishesCacheKey = 'menu_builder_dishes';
  const recipesCacheKey = 'menu_builder_recipes';

  const initialState = initializeState({ menuCacheKey, dishesCacheKey, recipesCacheKey });
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
  }, [menuId]);
  return {
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
  };
}
