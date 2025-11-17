import { UNIT_ALIASES, conversions, normalizeUnit } from './unit-conversion/unitMappings';

export interface ConversionResult {
  value: number;
  unit: string;
  originalValue: number;
  originalUnit: string;
}

export { normalizeUnit };

export function convertUnit(value: number, fromUnit: string, toUnit: string): ConversionResult {
  const normalizedFrom = normalizeUnit(fromUnit);
  const normalizedTo = normalizeUnit(toUnit);
  if (normalizedFrom === normalizedTo)
    return { value, unit: normalizedTo, originalValue: value, originalUnit: fromUnit };
  const conversionFactor = conversions[normalizedFrom]?.[normalizedTo];
  if (!conversionFactor)
    return { value, unit: normalizedTo, originalValue: value, originalUnit: fromUnit };
  return {
    value: value * conversionFactor,
    unit: normalizedTo,
    originalValue: value,
    originalUnit: fromUnit,
  };
}

export function convertIngredientCost(
  cost: number,
  fromUnit: string,
  toUnit: string,
  quantity: number = 1,
): number {
  const conversion = convertUnit(1, fromUnit, toUnit);
  return cost / conversion.value;
}

export function formatUnit(value: number, unit: string): string {
  return `${value.toFixed(2)} ${unit}`;
}

export const STANDARD_UNITS = { WEIGHT: 'g', VOLUME: 'ml', PIECE: 'pc' } as const;
export type { UnitCategory } from './unit-conversion/unitCategories';
export {
  getAllUnits,
  isVolumeUnit,
  isWeightUnit,
  isPieceUnit,
  getUnitCategory,
} from './unit-conversion/unitCategories';
export {
  convertToStandardUnit,
  convertFromStandardUnit,
} from './unit-conversion/standardUnitConversions';

export function convertCupMeasurements(
  value: number,
  fromUnit: string,
  toUnit: string,
): ConversionResult {
  return convertUnit(value, fromUnit, toUnit);
}

export function parseUnit(unitString: string): { value: number; unit: string } {
  const match = unitString.match(/^([\d.]+)\s*(.*)$/);
  if (match) return { value: parseFloat(match[1]), unit: match[2].trim() };
  return { value: 0, unit: unitString };
}
