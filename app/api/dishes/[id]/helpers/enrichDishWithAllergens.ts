import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { DishWithRelations } from '../../helpers/schemas';

/**
 * Enriches dish with aggregated allergens and dietary status
 *
 * @param {DishWithRelations} dish - Dish data
 * @param {string} dishId - Dish ID
 * @returns {Promise<DishWithRelations>} Enriched dish
 */
export async function enrichDishWithAllergens(
  dish: DishWithRelations,
  dishId: string,
): Promise<DishWithRelations> {
  // Always aggregate allergens and dietary status (even if cached)
  // This ensures we have the latest data from recipes/ingredients
  const { aggregateDishAllergens } = await import('@/lib/allergens/allergen-aggregation');
  const { aggregateDishDietaryStatus } = await import('@/lib/dietary/dietary-aggregation');
  const { consolidateAllergens } = await import('@/lib/allergens/australian-allergens');

  const [allergens, dietaryStatus] = await Promise.all([
    aggregateDishAllergens(dishId),
    aggregateDishDietaryStatus(dishId),
  ]);

  // Consolidate allergens for validation
  const consolidatedAllergens = consolidateAllergens(allergens || []);

  // Runtime validation: check for conflict between vegan status and allergens
  let validatedIsVegan = dietaryStatus?.isVegan ?? null;
  if (validatedIsVegan === true) {
    const hasMilk = consolidatedAllergens.includes('milk');
    const hasEggs = consolidatedAllergens.includes('eggs');
    if (hasMilk || hasEggs) {
      logger.warn('[Dishes API] Runtime validation: vegan=true but allergens include milk/eggs', {
        dishId,
        dishName: dish.dish_name,
        allergens: consolidatedAllergens,
        hasMilk,
        hasEggs,
      });
      validatedIsVegan = false;
    }
  }

  // Update dish cache with aggregated allergens if they differ
  // Check for allergens safely
  const currentAllergens = 'allergens' in dish ? (dish as EnrichedDish).allergens : undefined;

  if (
    allergens &&
    allergens.length > 0 &&
    (!currentAllergens || JSON.stringify(currentAllergens) !== JSON.stringify(allergens))
  ) {
    // Update cache in background (don't await)
    if (supabaseAdmin) {
      supabaseAdmin
        .from('dishes')
        .update({ allergens })
        .eq('id', dishId)
        .then(({ error }) => {
          if (error) {
            logger.warn('[Dishes API] Failed to cache aggregated allergens:', {
              dishId,
              error: error.message,
            });
          }
        });
    }
  }

  // Enrich dish with allergens and dietary info
  return {
    ...dish,
    allergens: consolidatedAllergens,
    is_vegetarian: dietaryStatus?.isVegetarian ?? null,
    is_vegan: validatedIsVegan,
    dietary_confidence: dietaryStatus?.confidence ?? null,
    dietary_method: dietaryStatus?.method ?? null,
  };
}
