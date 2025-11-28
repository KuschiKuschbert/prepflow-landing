import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { logger } from '@/lib/logger';
import type { MenuItem } from '@/app/webapp/menu-builder/types';

const VALID_ALLERGEN_CODES = AUSTRALIAN_ALLERGENS.map(a => a.code);

interface MenuItemWithAllergens {
  id: string;
  menuItemId: string;
  name: string;
  type: 'dish' | 'recipe';
  allergens: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  dietaryConfidence?: string;
  category?: string;
  price: number;
}

export function processMenuItem(item: MenuItem): MenuItemWithAllergens {
  let allergens: string[] = [];

  if (item.allergens && Array.isArray(item.allergens)) {
    allergens = item.allergens;
  } else if (item.dish_id && item.dishes?.allergens) {
    if (Array.isArray(item.dishes.allergens)) {
      allergens = item.dishes.allergens;
    }
  } else if (item.recipe_id && item.recipes?.allergens) {
    if (Array.isArray(item.recipes.allergens)) {
      allergens = item.recipes.allergens;
    }
  }

  allergens = consolidateAllergens(allergens).filter(code => VALID_ALLERGEN_CODES.includes(code));
  const finalAllergens = Array.isArray(allergens) ? allergens : [];

  let isVegetarian =
    item.is_vegetarian ?? (item.dish_id ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
  let isVegan = item.is_vegan ?? (item.dish_id ? item.dishes?.is_vegan : item.recipes?.is_vegan);

  if (isVegan === true && finalAllergens.length > 0) {
    const hasMilk = finalAllergens.includes('milk');
    const hasEggs = finalAllergens.includes('eggs');
    if (hasMilk || hasEggs) {
      logger.warn(
        '[MenuLockedView] Client-side validation: vegan=true but allergens include milk/eggs',
        {
          itemId: item.id,
          itemName: item.dish_id ? item.dishes?.dish_name : item.recipes?.recipe_name,
          allergens: finalAllergens,
          hasMilk,
          hasEggs,
        },
      );
      isVegan = false;
    }
  }

  const dietaryConfidence =
    item.dietary_confidence ||
    (item.dish_id ? item.dishes?.dietary_confidence : item.recipes?.dietary_confidence);

  return {
    id: item.id,
    menuItemId: item.dish_id || item.recipe_id || item.id || '',
    name: (item.dish_id ? item.dishes?.dish_name : item.recipes?.recipe_name) || 'Unknown',
    type: item.dish_id ? 'dish' : 'recipe',
    allergens: finalAllergens,
    isVegetarian,
    isVegan,
    dietaryConfidence,
    category: item.category,
    price:
      item.actual_selling_price ||
      (item.dish_id ? item.dishes?.selling_price : item.recommended_selling_price) ||
      0,
  };
}
