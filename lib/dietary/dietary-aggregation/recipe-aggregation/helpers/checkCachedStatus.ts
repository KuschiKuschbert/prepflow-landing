import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { DietaryDetectionResult } from '../../../vegetarian-vegan-detection';

/**
 * Check if recipe has cached dietary status that's still valid
 *
 * @param {string} recipeId - Recipe ID
 * @param {boolean} force - Force recalculation even if cached
 * @returns {Promise<DietaryDetectionResult | null>} Cached result or null if not cached/invalid
 */
export async function checkCachedRecipeDietaryStatus(
  recipeId: string,
  force: boolean,
): Promise<DietaryDetectionResult | null> {
  if (!supabaseAdmin) {
    return null;
  }

  const { data: recipe, error: recipeError } = await supabaseAdmin
    .from('recipes')
    .select('is_vegetarian, is_vegan, dietary_confidence, dietary_method, dietary_checked_at')
    .eq('id', recipeId)
    .single();

  if (recipeError) {
    logger.error('[Dietary Aggregation] Failed to fetch recipe:', {
      recipeId,
      error: recipeError.message,
    });
    return null;
  }

  // Return cached status if available and recent (within 7 days) and not forcing
  if (
    !force &&
    recipe?.is_vegetarian !== null &&
    recipe?.is_vegan !== null &&
    recipe?.dietary_checked_at
  ) {
    const checkedAt = new Date(recipe.dietary_checked_at);
    const daysSinceCheck = (Date.now() - checkedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCheck < 7) {
      return {
        isVegetarian: recipe.is_vegetarian,
        isVegan: recipe.is_vegan,
        confidence: (recipe.dietary_confidence as 'high' | 'medium' | 'low') || 'medium',
        method: (recipe.dietary_method as 'non-ai' | 'ai') || 'non-ai',
      };
    }
  }

  return null;
}
