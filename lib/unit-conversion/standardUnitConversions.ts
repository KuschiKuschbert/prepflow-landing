import { ConversionResult, convertUnit, STANDARD_UNITS } from '../unit-conversion';
import { getUnitCategory } from './unitCategories';
import { normalizeUnit } from './unitMappings';

export function convertToStandardUnit(value: number, fromUnit: string): ConversionResult {
  const normalized = normalizeUnit(fromUnit);
  const category = getUnitCategory(normalized);
  let standardUnit: string;
  let convertedValue: number;
  switch (category) {
    case 'weight':
      standardUnit = STANDARD_UNITS.WEIGHT;
      convertedValue =
        normalized === 'g' ? value : convertUnit(value, normalized, STANDARD_UNITS.WEIGHT).value;
      break;
    case 'volume':
      standardUnit = STANDARD_UNITS.VOLUME;
      convertedValue =
        normalized === 'ml' ? value : convertUnit(value, normalized, STANDARD_UNITS.VOLUME).value;
      break;
    case 'piece':
      standardUnit = STANDARD_UNITS.PIECE;
      convertedValue = value;
      break;
    default:
      standardUnit = STANDARD_UNITS.PIECE;
      convertedValue = value;
  }
  return {
    value: convertedValue,
    unit: standardUnit,
    originalValue: value,
    originalUnit: fromUnit,
  };
}

export function convertFromStandardUnit(value: number, toUnit: string): ConversionResult {
  const normalized = normalizeUnit(toUnit);
  const category = getUnitCategory(normalized);
  let standardUnit: string;
  let convertedValue: number;
  switch (category) {
    case 'weight':
      standardUnit = STANDARD_UNITS.WEIGHT;
      convertedValue =
        normalized === 'g' ? value : convertUnit(value, STANDARD_UNITS.WEIGHT, normalized).value;
      break;
    case 'volume':
      standardUnit = STANDARD_UNITS.VOLUME;
      convertedValue =
        normalized === 'ml' ? value : convertUnit(value, STANDARD_UNITS.VOLUME, normalized).value;
      break;
    case 'piece':
      standardUnit = STANDARD_UNITS.PIECE;
      convertedValue = value;
      break;
    default:
      standardUnit = STANDARD_UNITS.PIECE;
      convertedValue = value;
  }
  return {
    value: convertedValue,
    unit: normalized,
    originalValue: value,
    originalUnit: standardUnit,
  };
}
