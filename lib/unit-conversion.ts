// Unit conversion utilities
export interface ConversionResult {
  value: number;
  unit: string;
  originalValue: number;
  originalUnit: string;
}

// Unit aliases mapping (normalize various spellings to standard forms)
const UNIT_ALIASES: { [key: string]: string } = {
  // Weight aliases
  gram: 'g',
  grams: 'g',
  gm: 'g',
  kilogram: 'kg',
  kilograms: 'kg',
  ounce: 'oz',
  ounces: 'oz',
  pound: 'lb',
  pounds: 'lb',
  // Volume aliases
  milliliter: 'ml',
  milliliters: 'ml',
  litre: 'l',
  liter: 'l',
  liters: 'l',
  litres: 'l',
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  'fluid ounce': 'fl_oz',
  'fluid ounces': 'fl_oz',
  // Piece aliases
  piece: 'pc',
  pieces: 'pc',
  box: 'box',
  pack: 'pack',
  bag: 'bag',
  bottle: 'bottle',
  can: 'can',
  bunch: 'bunch',
};

// Normalize unit string to standard form
export const normalizeUnit = (unit: string): string => {
  const normalized = unit.toLowerCase().trim();
  return UNIT_ALIASES[normalized] || normalized;
};

// Comprehensive unit conversion mappings
const conversions: { [key: string]: { [key: string]: number } } = {
  // Weight conversions (to grams)
  kg: { g: 1000, lb: 2.20462, oz: 35.274 },
  g: { kg: 0.001, lb: 0.00220462, oz: 0.035274 },
  lb: { kg: 0.453592, g: 453.592, oz: 16 },
  oz: { kg: 0.0283495, g: 28.3495, lb: 0.0625 },
  // Volume conversions (to milliliters)
  l: { ml: 1000, cup: 4.22675, fl_oz: 33.814, tsp: 202.884, tbsp: 67.628 },
  ml: { l: 0.001, cup: 0.00422675, fl_oz: 0.033814, tsp: 0.202884, tbsp: 0.067628 },
  cup: { l: 0.236588, ml: 236.588, fl_oz: 8, tsp: 48, tbsp: 16 },
  fl_oz: { l: 0.0295735, ml: 29.5735, cup: 0.125, tsp: 6, tbsp: 2 },
  tsp: { ml: 4.92892, l: 0.00492892, cup: 0.0208333, fl_oz: 0.166667, tbsp: 0.333333 },
  tbsp: { ml: 14.7868, l: 0.0147868, cup: 0.0625, fl_oz: 0.5, tsp: 3 },
};

// Basic unit conversion functions
export const convertUnit = (value: number, fromUnit: string, toUnit: string): ConversionResult => {
  const normalizedFrom = normalizeUnit(fromUnit);
  const normalizedTo = normalizeUnit(toUnit);

  if (normalizedFrom === normalizedTo) {
    return {
      value,
      unit: normalizedTo,
      originalValue: value,
      originalUnit: fromUnit,
    };
  }

  const conversionFactor = conversions[normalizedFrom]?.[normalizedTo];
  if (!conversionFactor) {
    // Return original value if conversion not supported
    return {
      value,
      unit: normalizedTo,
      originalValue: value,
      originalUnit: fromUnit,
    };
  }

  return {
    value: value * conversionFactor,
    unit: normalizedTo,
    originalValue: value,
    originalUnit: fromUnit,
  };
};

export const convertIngredientCost = (
  cost: number,
  fromUnit: string,
  toUnit: string,
  quantity: number = 1,
): number => {
  // Convert cost per unit from one unit to another
  // If cost is per `fromUnit`, convert to cost per `toUnit`
  // Example: $5 per kg -> cost per g = $5 / 1000 = $0.005 per g

  // First, find how many `toUnit` are in 1 `fromUnit`
  const conversion = convertUnit(1, fromUnit, toUnit);

  // Cost per toUnit = cost per fromUnit / (how many toUnits in 1 fromUnit)
  // For example: $5/kg -> $5/1000 = $0.005/g (because 1kg = 1000g)
  return cost / conversion.value;
};

export const formatUnit = (value: number, unit: string): string => {
  return `${value.toFixed(2)} ${unit}`;
};

// Standard unit constants
export const STANDARD_UNITS = {
  WEIGHT: 'g',
  VOLUME: 'ml',
  PIECE: 'pc',
} as const;

// Unit category detection
export type UnitCategory = 'weight' | 'volume' | 'piece';

