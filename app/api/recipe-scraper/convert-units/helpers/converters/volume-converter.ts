import { logger } from '@/lib/logger';
import { convertUnit } from '@/lib/unit-conversion';
import { ConversionResult } from '../types';

export const VOLUME_UNITS_TO_CONVERT = [
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

export function convertVolumeUnit(
  quantity: number,
  unit: string,
  normalized: string,
): ConversionResult | null {
  if (!VOLUME_UNITS_TO_CONVERT.includes(normalized)) {
    return null;
  }

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
