/**
 * Unit conversion utilities for recipe card scaling
 */

/**
 * Convert quantity to larger unit if appropriate (e.g., 1000 GM → 1 KG)
 *
 * @param {number} quantity - Quantity to convert
 * @param {string} unit - Current unit
 * @returns {Object} Object with converted quantity and unit, or original if no conversion needed
 */
export function convertToLargerUnit(
  quantity: number,
  unit: string,
): { quantity: number; unit: string } {
  const normalizedUnit = unit.toLowerCase().trim();

  // Weight conversions: GM/G → KG
  if (
    normalizedUnit === 'gm' ||
    normalizedUnit === 'g' ||
    normalizedUnit === 'gram' ||
    normalizedUnit === 'grams'
  ) {
    if (quantity >= 1000) {
      return {
        quantity: quantity / 1000,
        unit: 'KG',
      };
    }
  }

  // Volume conversions: ML → L
  if (
    normalizedUnit === 'ml' ||
    normalizedUnit === 'milliliter' ||
    normalizedUnit === 'milliliters'
  ) {
    if (quantity >= 1000) {
      return {
        quantity: quantity / 1000,
        unit: 'L',
      };
    }
  }

  // Return original if no conversion needed
  return { quantity, unit };
}