// Weight units
const WEIGHT_UNITS = [
  'kg',
  'g',
  'lb',
  'oz',
  'gram',
  'grams',
  'gm',
  'kilogram',
  'kilograms',
  'ounce',
  'ounces',
  'pound',
  'pounds',
];

// Volume units
const VOLUME_UNITS = [
  'l',
  'ml',
  'cup',
  'fl_oz',
  'tsp',
  'tbsp',
  'milliliter',
  'milliliters',
  'litre',
  'liter',
  'liters',
  'litres',
  'teaspoon',
  'teaspoons',
  'tablespoon',
  'tablespoons',
  'fluid ounce',
  'fluid ounces',
];

// Piece/count units
const PIECE_UNITS = ['pc', 'box', 'pack', 'bag', 'bottle', 'can', 'bunch', 'piece', 'pieces'];

export const getAllUnits = (): string[] => {
  return [...WEIGHT_UNITS, ...VOLUME_UNITS, ...PIECE_UNITS];
};

export const isVolumeUnit = (unit: string): boolean => {
  const normalized = normalizeUnit(unit);
  return VOLUME_UNITS.includes(normalized);
};

export const isWeightUnit = (unit: string): boolean => {
  const normalized = normalizeUnit(unit);
  return WEIGHT_UNITS.includes(normalized);
};

export const isPieceUnit = (unit: string): boolean => {
  const normalized = normalizeUnit(unit);
  return PIECE_UNITS.includes(normalized);
};

export const getUnitCategory = (unit: string): UnitCategory => {
  if (isWeightUnit(unit)) return 'weight';
  if (isVolumeUnit(unit)) return 'volume';
  if (isPieceUnit(unit)) return 'piece';
  // Default to piece for unknown units
  return 'piece';
};

// Convert any unit to its standard unit (g for weight, ml for volume, pc for pieces)
export const convertToStandardUnit = (value: number, fromUnit: string): ConversionResult => {
  const normalized = normalizeUnit(fromUnit);
  const category = getUnitCategory(normalized);

  let standardUnit: string;
  let convertedValue: number;

  switch (category) {
    case 'weight':
      standardUnit = STANDARD_UNITS.WEIGHT;
      if (normalized === 'g') {
        convertedValue = value;
      } else {
        const conversion = convertUnit(value, normalized, STANDARD_UNITS.WEIGHT);
        convertedValue = conversion.value;
      }
      break;
    case 'volume':
      standardUnit = STANDARD_UNITS.VOLUME;
      if (normalized === 'ml') {
        convertedValue = value;
      } else {
        const conversion = convertUnit(value, normalized, STANDARD_UNITS.VOLUME);
        convertedValue = conversion.value;
      }
      break;
    case 'piece':
      standardUnit = STANDARD_UNITS.PIECE;
      // For pieces, no conversion needed - 1 pc = 1 pc
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
};

// Convert from standard unit back to display unit
export const convertFromStandardUnit = (value: number, toUnit: string): ConversionResult => {
  const normalized = normalizeUnit(toUnit);
  const category = getUnitCategory(normalized);

  let standardUnit: string;
  let convertedValue: number;

  switch (category) {
    case 'weight':
      standardUnit = STANDARD_UNITS.WEIGHT;
      if (normalized === 'g') {
        convertedValue = value;
      } else {
        const conversion = convertUnit(value, STANDARD_UNITS.WEIGHT, normalized);
        convertedValue = conversion.value;
      }
      break;
    case 'volume':
      standardUnit = STANDARD_UNITS.VOLUME;
      if (normalized === 'ml') {
        convertedValue = value;
      } else {
        const conversion = convertUnit(value, STANDARD_UNITS.VOLUME, normalized);
        convertedValue = conversion.value;
      }
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
};

// Cup measurement converter utility (for future recipe features)
export const convertCupMeasurements = (
  value: number,
  fromUnit: string,
  toUnit: string,
): ConversionResult => {
  const normalizedFrom = normalizeUnit(fromUnit);
  const normalizedTo = normalizeUnit(toUnit);

  // Only handle cup-related conversions
  const cupUnits = ['cup', 'tsp', 'tbsp', 'ml'];
  if (!cupUnits.includes(normalizedFrom) || !cupUnits.includes(normalizedTo)) {
    // Fall back to standard conversion
    return convertUnit(value, normalizedFrom, normalizedTo);
  }

  return convertUnit(value, normalizedFrom, normalizedTo);
};

export const parseUnit = (unitString: string): { value: number; unit: string } => {
  const match = unitString.match(/^([\d.]+)\s*(.*)$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2].trim(),
    };
  }
  return { value: 0, unit: unitString };
};
