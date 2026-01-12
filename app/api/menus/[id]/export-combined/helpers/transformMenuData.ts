/**
 * Helper to transform menu items to display data.
 */

import { EnrichedMenuItem } from '../../../types';

export interface MenuDisplayItem {
  name: string;
  description?: string;
  price: number;
  category: string;
}

/**
 * Transform menu items to display data.
 */
export function transformMenuData(items: EnrichedMenuItem[]): MenuDisplayItem[] {
  return items.map((item: EnrichedMenuItem) => {
    const isDish = !!item.dish_id;
    const itemName = isDish
      ? item.dishes?.dish_name || 'Unknown Dish'
      : item.recipes?.recipe_name || 'Unknown Recipe';

    const description = isDish ? item.dishes?.description : item.recipes?.description;

    const price =
      item.actual_selling_price ||
      (isDish ? item.dishes?.selling_price : item.recommended_selling_price) ||
      0;

    return {
      name: itemName,
      description: description || undefined,
      price,
      category: item.category || 'Uncategorized',
    };
  });
}
