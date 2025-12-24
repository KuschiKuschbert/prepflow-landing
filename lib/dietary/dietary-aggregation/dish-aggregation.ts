/**
 * Dish dietary status aggregation.
 * Aggregates vegetarian/vegan status for dishes from recipes and ingredients.
 */

import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { detectDietarySuitability } from '../vegetarian-vegan-detection';
import { cacheDietaryStatus } from './cache-management';
import { checkCachedDishDietaryStatus } from './dish-aggregation/helpers/checkCachedStatus';
import { fetchDishIngredients } from './dish-aggregation/helpers/fetchDishIngredients';
import { handleEmptyDishIngredients } from './dish-aggregation/helpers/handleEmptyIngredients';
import { aggregateIngredientAllergens } from './recipe-aggregation/helpers/aggregateAllergens';

/**
 * Aggregate dietary status for a single dish
 */
export async function aggregateDishDietaryStatus(
  dishId: string,
  useAI?: boolean,
  force: boolean = false,
): Promise<import('../vegetarian-vegan-detection').DietaryDetectionResult | null> {
  if (!supabaseAdmin) {
    logger.error('[Dietary Aggregation] Supabase admin client not available');
    return null;
  }

  try {
    const cachedStatus = await checkCachedDishDietaryStatus(dishId, force);
    if (cachedStatus) {
      return cachedStatus;
    }

    const allIngredients = await fetchDishIngredients(dishId);

    const { data: dishData, error: dishDataError } = await supabaseAdmin
      .from('dishes')
      .select('dish_name, description')
      .eq('id', dishId)
      .single();

    if (dishDataError) {
      logger.error('[Dietary Aggregation] Error fetching dish data:', {
        error: dishDataError.message,
        dishId,
        context: { operation: 'aggregateDishDietaryStatus' },
      });
    }

    if (allIngredients.length === 0) {
      return await handleEmptyDishIngredients(dishId, dishData?.dish_name);
    }

    const aggregatedAllergens = aggregateIngredientAllergens(allIngredients);

    const result = await detectDietarySuitability(
      dishId,
      allIngredients,
      dishData?.dish_name,
      dishData?.description,
      useAI,
    );

    await cacheDietaryStatus(dishId, result, 'dish', aggregatedAllergens);
    return result;
  } catch (err) {
    logger.error('[Dietary Aggregation] Error aggregating dish dietary status:', err);
    return null;
  }
}
