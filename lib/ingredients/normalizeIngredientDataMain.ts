// PrepFlow - Ingredient Data Normalization Main Function
// Orchestrates normalization using extracted utilities

import { formatIngredientName } from '@/lib/text-utils';
import {
  parseNumeric,
  parseInteger,
  calculateCostPerUnit,
  normalizeUnitAndCosts,
  type IngredientData,
  type NormalizedIngredientData,
} from './normalizeIngredientData';
import { buildInsertData } from './buildInsertData';

export function normalizeIngredientData(ingredientData: Partial<IngredientData>): {
  normalized: NormalizedIngredientData;
  error?: string;
} {
  if (!ingredientData.ingredient_name?.trim()) {
    return { normalized: {} as NormalizedIngredientData, error: 'Ingredient name is required' };
  }
  if (!ingredientData.unit) {
    return { normalized: {} as NormalizedIngredientData, error: 'Unit is required' };
  }

  const packSize =
    typeof ingredientData.pack_size === 'string'
      ? parseNumeric(ingredientData.pack_size, 0) || null
      : ingredientData.pack_size || null;

  const costPerUnit = calculateCostPerUnit(
    ingredientData.cost_per_unit || 0,
    ingredientData.pack_price,
    packSize,
  );

  if (costPerUnit <= 0) {
    return {
      normalized: {} as NormalizedIngredientData,
      error: 'Cost per unit must be greater than 0',
    };
  }

  const packPrice = parseNumeric(ingredientData.pack_price, 0);
  const costPerUnitAsPurchased = parseNumeric(
    ingredientData.cost_per_unit_as_purchased,
    costPerUnit,
  );
  const costPerUnitInclTrim = parseNumeric(ingredientData.cost_per_unit_incl_trim, costPerUnit);
  const trimPeelWastePercentage = parseNumeric(ingredientData.trim_peel_waste_percentage, 0);
  const yieldPercentage = parseNumeric(ingredientData.yield_percentage, 100);
  const minStockLevel = parseInteger(ingredientData.min_stock_level, 0);
  const currentStock = parseInteger(ingredientData.current_stock, 0);

  const {
    unit,
    costPerUnit: normalizedCostPerUnit,
    costPerUnitAsPurchased: normalizedCostPerUnitAsPurchased,
    costPerUnitInclTrim: normalizedCostPerUnitInclTrim,
  } = normalizeUnitAndCosts(
    ingredientData.unit || 'g',
    costPerUnit,
    costPerUnitAsPurchased,
    costPerUnitInclTrim,
  );

  const normalized = buildInsertData(
    {
      ...ingredientData,
      ingredient_name: formatIngredientName(ingredientData.ingredient_name.trim()),
    },
    unit,
    normalizedCostPerUnit,
    normalizedCostPerUnitAsPurchased,
    normalizedCostPerUnitInclTrim,
    packSize,
    packPrice,
    trimPeelWastePercentage,
    yieldPercentage,
    minStockLevel,
    currentStock,
  );

  return { normalized };
}
