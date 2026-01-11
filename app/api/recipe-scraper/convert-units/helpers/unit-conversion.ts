/**
 * Unit conversion helpers for Australian units
 */

import { convertUnit, normalizeUnit, getUnitCategory } from '@/lib/unit-conversion';
import { logger } from '@/lib/logger';

interface ConversionResult {
  quantity: number;
  unit: string;
  converted: boolean;
  reason?: string;
}

/**
 * Convert ingredient unit to Australian units
 * - Volume: cups, fl_oz, tsp, tbsp → ml (or l if >= 1000ml)
 * - Weight: oz, lb → g (or kg if >= 1000g)
 * - Keep: ml, l, g, kg, pc, box, pack, etc.
 */
export function convertToAustralianUnit(
  quantity: number,
  unit: string,
): ConversionResult {
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
    const volumeUnitsToConvert = [
      'cup',
      'cups',
      'fl_oz',
      'tsp',
      'tbsp',
      'teaspoon',
      'teaspoons',
      'tablespoon',
      'tablespoons',
      'fluid ounce',
      'fluid ounces',
    ];

    if (volumeUnitsToConvert.includes(normalized)) {
      try {
        const result = convertUnit(quantity, normalized, 'ml');
        // Convert to liters if >= 1000ml
        if (result.value >= 1000) {
          const literResult = convertUnit(result.value, 'ml', 'l');
          logger.dev('[Unit Conversion] Volume conversion:', {
            original: `${quantity} ${unit}`,
            converted: `${literResult.value} l`,
          });
          return {
            quantity: Math.round(literResult.value * 100) / 100, // Round to 2 decimals
            unit: 'l',
            converted: true,
            reason: `converted ${normalized} to l`,
          };
        }
        logger.dev('[Unit Conversion] Volume conversion:', {
          original: `${quantity} ${unit}`,
          converted: `${result.value} ml`,
        });
        return {
          quantity: Math.round(result.value * 100) / 100, // Round to 2 decimals
          unit: 'ml',
          converted: true,
          reason: `converted ${normalized} to ml`,
        };
      } catch (error) {
        logger.warn('[Unit Conversion] Failed to convert volume unit:', {
          unit,
          normalized,
          error: error instanceof Error ? error.message : String(error),
        });
        return { quantity, unit: normalized, converted: false, reason: 'conversion failed' };
      }
    }
  }

  // Weight conversions to g
  if (category === 'weight') {
    const weightUnitsToConvert = ['oz', 'ounce', 'ounces', 'lb', 'pound', 'pounds'];

    if (weightUnitsToConvert.includes(normalized)) {
      try {
        const result = convertUnit(quantity, normalized, 'g');
        // Convert to kg if >= 1000g
        if (result.value >= 1000) {
          const kgResult = convertUnit(result.value, 'g', 'kg');
          logger.dev('[Unit Conversion] Weight conversion:', {
            original: `${quantity} ${unit}`,
            converted: `${kgResult.value} kg`,
          });
          return {
            quantity: Math.round(kgResult.value * 100) / 100, // Round to 2 decimals
            unit: 'kg',
            converted: true,
            reason: `converted ${normalized} to kg`,
          };
        }
        logger.dev('[Unit Conversion] Weight conversion:', {
          original: `${quantity} ${unit}`,
          converted: `${result.value} g`,
        });
        return {
          quantity: Math.round(result.value * 100) / 100, // Round to 2 decimals
          unit: 'g',
          converted: true,
          reason: `converted ${normalized} to g`,
        };
      } catch (error) {
        logger.warn('[Unit Conversion] Failed to convert weight unit:', {
          unit,
          normalized,
          error: error instanceof Error ? error.message : String(error),
        });
        return { quantity, unit: normalized, converted: false, reason: 'conversion failed' };
      }
    }
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
