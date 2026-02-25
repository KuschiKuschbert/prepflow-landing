/**
 * Utility functions for normalizing menu items from server responses.
 */
import type { Dish, MenuItem, Recipe } from '@/lib/types/menu-builder';
import { getDishData, getRecipeData } from './normalizeMenuItem/helpers';

interface ServerMenuItem {
  id: string;
  dish_id?: string;
  recipe_id?: string;
  category?: string;
  position?: number;
  actual_selling_price?: number;
  recommended_selling_price?: number;
  dishes?:
    | { id: string; dish_name: string; description?: string; selling_price: number }
    | { id: string; dish_name: string; description?: string; selling_price: number }[];
  recipes?:
    | {
        id: string;
        recipe_name: string;
        description?: string;
        yield?: number;
        selling_price?: number;
      }
    | {
        id: string;
        recipe_name: string;
        description?: string;
        yield?: number;
        selling_price?: number;
      }[];
}

interface NormalizeMenuItemParams {
  serverItem: ServerMenuItem;
  menuId: string;
  optimisticItem: MenuItem;
  dishes: Dish[];
  recipes: Recipe[];
}

/**
 * Normalize server menu item to ensure it has all required fields and nested objects.
 */
export function normalizeMenuItem({
  serverItem,
  menuId,
  optimisticItem,
  dishes,
  recipes,
}: NormalizeMenuItemParams): MenuItem {
  const normalized: MenuItem = {
    id: serverItem.id,
    menu_id: menuId,
    category: serverItem.category ?? optimisticItem.category,
    position: serverItem.position ?? optimisticItem.position,
    dish_id: serverItem.dish_id,
    recipe_id: serverItem.recipe_id,
    actual_selling_price: serverItem.actual_selling_price,
    recommended_selling_price: serverItem.recommended_selling_price,
  };

  const dishData = getDishData(serverItem, dishes);
  if (dishData) {
    normalized.dishes = dishData;
  }

  const recipeData = getRecipeData(serverItem, recipes);
  if (recipeData) {
    normalized.recipes = recipeData;
  }

  return normalized;
}
