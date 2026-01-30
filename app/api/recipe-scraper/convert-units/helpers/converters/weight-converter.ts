import { logger } from '@/lib/logger';
import { convertUnit } from '@/lib/unit-conversion';
import { ConversionResult } from '../types';

export const WEIGHT_UNITS_TO_CONVERT = ['oz', 'ounce', 'ounces', 'lb', 'pound', 'pounds'];

export function convertWeightUnit(
  quantity: number,
  unit: string,
  normalized: string,
): ConversionResult | null {
  if (!WEIGHT_UNITS_TO_CONVERT.includes(normalized)) {
    return null;
  }

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
