/**
 * Utility for getting the formatted item name.
 */

import type { Dish, Recipe } from '@/app/webapp/recipes/types';

type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

interface GetItemNameProps {
  item: UnifiedItem;
  isDish: boolean;
  dish: Dish | null;
  recipe: Recipe | null;
  capitalizeDishName: (name: string) => string;
  capitalizeRecipeName: (name: string) => string;
}

export function getItemName({
  item,
  isDish,
  dish,
  recipe,
  capitalizeDishName,
  capitalizeRecipeName,
}: GetItemNameProps): string {
  if (isDish && dish) {
    return capitalizeDishName(dish.dish_name);
  }
  if (recipe) {
    return capitalizeRecipeName(recipe.recipe_name);
  }
  return '';
}
