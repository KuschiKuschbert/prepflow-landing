/**
 * Helpers for normalizeMenuItem. Extracted to stay under 150-line util limit.
 */
import type { Dish, Recipe } from '@/lib/types/menu-builder';

interface ServerMenuItem {
  id: string;
  dish_id?: string;
  recipe_id?: string;
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

export function getDishData(
  serverItem: ServerMenuItem,
  dishes: Dish[],
): { id: string; dish_name: string; description?: string; selling_price: number } | null {
  if (!serverItem.dish_id) return null;
  const dish = dishes.find(d => d.id === serverItem.dish_id);
  if (dish) {
    return {
      id: dish.id,
      dish_name: dish.dish_name,
      description: dish.description ?? undefined,
      selling_price: dish.selling_price,
    };
  }
  if (serverItem.dishes) {
    const dishData = Array.isArray(serverItem.dishes) ? serverItem.dishes[0] : serverItem.dishes;
    if (dishData)
      return {
        id: dishData.id,
        dish_name: dishData.dish_name,
        description: dishData.description ?? undefined,
        selling_price: dishData.selling_price,
      };
  }
  return null;
}

export function getRecipeData(
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
  if (serverItem.recipes) {
    const recipeData = Array.isArray(serverItem.recipes)
      ? serverItem.recipes[0]
      : serverItem.recipes;
    if (recipeData)
      return {
        id: recipeData.id,
        recipe_name: recipeData.recipe_name,
        description: recipeData.description ?? undefined,
        yield: recipeData.yield ?? undefined,
        selling_price: recipeData.selling_price ?? undefined,
      };
  }
  return null;
}
