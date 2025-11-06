// PrepFlow - Ingredient Data Normalization Utilities
// Extracted from useIngredientCRUD.ts to meet file size limits

import { convertUnit, isVolumeUnit, isWeightUnit } from '@/lib/unit-conversion';
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
  let unit = inputUnit.toUpperCase();
  let normalizedCostPerUnit = costPerUnit;
  let normalizedCostPerUnitAsPurchased = costPerUnitAsPurchased;
  let normalizedCostPerUnitInclTrim = costPerUnitInclTrim;

  if (isWeightUnit(inputUnit.toLowerCase()) && unit !== 'GM') {
    const conversion = convertUnit(1, inputUnit.toLowerCase(), 'g');
    unit = 'GM';
    const divisor = conversion.value;
    normalizedCostPerUnit = costPerUnit / divisor;
    normalizedCostPerUnitAsPurchased = costPerUnitAsPurchased / divisor;
    normalizedCostPerUnitInclTrim = costPerUnitInclTrim / divisor;
  } else if (isVolumeUnit(inputUnit.toLowerCase()) && unit !== 'ML') {
    const conversion = convertUnit(1, inputUnit.toLowerCase(), 'ml');
    unit = 'ML';
    const divisor = conversion.value;
    normalizedCostPerUnit = costPerUnit / divisor;
    normalizedCostPerUnitAsPurchased = costPerUnitAsPurchased / divisor;
    normalizedCostPerUnitInclTrim = costPerUnitInclTrim / divisor;
  }

  return {
    unit,
    costPerUnit: normalizedCostPerUnit,
    costPerUnitAsPurchased: normalizedCostPerUnitAsPurchased,
    costPerUnitInclTrim: normalizedCostPerUnitInclTrim,
  };
}
