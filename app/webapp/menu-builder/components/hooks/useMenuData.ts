/**
 * Hook for managing menu data loading and caching
 */

import { useState, useEffect, useCallback } from 'react';
import { getCachedData } from '@/lib/cache/data-cache';
import type { MenuItem, MenuStatistics, Dish, Recipe } from '../../types';
import { loadMenuData as loadMenuDataHelper } from './useMenuData/dataLoading';

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

  const cachedMenuData = getCachedData<{
    menuItems: MenuItem[];
    categories: string[];
    statistics: MenuStatistics | null;
  }>(menuCacheKey);
  const cachedDishes = getCachedData<Dish[]>(dishesCacheKey);
  const cachedRecipes = getCachedData<Recipe[]>(recipesCacheKey);

  const [menuItems, setMenuItems] = useState<MenuItem[]>(cachedMenuData?.menuItems || []);
  const [dishes, setDishes] = useState<Dish[]>(cachedDishes || []);
  const [recipes, setRecipes] = useState<Recipe[]>(cachedRecipes || []);
  const [categories, setCategories] = useState<string[]>(
    cachedMenuData?.categories || ['Uncategorized'],
  );
  const [statistics, setStatistics] = useState<MenuStatistics | null>(
    cachedMenuData?.statistics || null,
  );
  const [loading, setLoading] = useState(!cachedMenuData && !cachedDishes && !cachedRecipes);

  const refreshStatistics = useCallback(async () => {
    const statsResponse = await fetch(`/api/menus/${menuId}/statistics`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      if (statsData.success) setStatistics(statsData.statistics);
    }
  }, [menuId]);

  const loadMenuData = useCallback(async () => {
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
    });
  }, [menuId, menuCacheKey, dishesCacheKey, recipesCacheKey, onError, setMenuItems, setDishes, setRecipes, setCategories, setStatistics, setLoading]);

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
