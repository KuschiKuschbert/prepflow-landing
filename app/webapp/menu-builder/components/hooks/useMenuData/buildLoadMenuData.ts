/**
 * Build loadMenuData callback for useMenuData.
 */
import type { Dish, MenuItem, MenuStatistics, Recipe } from '@/lib/types/menu-builder';
import { loadMenuData as loadMenuDataHelper } from './dataLoading';

interface BuildLoadMenuDataParams {
  menuId: string;
  menuCacheKey: string;
  dishesCacheKey: string;
  recipesCacheKey: string;
  onError?: (message: string) => void;
  isLocked: boolean;
  getCurrentMenuId: () => string | undefined;
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setStatistics: React.Dispatch<React.SetStateAction<MenuStatistics | null>>;
  setLoading: (loading: boolean) => void;
}

export function buildLoadMenuData(params: BuildLoadMenuDataParams): () => Promise<void> {
  const {
    menuId,
    menuCacheKey,
    dishesCacheKey,
    recipesCacheKey,
    onError,
    isLocked,
    getCurrentMenuId,
    setMenuItems,
    setDishes,
    setRecipes,
    setCategories,
    setStatistics,
    setLoading,
  } = params;

  return async () => {
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
      isLockedMenu: isLocked,
      getCurrentMenuId,
    });
  };
}
