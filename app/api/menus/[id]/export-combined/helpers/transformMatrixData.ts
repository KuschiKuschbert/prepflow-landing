/**
 * Helper to transform menu items to allergen matrix data.
 */

import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { EnrichedMenuItem } from '../../../types';

export interface AllergenMatrixItem {
  name: string;
  type: 'Dish' | 'Recipe';
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  category: string;
}

/**
 * Transform menu items to allergen matrix data.
 */
export function transformMatrixData(items: EnrichedMenuItem[]): AllergenMatrixItem[] {
  return items.map((item: EnrichedMenuItem) => {
    let allergens: string[] = [];
    if (item.allergens && Array.isArray(item.allergens)) {
      allergens = item.allergens;
    } else if (item.dish_id && item.dishes?.allergens && Array.isArray(item.dishes.allergens)) {
      allergens = item.dishes.allergens;
    } else if (item.recipe_id && item.recipes?.allergens && Array.isArray(item.recipes.allergens)) {
      allergens = item.recipes.allergens;
    }
    const validAllergenCodes = AUSTRALIAN_ALLERGENS.map(a => a.code);
    allergens = consolidateAllergens(allergens).filter(code => validAllergenCodes.includes(code));
    const isVegetarian =
      item.is_vegetarian ??
      (item.dish_id ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
    const isVegan =
      item.is_vegan ?? (item.dish_id ? item.dishes?.is_vegan : item.recipes?.is_vegan);
    const itemName = item.dish_id
      ? item.dishes?.dish_name || 'Unknown Dish'
      : item.recipes?.recipe_name || 'Unknown Recipe';

    return {
      name: itemName,
      type: item.dish_id ? 'Dish' : 'Recipe',
      allergens,
      isVegetarian: isVegetarian === true,
      isVegan: isVegan === true,
      category: item.category || 'Uncategorized',
    };
  });
}
