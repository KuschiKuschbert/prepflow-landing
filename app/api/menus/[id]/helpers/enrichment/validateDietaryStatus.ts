/**
 * Helper for validating dietary status against allergens
 */

import { logger } from '@/lib/logger';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';

/**
 * Validates vegan status against allergens (milk/eggs conflict)
 *
 * @param {boolean | null} isVegan - Current vegan status
 * @param {string[]} allergens - Allergen codes
 * @param {string} itemType - Item type ('dish' or 'recipe')
 * @param {string} itemId - Item ID
 * @param {string} itemName - Item name
 * @returns {boolean | null} Validated vegan status
 */
export function validateVeganStatus(
  isVegan: boolean | null,
  allergens: string[],
  itemType: 'dish' | 'recipe',
  itemId: string,
  itemName: string,
): boolean | null {
  if (isVegan !== true) {
    return isVegan;
  }

  const consolidatedAllergens = consolidateAllergens(allergens || []);
  const hasMilk = consolidatedAllergens.includes('milk');
  const hasEggs = consolidatedAllergens.includes('eggs');

  if (hasMilk || hasEggs) {
    logger.warn(
      `[Menus API] Runtime validation: ${itemType} vegan=true but allergens include milk/eggs`,
      {
        [`${itemType}Id`]: itemId,
        [`${itemType}Name`]: itemName,
        allergens: consolidatedAllergens,
        hasMilk,
        hasEggs,
      },
    );
    return false;
  }

  return true;
}
