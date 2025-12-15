/**
 * Create Optimistic Menu Item
 * Creates a temporary menu item for optimistic UI updates
 */

import type { Dish, MenuItem, Recipe } from '../../../../types';

interface CreateOptimisticItemParams {
  menuId: string;
  category: string;
  selectedItem: { type: 'dish' | 'recipe'; id: string; name: string };
  dish: Dish | undefined;
  recipe: Recipe | undefined;
  categoryItems: MenuItem[];
}

export function createOptimisticItem({
  menuId,
  category,
  selectedItem,
  dish,
  recipe,
  categoryItems,
}: CreateOptimisticItemParams): MenuItem {
  const maxPosition =
    categoryItems.length > 0 ? Math.max(...categoryItems.map(item => item.position)) : -1;

  return {
    id: `temp-${Date.now()}`,
    menu_id: menuId,
    category,
    position: maxPosition + 1,
    ...(selectedItem.type === 'dish'
      ? {
          dish_id: selectedItem.id,
          dishes: {
            id: dish!.id,
            dish_name: dish!.dish_name,
            description: dish!.description,
            selling_price: dish!.selling_price,
          },
        }
      : {
          recipe_id: selectedItem.id,
          recipes: {
            id: recipe!.id,
            recipe_name: recipe!.recipe_name,
            description: recipe!.description,
            yield: recipe!.yield,
          },
        }),
  };
}
