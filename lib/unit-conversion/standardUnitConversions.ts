import { ConversionResult, convertUnit, STANDARD_UNITS } from '../unit-conversion';
import { getIngredientDensity } from './density-map';
import { smartRound } from './rounding';
import { getUnitCategory } from './unitCategories';
import { normalizeUnit } from './unitMappings';

export function convertToStandardUnit(
  value: number,
  fromUnit: string,
  ingredientName?: string,
): ConversionResult {
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
      // Check if we should convert Volume -> Weight (e.g. for solids like 'Salt')
      // Heuristic: If ingredient has a known density AND it's a solid, user might prefer Grams over ML.
      // However, the function contract implies standardizing within category unless forced?
      // Actually, standard unit for 'volume' is 'ml'.
      // But user complained "salt is solid, it should be measured in grams".

      // Extended Logic:
      // If ingredientName provided, check density.
      // If density exists, and usually measured by weight (like salt/flour/meat), convert to grams?
      // Or should we implicitly prefer weight for density-known items?
      // Let's default to WEIGHT (g) if density is known, effectively changing the 'Standard' unit for that ingredient.

      const density = ingredientName ? getIngredientDensity(ingredientName) : null;

      if (density) {
        // Convert Volume (ml) -> Weight (g)
        // Mass = Volume * Density
        const mlValue =
          normalized === 'ml' ? value : convertUnit(value, normalized, STANDARD_UNITS.VOLUME).value;
        convertedValue = mlValue * density;
        standardUnit = STANDARD_UNITS.WEIGHT; // Switch target to Grams
      } else {
        standardUnit = STANDARD_UNITS.VOLUME;
        convertedValue =
          normalized === 'ml' ? value : convertUnit(value, normalized, STANDARD_UNITS.VOLUME).value;
      }
      break;
    case 'piece':
      standardUnit = STANDARD_UNITS.PIECE;
      convertedValue = value;
      break;
      standardUnit = STANDARD_UNITS.PIECE;
      convertedValue = value;
  }
  return {
    value: smartRound(convertedValue),
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
