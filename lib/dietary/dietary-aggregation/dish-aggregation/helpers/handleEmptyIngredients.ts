import { cacheDietaryStatus } from '../../cache-management';
import type { DietaryDetectionResult } from '../../vegetarian-vegan-detection';

/**
 * Handle dish with no ingredients - check name and return default result
 */
export async function handleEmptyDishIngredients(
  dishId: string,
  dishName?: string,
): Promise<DietaryDetectionResult> {
  const { isNonVegetarianIngredient } = await import('@/lib/dietary/vegetarian-vegan-detection');
  const name = dishName || '';

  if (name && isNonVegetarianIngredient(name)) {
    const result: DietaryDetectionResult = {
      isVegetarian: false,
      isVegan: false,
      confidence: 'high',
      reason: `Dish name "${name}" contains meat/fish keywords`,
      method: 'non-ai',
    };
    await cacheDietaryStatus(dishId, result, 'dish', []);
    return result;
  }

  const result: DietaryDetectionResult = {
    isVegetarian: true,
    isVegan: true,
    confidence: 'high',
    reason: 'No ingredients specified',
    method: 'non-ai',
  };
  await cacheDietaryStatus(dishId, result, 'dish', []);
  return result;
}
