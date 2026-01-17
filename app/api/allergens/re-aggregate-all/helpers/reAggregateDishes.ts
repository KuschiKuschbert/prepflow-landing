import { aggregateDishAllergens } from '@/lib/allergens/allergen-aggregation';
import { logger, type ErrorContext } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface DishAggregationResult {
  total: number;
  aggregated: number;
  results: Record<string, string[]>;
}

/**
 * Fetches all dishes and forces allergen re-aggregation.
 */
export async function reAggregateDishes(): Promise<DishAggregationResult> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // Fetch all dish IDs
  const { data: dishes, error: dishesError } = await supabaseAdmin.from('dishes').select('id');

  if (dishesError && dishesError.code !== '42P01') {
    // Ignore table doesn't exist error
    logger.warn(
      '[Re-aggregate All Allergens API] Error fetching dishes:',
      dishesError as unknown as ErrorContext,
    );
  }

  const dishIds = (dishes || []).map(d => d.id);
  const result: DishAggregationResult = {
    total: dishIds.length,
    aggregated: 0,
    results: {},
  };

  if (dishIds.length > 0) {
    try {
      const dishAllergens = await Promise.all(
        dishIds.map(async dishId => {
          try {
            const allergens = await aggregateDishAllergens(dishId, true);
            return { dishId, allergens };
          } catch (err) {
            logger.error('[Re-aggregate All Allergens API] Error aggregating dish allergens:', {
              error: err instanceof Error ? err.message : String(err),
              stack: err instanceof Error ? err.stack : undefined,
              context: { dishId, operation: 'aggregateDishAllergens' },
            });
            return { dishId, allergens: [] };
          }
        }),
      );

      dishAllergens.forEach(({ dishId, allergens }) => {
        result.results[dishId] = allergens;
      });
      result.aggregated = Object.keys(result.results).length;

      logger.dev(
        `[Re-aggregate All Allergens API] Successfully re-aggregated allergens for ${result.aggregated} dishes`,
      );
    } catch (err) {
      logger.error('[Re-aggregate All Allergens API] Error aggregating dish allergens:', err);
    }
  }

  return result;
}
