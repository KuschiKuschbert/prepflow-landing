import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { EnrichedMenuItem, RawMenuItem } from '../../../types';
import { calculateRecommendedPrice } from './calculateRecommendedPrices';
import { enrichDishItem } from './enrichDishItem';
import { enrichRecipeItem } from './enrichRecipeItem';
import { validateVeganStatus } from './validateDietaryStatus';

/**
 * Enriches menu items with recommended prices, allergens, and dietary information
 *
 * @param {RawMenuItem[]} menuItems - Raw menu items from database
 * @param {string} menuId - Menu ID
 * @param {boolean} hasPricingColumns - Whether pricing columns exist
 * @param {boolean} hasDietaryColumns - Whether dietary columns exist
 * @returns {Promise<EnrichedMenuItem[]>} Enriched menu items
 */
export async function enrichMenuItems(
  menuItems: RawMenuItem[],
  menuId: string,
  hasPricingColumns: boolean,
  hasDietaryColumns: boolean,
): Promise<EnrichedMenuItem[]> {
  return Promise.all(
    (menuItems || []).map(async (item: RawMenuItem) => {
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
      if (item.recipes && 'name' in item.recipes) {
        // We need to support both legacy 'name' and new 'recipe_name'
        // Mutating the object to ensure frontend compatibility
        (item.recipes as { recipe_name?: string; name: string }).recipe_name = (
          item.recipes as { name: string }
        ).name;
      }

      // Final safety check: validate vegan status against allergens one more time
      const finalAllergens = consolidateAllergens(allergens || []);
      const itemName = item.dish_id
        ? item.dishes?.dish_name
        : item.recipes?.recipe_name || (item.recipes as { name?: string })?.name;
      const itemId = item.dish_id ? item.dishes?.id : item.recipes?.id;
      const itemType = item.dish_id ? ('dish' as const) : ('recipe' as const);

      let finalIsVegan: boolean | null = isVegan;
      if (itemId && itemName) {
        finalIsVegan = validateVeganStatus(isVegan, finalAllergens, itemType, itemId, itemName);
      }

      const enrichedItem: EnrichedMenuItem = {
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
