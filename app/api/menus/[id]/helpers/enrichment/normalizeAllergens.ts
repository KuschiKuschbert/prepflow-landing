/**
 * Helper for normalizing allergens from Supabase JSONB
 */

import { logger } from '@/lib/logger';
import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';

/**
 * Normalizes allergens from Supabase JSONB format
 *
 * @param {any} allergenData - Allergen data from database
 * @param {string} [itemName] - Item name for logging
 * @returns {string[]} Normalized allergen codes
 */
export function normalizeAllergens(allergenData: any, itemName?: string): string[] {
  if (!allergenData) return [];
  if (Array.isArray(allergenData)) {
    // Filter out invalid values and ensure strings
    const validAllergens = allergenData.filter(
      (a): a is string => typeof a === 'string' && a.length > 0,
    );

    // Consolidate and validate against known allergen codes
    const validCodes = AUSTRALIAN_ALLERGENS.map(a => a.code);
    const consolidated = consolidateAllergens(validAllergens);
    const filtered = consolidated.filter(code => validCodes.includes(code));

    // Log if we filtered out invalid codes
    if (validAllergens.length !== filtered.length && itemName) {
      logger.warn('[Menus API] Filtered out invalid allergen codes:', {
        itemName,
        original: validAllergens,
        filtered,
        removed: validAllergens.filter(c => !validCodes.includes(c)),
      });
    }

    return filtered;
  }
  // If it's not an array, return empty (shouldn't happen but handle gracefully)
  logger.warn('[Menus API] Allergens is not an array:', {
    type: typeof allergenData,
    value: allergenData,
    itemName,
  });
  return [];
}




