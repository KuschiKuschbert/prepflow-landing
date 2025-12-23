import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { DietaryDetectionResult } from '../../vegetarian-vegan-detection';

/**
 * Check if dish has cached dietary status that's still valid
 */
export async function checkCachedDishDietaryStatus(
  dishId: string,
  force: boolean,
): Promise<DietaryDetectionResult | null> {
  const { data: dish, error: dishError } = await supabaseAdmin
    .from('dishes')
    .select('is_vegetarian, is_vegan, dietary_confidence, dietary_method, dietary_checked_at')
    .eq('id', dishId)
    .single();

  if (dishError) {
    return null;
  }

  if (
    !force &&
    dish?.is_vegetarian !== null &&
    dish?.is_vegan !== null &&
    dish?.dietary_checked_at
  ) {
    const checkedAt = new Date(dish.dietary_checked_at);
    const daysSinceCheck = (Date.now() - checkedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCheck < 7) {
      return {
        isVegetarian: dish.is_vegetarian,
        isVegan: dish.is_vegan,
        confidence: (dish.dietary_confidence as 'high' | 'medium' | 'low') || 'medium',
        method: (dish.dietary_method as 'non-ai' | 'ai') || 'non-ai',
      };
    }
  }

  return null;
}
