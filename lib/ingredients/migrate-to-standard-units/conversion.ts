import {
  convertToStandardUnit,
  getUnitCategory,
  normalizeUnit,
  STANDARD_UNITS,
} from '@/lib/unit-conversion';
import type { IngredientRow } from './types';

/**
 * Convert ingredient cost values to standard units.
 *
 * @param {IngredientRow} ingredient - Ingredient to convert
 * @param {string} normalizedUnit - Normalized unit string
 * @param {string} standardUnit - Standard unit string
 * @returns {Object} Converted cost values
 */
export function convertIngredientCosts(
  ingredient: IngredientRow,
  normalizedUnit: string,
  standardUnit: string,
) {
  let convertedPackSize: number | null = null;
  if (ingredient.pack_size && ingredient.pack_size_unit) {
    const packSizeNum =
      typeof ingredient.pack_size === 'string'
        ? parseFloat(ingredient.pack_size)
        : ingredient.pack_size;
    if (!isNaN(packSizeNum) && packSizeNum > 0) {
      convertedPackSize = convertToStandardUnit(packSizeNum, normalizedUnit).value;
    }
  }

  let convertedCostPerUnit = ingredient.cost_per_unit;
  if (ingredient.pack_price && ingredient.pack_size) {
    const packSizeNum =
      typeof ingredient.pack_size === 'string'
        ? parseFloat(ingredient.pack_size)
        : ingredient.pack_size;
    if (!isNaN(packSizeNum) && packSizeNum > 0 && ingredient.pack_price > 0) {
      const conversion = convertToStandardUnit(1, normalizedUnit);
      convertedCostPerUnit = ingredient.pack_price / packSizeNum / conversion.value;
    }
  } else if (normalizedUnit !== standardUnit) {
    convertedCostPerUnit = ingredient.cost_per_unit / convertToStandardUnit(1, normalizedUnit).value;
  }

  let convertedCostPerUnitAsPurchased = ingredient.cost_per_unit_as_purchased;
  if (convertedCostPerUnitAsPurchased && normalizedUnit !== standardUnit) {
    convertedCostPerUnitAsPurchased =
      convertedCostPerUnitAsPurchased / convertToStandardUnit(1, normalizedUnit).value;
  }

  let convertedCostPerUnitInclTrim = ingredient.cost_per_unit_incl_trim;
  if (convertedCostPerUnitInclTrim && normalizedUnit !== standardUnit) {
    convertedCostPerUnitInclTrim =
      convertedCostPerUnitInclTrim / convertToStandardUnit(1, normalizedUnit).value;
  }

  return {
    convertedPackSize,
    convertedCostPerUnit,
    convertedCostPerUnitAsPurchased,
    convertedCostPerUnitInclTrim,
  };
}

/**
 * Determine standard unit for an ingredient based on its current unit.
 *
 * @param {string} unitToMigrate - Unit to migrate from
 * @returns {string} Standard unit string
 */
export function determineStandardUnit(unitToMigrate: string): string {
  const normalizedUnit = normalizeUnit(unitToMigrate);
  const category = getUnitCategory(normalizedUnit);
  return category === 'weight'
    ? STANDARD_UNITS.WEIGHT
    : category === 'volume'
      ? STANDARD_UNITS.VOLUME
      : STANDARD_UNITS.PIECE;
}
