import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { DietaryDetectionResult } from '../vegetarian-vegan-detection';
import { validateDietaryAgainstAllergens } from './validation';

/**
 * Cache dietary status in database
 * Validates against allergens before saving to prevent conflicts
 * @param aggregatedAllergens - Allergens aggregated from ingredients (optional, for validation)
 */
export async function cacheDietaryStatus(
  id: string,
  result: DietaryDetectionResult,
  type: 'recipe' | 'dish',
  aggregatedAllergens?: string[],
): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    // Fetch current cached allergens to validate against
    const table = type === 'recipe' ? 'recipes' : 'dishes';
    const { data: currentData } = await supabaseAdmin
      .from(table)
      .select('allergens')
      .eq('id', id)
      .single();

    const currentAllergens = (currentData?.allergens as string[]) || [];

    // Use aggregated allergens if provided (more accurate), otherwise use cached allergens
    const allergensToCheck =
      aggregatedAllergens && aggregatedAllergens.length > 0
        ? aggregatedAllergens
        : currentAllergens;

    // Validate dietary status against allergens
    const validatedResult = validateDietaryAgainstAllergens(result, allergensToCheck, id, type);

    const { error } = await supabaseAdmin
      .from(table)
      .update({
        is_vegetarian: validatedResult.isVegetarian,
        is_vegan: validatedResult.isVegan,
        dietary_confidence: validatedResult.confidence,
        dietary_method: validatedResult.method,
        dietary_checked_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      logger.error('[Dietary Aggregation] Failed to cache dietary status:', {
        id,
        type,
        error: error.message,
        result: validatedResult,
      });
    } else {
      logger.dev('[Dietary Aggregation] Successfully cached dietary status:', {
        id,
        type,
        isVegetarian: validatedResult.isVegetarian,
        isVegan: validatedResult.isVegan,
        wasCorrected: validatedResult.isVegan !== result.isVegan,
      });
    }
  } catch (err) {
    logger.error('[Dietary Aggregation] Failed to cache dietary status:', err);
  }
}

/**
 * Invalidate dietary cache for a recipe or dish
 * Clears the dietary_checked_at timestamp to force recalculation
 */
export async function invalidateDietaryCache(id: string, type: 'recipe' | 'dish'): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    const table = type === 'recipe' ? 'recipes' : 'dishes';
    const { error } = await supabaseAdmin
      .from(table)
      .update({ dietary_checked_at: null })
      .eq('id', id);

    if (error) {
      logger.error('[Dietary Aggregation] Failed to invalidate dietary cache:', {
        id,
        type,
        error: error.message,
      });
    } else {
      logger.dev('[Dietary Aggregation] Successfully invalidated dietary cache:', {
        id,
        type,
      });
    }
  } catch (err) {
    logger.error('[Dietary Aggregation] Failed to invalidate dietary cache:', err);
  }
}
