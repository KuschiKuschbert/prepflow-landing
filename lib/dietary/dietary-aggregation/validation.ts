/**
 * Validation utilities for dietary status.
 * Validates dietary status against allergens to prevent conflicts.
 */

import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { logger } from '@/lib/logger';
import type { DietaryDetectionResult } from '../vegetarian-vegan-detection';

/**
 * Validate dietary status against allergens
 * Returns corrected result if conflict detected (vegan=true but allergens include milk/eggs)
 */
export function validateDietaryAgainstAllergens(
  result: DietaryDetectionResult,
  allergens: string[],
  id: string,
  type: 'recipe' | 'dish',
): DietaryDetectionResult {
  // Consolidate allergens to handle old codes
  const consolidatedAllergens = consolidateAllergens(allergens || []);

  // Check for conflict: vegan=true but allergens include milk or eggs
  if (result.isVegan === true) {
    const hasMilk = consolidatedAllergens.includes('milk');
    const hasEggs = consolidatedAllergens.includes('eggs');

    if (hasMilk || hasEggs) {
      logger.warn(
        '[Dietary Aggregation] Conflict detected: vegan=true but allergens include milk/eggs',
        {
          id,
          type,
          allergens: consolidatedAllergens,
          hasMilk,
          hasEggs,
          originalResult: result,
        },
      );

      // Correct the result
      return {
        ...result,
        isVegan: false,
        confidence: 'high', // We know for certain it's not vegan
        reason: result.reason
          ? `${result.reason}; Corrected: contains ${hasMilk ? 'milk' : ''}${hasMilk && hasEggs ? ' and ' : ''}${hasEggs ? 'eggs' : ''}`
          : `Contains ${hasMilk ? 'milk' : ''}${hasMilk && hasEggs ? ' and ' : ''}${hasEggs ? 'eggs' : ''}`,
      };
    }
  }

  return result;
}
