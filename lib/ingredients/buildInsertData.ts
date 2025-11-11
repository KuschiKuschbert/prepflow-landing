// PrepFlow - Ingredient Data Builder Utilities
// Extracted from normalizeIngredientData.ts to meet file size limits

import {
  formatBrandName,
  formatSupplierName,
  formatStorageLocation,
  formatTextInput,
} from '@/lib/text-utils';
import { getUnitCategory, normalizeUnit, STANDARD_UNITS } from '@/lib/unit-conversion';
import type { IngredientData, NormalizedIngredientData } from './normalizeIngredientData';

export function buildInsertData(
  ingredientData: Partial<IngredientData>,
  normalizedUnit: string,
  normalizedCostPerUnit: number,
  normalizedCostPerUnitAsPurchased: number,
  normalizedCostPerUnitInclTrim: number,
  packSize: number | null,
  packPrice: number,
  trimPeelWastePercentage: number,
  yieldPercentage: number,
  minStockLevel: number,
  currentStock: number,
): NormalizedIngredientData {
  // Determine standard unit and preserve original unit
  const originalUnit = ingredientData.unit || ingredientData.pack_size_unit || 'pc';
  const normalizedOriginal = normalizeUnit(originalUnit);
  const category = getUnitCategory(normalizedOriginal);

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

  const insertData: NormalizedIngredientData = {
    ingredient_name: ingredientData.ingredient_name!,
    unit: normalizedUnit,
    cost_per_unit: normalizedCostPerUnit,
    standard_unit: standardUnit,
    original_unit: originalUnit,
  } as NormalizedIngredientData;

  if (normalizedCostPerUnitAsPurchased !== normalizedCostPerUnit) {
    insertData.cost_per_unit_as_purchased = normalizedCostPerUnitAsPurchased;
  }
  if (normalizedCostPerUnitInclTrim !== normalizedCostPerUnit) {
    insertData.cost_per_unit_incl_trim = normalizedCostPerUnitInclTrim;
  }
  if (trimPeelWastePercentage > 0) {
    insertData.trim_peel_waste_percentage = trimPeelWastePercentage;
  }
  if (yieldPercentage !== 100) {
    insertData.yield_percentage = yieldPercentage;
  }
  if (packSize !== null && packSize > 0) {
    insertData.pack_size = packSize;
  }
  if (ingredientData.pack_size_unit) {
    insertData.pack_size_unit = ingredientData.pack_size_unit;
  }
  if (packPrice > 0) {
    insertData.pack_price = packPrice;
  }
  if (ingredientData.brand) {
    insertData.brand = formatBrandName(ingredientData.brand);
  }
  if (ingredientData.supplier) {
    insertData.supplier = formatSupplierName(ingredientData.supplier);
  }
  if (ingredientData.storage_location) {
    insertData.storage_location = formatStorageLocation(ingredientData.storage_location);
  }
  if (ingredientData.product_code) {
    insertData.product_code = formatTextInput(ingredientData.product_code);
  }
  if (minStockLevel > 0) {
    insertData.min_stock_level = minStockLevel;
  }
  if (currentStock > 0) {
    insertData.current_stock = currentStock;
  }

  return insertData;
}
