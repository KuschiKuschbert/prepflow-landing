/**
 * Unit conversion helpers for Australian units
 */

import { logger } from '@/lib/logger';
import { getUnitCategory, normalizeUnit } from '@/lib/unit-conversion';
import { convertVolumeUnit } from './converters/volume-converter';
import { convertWeightUnit } from './converters/weight-converter';
import { ConversionResult } from './types';

/**
 * Convert ingredient unit to Australian units
 * - Volume: cups, fl_oz, tsp, tbsp → ml (or l if >= 1000ml)
 * - Weight: oz, lb → g (or kg if >= 1000g)
 * - Keep: ml, l, g, kg, pc, box, pack, etc.
 */
export function convertToAustralianUnit(quantity: number, unit: string): ConversionResult {
  if (!unit) {
    return { quantity, unit: '', converted: false, reason: 'no unit' };
  }

  const normalized = normalizeUnit(unit);
  const category = getUnitCategory(normalized);

  // Debug: Log what we're trying to convert
  logger.dev('[Unit Conversion] Converting unit:', {
    original: unit,
    normalized,
    category,
    quantity,
  });

  // Already Australian units - no conversion needed
  const australianUnits = [
    'ml',
    'l',
    'gm',
    'g',
    'kg',
    'pc',
    'box',
    'pack',
    'bag',
    'bottle',
    'can',
    'bunch',
    'piece',
    'pieces',
  ];
  if (australianUnits.includes(normalized)) {
    // Convert gm to g for consistency
    if (normalized === 'gm') {
      return { quantity, unit: 'g', converted: true, reason: 'normalized gm to g' };
    }
    return { quantity, unit: normalized, converted: false, reason: 'already Australian unit' };
  }

  // Volume conversions to ml
  if (category === 'volume') {
    const volumeResult = convertVolumeUnit(quantity, unit, normalized);
    if (volumeResult) return volumeResult;
  }

  // Weight conversions to g
  if (category === 'weight') {
    const weightResult = convertWeightUnit(quantity, unit, normalized);
    if (weightResult) return weightResult;
  }

  // Unknown unit - log it for debugging
  logger.warn('[Unit Conversion] Unknown unit (not converted):', {
    original: unit,
    normalized,
    category,
    quantity,
  });
  return { quantity, unit: normalized, converted: false, reason: `unknown unit: ${normalized}` };
}
