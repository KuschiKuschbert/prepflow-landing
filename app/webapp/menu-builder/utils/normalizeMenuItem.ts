/**
 * Utility functions for normalizing menu items from server responses.
 */
import type { Dish, MenuItem, Recipe } from '@/lib/types/menu-builder';

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
 * Get dish data from server item or local array.
 */
function getDishData(
  serverItem: ServerMenuItem,
  dishes: Dish[],
): { id: string; dish_name: string; description?: string; selling_price: number } | null {
  if (!serverItem.dish_id) return null;

  // Try to get dish from local array first (most reliable)
  const dish = dishes.find(d => d.id === serverItem.dish_id);
  if (dish) {
    return {
      id: dish.id,
      dish_name: dish.dish_name,
      description: dish.description ?? undefined,
      selling_price: dish.selling_price,
    };
  }

  // Fallback to server data (handle both array and object formats)
  if (serverItem.dishes) {
    const dishData = Array.isArray(serverItem.dishes) ? serverItem.dishes[0] : serverItem.dishes;
    if (dishData) {
      return {
        id: dishData.id,
        dish_name: dishData.dish_name,
        description: dishData.description ?? undefined,
        selling_price: dishData.selling_price,
      };
    }
  }

  return null;
}

/**
 * Get recipe data from server item or local array.
 */
function getRecipeData(
  serverItem: ServerMenuItem,
  recipes: Recipe[],
): {
  id: string;
  recipe_name: string;
  description?: string;
  yield?: number;
  selling_price?: number;
} | null {
  if (!serverItem.recipe_id) return null;

  // Try to get recipe from local array first (most reliable)
  const recipe = recipes.find(r => r.id === serverItem.recipe_id);
  if (recipe) {
    return {
      id: recipe.id,
      recipe_name: recipe.recipe_name,
      description: recipe.description ?? undefined,
      yield: recipe.yield ?? undefined,
      selling_price: recipe.selling_price ?? undefined,
    };
  }

  // Fallback to server data (handle both array and object formats)
  if (serverItem.recipes) {
    const recipeData = Array.isArray(serverItem.recipes)
      ? serverItem.recipes[0]
      : serverItem.recipes;
    if (recipeData) {
      return {
        id: recipeData.id,
        recipe_name: recipeData.recipe_name,
        description: recipeData.description ?? undefined,
        yield: recipeData.yield ?? undefined,
        selling_price: recipeData.selling_price ?? undefined,
      };
    }
  }

  return null;
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
