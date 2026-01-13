/**
 * Helper to recalculate dietary status for all menu items.
 */

import {
  aggregateDishDietaryStatus,
  aggregateRecipeDietaryStatus,
} from '@/lib/dietary/dietary-aggregation';
import { logger } from '@/lib/logger';
import { EnrichedMenuItem } from '../../../types';

/**
 * Recalculate dietary status for all recipes/dishes in menu items.
 */
export async function recalculateDietaryStatus(items: EnrichedMenuItem[]): Promise<void> {
  const dietaryRecalculations = items.map(async (item: EnrichedMenuItem) => {
    try {
      if (item.recipe_id) {
        await aggregateRecipeDietaryStatus(item.recipe_id, false, true);
      } else if (item.dish_id) {
        await aggregateDishDietaryStatus(item.dish_id, false, true);
      }
    } catch (err) {
      logger.warn('[Combined Export] Failed to recalculate dietary status:', {
        itemId: item.recipe_id || item.dish_id,
        type: item.recipe_id ? 'recipe' : 'dish',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });

  await Promise.all(dietaryRecalculations);
}
