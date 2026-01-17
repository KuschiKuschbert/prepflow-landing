import { logger } from '@/lib/logger';
import { EnrichedDishData, RawMenuItem } from '../../../helpers/schemas';
import { normalizeAllergens } from './normalizeAllergens';
import { validateVeganStatus } from './validateDietaryStatus';

/**
 * Enriches a dish item with allergens and dietary information
 *
 * @param {RawMenuItem} item - Menu item with dish data
 * @returns {Promise<EnrichedDishData>} Enriched dish data
 */
export async function enrichDishItem(item: RawMenuItem): Promise<EnrichedDishData> {
  const dishName = item.dishes?.dish_name || 'Unknown Dish';
  let allergens: string[] = [];
  let isVegetarian: boolean | null = null;
  let isVegan: boolean | null = null;
  let dietaryConfidence: string | null = null;
  let dietaryMethod: string | null = null;

  // Check if cached allergens exist
  const hasCachedAllergens =
    item.dishes?.allergens !== undefined &&
    item.dishes?.allergens !== null &&
    Array.isArray(item.dishes?.allergens) &&
    item.dishes?.allergens.length > 0;

  if (hasCachedAllergens) {
    // Use cached allergens (faster) but normalize them
    allergens = normalizeAllergens(item.dishes!.allergens as string[], dishName);
    logger.dev('[Menus API] Using cached dish allergens:', {
      dishName,
      allergens,
      dishId: item.dishes!.id,
    });
  } else {
    // Only aggregate if no cached allergens exist
    try {
      const { aggregateDishAllergens } = await import('@/lib/allergens/allergen-aggregation');
      if (item.dishes?.id) {
        allergens = (await aggregateDishAllergens(item.dishes.id, false)) as string[];
        logger.dev('[Menus API] Aggregated dish allergens:', {
          dishName,
          aggregated: allergens,
          dishId: item.dishes.id,
        });
      }
    } catch (err: unknown) {
      logger.warn('[Menus API] Error aggregating dish allergens:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      allergens = [];
    }
  }

  // Always trigger dietary recalculation to ensure fresh data
  try {
    const { aggregateDishDietaryStatus } = await import('@/lib/dietary/dietary-aggregation');
    if (item.dishes?.id) {
      const dietaryResult = await aggregateDishDietaryStatus(item.dishes.id, false, true);
      if (dietaryResult) {
        // Runtime validation: check for conflict between vegan status and allergens
        const validatedIsVegan = validateVeganStatus(
          dietaryResult.isVegan,
          allergens,
          'dish',
          item.dishes.id,
          dishName,
        );

        logger.dev('[Menus API] Dish dietary recalculation result:', {
          dishId: item.dishes.id,
          dishName,
          isVegetarian: dietaryResult.isVegetarian,
          isVegan: validatedIsVegan,
          wasCorrected: validatedIsVegan !== dietaryResult.isVegan,
          confidence: dietaryResult.confidence,
          method: dietaryResult.method,
        });

        isVegetarian = dietaryResult.isVegetarian;
        isVegan = validatedIsVegan;
        dietaryConfidence = dietaryResult.confidence;
        dietaryMethod = dietaryResult.method;
      } else {
        // Fallback to cached values if recalculation fails
        const cachedIsVegan = validateVeganStatus(
          item.dishes?.is_vegan ?? null,
          allergens,
          'dish',
          item.dishes.id,
          dishName,
        );

        isVegetarian = item.dishes?.is_vegetarian ?? null;
        isVegan = cachedIsVegan;
        dietaryConfidence = item.dishes?.dietary_confidence ?? null;
        dietaryMethod = item.dishes?.dietary_method ?? null;
      }
    }
  } catch (err: unknown) {
    logger.warn('[Menus API] Error recalculating dish dietary status, using cached values:', {
      dishId: item.dishes?.id,
      error: err instanceof Error ? err.message : String(err),
    });

    if (item.dishes?.id) {
      // Fallback to cached values, but validate against allergens
      const cachedIsVegan = validateVeganStatus(
        item.dishes.is_vegan ?? null,
        allergens,
        'dish',
        item.dishes.id,
        dishName,
      );

      isVegetarian = item.dishes.is_vegetarian ?? null;
      isVegan = cachedIsVegan;
      dietaryConfidence = item.dishes.dietary_confidence ?? null;
      dietaryMethod = item.dishes.dietary_method ?? null;
    }
  }

  return {
    allergens,
    isVegetarian,
    isVegan,
    dietaryConfidence,
    dietaryMethod,
  };
}
