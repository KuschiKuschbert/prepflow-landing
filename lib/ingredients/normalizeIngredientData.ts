// PrepFlow - Ingredient Data Normalization Utilities
// Extracted from useIngredientCRUD.ts to meet file size limits

import {
  convertUnit,
  convertToStandardUnit,
  isVolumeUnit,
  isWeightUnit,
  isPieceUnit,
  getUnitCategory,
  STANDARD_UNITS,
  normalizeUnit,
} from '@/lib/unit-conversion';
import {
  formatIngredientName,
  formatBrandName,
  formatSupplierName,
  formatStorageLocation,
  formatTextInput,
} from '@/lib/text-utils';

export interface IngredientData {
  ingredient_name?: string;
  unit?: string;
  cost_per_unit?: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  pack_size?: string | number | null;
  pack_price?: string | number;
  brand?: string;
  supplier?: string;
  storage_location?: string;
  product_code?: string;
  trim_peel_waste_percentage?: string | number;
  yield_percentage?: string | number;
  min_stock_level?: string | number;
  current_stock?: string | number;
  pack_size_unit?: string;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
    ai_detected_at?: string;
  };
}

export interface NormalizedIngredientData {
  ingredient_name: string;
  unit: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  pack_size?: number;
  pack_size_unit?: string;
  pack_price?: number;
  brand?: string;
  supplier?: string;
  storage_location?: string;
  product_code?: string;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  min_stock_level?: number;
  current_stock?: number;
  standard_unit?: string;
  original_unit?: string;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
    ai_detected_at?: string;
  };
}

export function parseNumeric(value: string | number | undefined, defaultValue: number): number {
  if (typeof value === 'string') return parseFloat(value) || defaultValue;
  return value ?? defaultValue;
}

export function parseInteger(value: string | number | undefined, defaultValue: number): number {
  if (typeof value === 'string') return parseInt(value, 10) || defaultValue;
  return value ?? defaultValue;
}

export function calculateCostPerUnit(
  costPerUnit: number,
  packPrice: string | number | undefined,
  packSize: string | number | null | undefined,
): number {
  if (costPerUnit > 0) return costPerUnit;
  if (!packPrice || !packSize) return 0;
  const packSizeFloat = parseNumeric(packSize, 0);
  const packPriceFloat = parseNumeric(packPrice, 0);
  return packSizeFloat > 0 && packPriceFloat > 0 ? packPriceFloat / packSizeFloat : 0;
}

export function normalizeUnitAndCosts(
  inputUnit: string,
  costPerUnit: number,
  costPerUnitAsPurchased: number,
  costPerUnitInclTrim: number,
): {
  unit: string;
  costPerUnit: number;
  costPerUnitAsPurchased: number;
  costPerUnitInclTrim: number;
} {
  const normalizedInput = normalizeUnit(inputUnit);
  const category = getUnitCategory(normalizedInput);

  // Determine standard unit based on category
  let standardUnit: string;
  switch (category) {
    case 'weight':
      standardUnit = STANDARD_UNITS.WEIGHT.toUpperCase();
      break;
    case 'volume':
      standardUnit = STANDARD_UNITS.VOLUME.toUpperCase();
      break;
    case 'piece':
      standardUnit = STANDARD_UNITS.PIECE.toUpperCase();
      break;
    default:
      standardUnit = STANDARD_UNITS.PIECE.toUpperCase();
  }

  // If already in standard unit, no conversion needed
  if (
    (category === 'weight' && normalizedInput === 'g') ||
    (category === 'volume' && normalizedInput === 'ml') ||
    (category === 'piece' && normalizedInput === 'pc')
  ) {
    return {
      unit: standardUnit,
      costPerUnit,
      costPerUnitAsPurchased,
      costPerUnitInclTrim,
    };
  }

  // Convert to standard unit
  const conversion = convertToStandardUnit(1, normalizedInput);
  const divisor = conversion.value;

  return {
    unit: standardUnit,
    costPerUnit: costPerUnit / divisor,
    costPerUnitAsPurchased: costPerUnitAsPurchased / divisor,
    costPerUnitInclTrim: costPerUnitInclTrim / divisor,
  };
}
