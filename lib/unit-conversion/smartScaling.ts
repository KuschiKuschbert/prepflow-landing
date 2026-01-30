import { getUnitCategory } from './unitCategories';

/**
 * Smartly scales units to more human-readable formats.
 * e.g. 1000 g -> 1 kg
 *      1200 ml -> 1.2 l
 * Respects the unit category (weight vs volume).
 */
export function smartScaleUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  const q = Number(quantity);
  const u = unit.toLowerCase().trim();
  const category = getUnitCategory(u);

  if (isNaN(q)) return { quantity, unit };

  if (category === 'weight') {
    // If unit is g/gram/grams and >= 1000, convert to kg
    if (['g', 'gram', 'grams'].includes(u)) {
      if (q >= 1000) {
        return { quantity: q / 1000, unit: 'kg' };
      }
    }
    // If unit is mg? (Not usually in recipes, but good to know)
  }

  if (category === 'volume') {
    // If unit is ml/milliliter and >= 1000, convert to l
    if (['ml', 'milliliter', 'milliliters'].includes(u)) {
      if (q >= 1000) {
        return { quantity: q / 1000, unit: 'l' };
      }
    }
  }

  return { quantity: q, unit: u };
}
