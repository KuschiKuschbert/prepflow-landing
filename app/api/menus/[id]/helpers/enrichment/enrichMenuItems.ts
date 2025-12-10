/**
 * Helper for enriching menu items with prices, allergens, and dietary info
 */

import { logger } from '@/lib/logger';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { calculateRecommendedPrice } from './calculateRecommendedPrices';
import { enrichDishItem } from './enrichDishItem';
import { enrichRecipeItem } from './enrichRecipeItem';
import { validateVeganStatus } from './validateDietaryStatus';

/**
 * Enriches menu items with recommended prices, allergens, and dietary information
 *
 * @param {any[]} menuItems - Raw menu items from database
 * @param {string} menuId - Menu ID
 * @param {boolean} hasPricingColumns - Whether pricing columns exist
 * @param {boolean} hasDietaryColumns - Whether dietary columns exist
 * @returns {Promise<any[]>} Enriched menu items
 */
export async function enrichMenuItems(
  menuItems: any[],
  menuId: string,
  hasPricingColumns: boolean,
  hasDietaryColumns: boolean,
): Promise<any[]> {
  return Promise.all(
    (menuItems || []).map(async (item: any) => {
      // Calculate recommended price
      const recommendedPrice = await calculateRecommendedPrice(item, menuId, hasPricingColumns);

      // Aggregate allergens and dietary info if columns are available
      let allergens: string[] = [];
      let isVegetarian: boolean | null = null;
      let isVegan: boolean | null = null;
      let dietaryConfidence: string | null = null;
      let dietaryMethod: string | null = null;

      if (hasDietaryColumns && (item.dish_id || item.recipe_id)) {
        if (item.dish_id && item.dishes) {
          const dishData = await enrichDishItem(item);
          allergens = dishData.allergens;
          isVegetarian = dishData.isVegetarian;
          isVegan = dishData.isVegan;
          dietaryConfidence = dishData.dietaryConfidence;
          dietaryMethod = dishData.dietaryMethod;
        } else if (item.recipe_id && item.recipes) {
          const recipeData = await enrichRecipeItem(item);
          allergens = recipeData.allergens;
          isVegetarian = recipeData.isVegetarian;
          isVegan = recipeData.isVegan;
          dietaryConfidence = recipeData.dietaryConfidence;
          dietaryMethod = recipeData.dietaryMethod;
        }
      }

      // Map recipe name from 'name' to 'recipe_name' for frontend compatibility
      if (item.recipes && item.recipes.name) {
        item.recipes.recipe_name = item.recipes.name;
      }

      // Final safety check: validate vegan status against allergens one more time
      const finalAllergens = consolidateAllergens(allergens || []);
      const itemName = item.dish_id
        ? item.dishes?.dish_name
        : item.recipes?.recipe_name || item.recipes?.name;
      const itemId = item.dish_id ? item.dishes?.id : item.recipes?.id;
      const itemType = item.dish_id ? ('dish' as const) : ('recipe' as const);

      let finalIsVegan = validateVeganStatus(isVegan, finalAllergens, itemType, itemId, itemName);

      const enrichedItem: any = {
        ...item,
        allergens: finalAllergens,
        is_vegetarian: isVegetarian,
        is_vegan: finalIsVegan,
        dietary_confidence: dietaryConfidence,
        dietary_method: dietaryMethod,
      };

      // Only add pricing fields if pricing columns exist
      if (hasPricingColumns) {
        enrichedItem.recommended_selling_price = recommendedPrice;
      }

      return enrichedItem;
    }),
  );
}



