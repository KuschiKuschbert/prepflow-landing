import { normalizeUnit } from './unitMappings';

export type UnitCategory = 'weight' | 'volume' | 'piece';

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
const PIECE_UNITS = ['pc', 'box', 'pack', 'bag', 'bottle', 'can', 'bunch', 'piece', 'pieces'];

export function getAllUnits(): string[] {
  return [...WEIGHT_UNITS, ...VOLUME_UNITS, ...PIECE_UNITS];
}

export function isVolumeUnit(unit: string): boolean {
  const normalized = normalizeUnit(unit);
  return VOLUME_UNITS.includes(normalized);
}

export function isWeightUnit(unit: string): boolean {
  const normalized = normalizeUnit(unit);
  return WEIGHT_UNITS.includes(normalized);
}

export function isPieceUnit(unit: string): boolean {
  const normalized = normalizeUnit(unit);
  return PIECE_UNITS.includes(normalized);
}

export function getUnitCategory(unit: string): UnitCategory {
  if (isWeightUnit(unit)) return 'weight';
  if (isVolumeUnit(unit)) return 'volume';
  if (isPieceUnit(unit)) return 'piece';
  return 'piece';
}
