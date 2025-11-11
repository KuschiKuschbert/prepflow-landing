// PrepFlow - Get Standard Unit Utility
// Extracted from IngredientTable to meet file size limits

import { STANDARD_UNITS, normalizeUnit, getUnitCategory } from '@/lib/unit-conversion';

export function getStandardUnit(unit?: string, standardUnit?: string): string {
  if (standardUnit) return standardUnit;

  if (!unit) return STANDARD_UNITS.PIECE.toUpperCase();

  const normalized = normalizeUnit(unit);
  const category = getUnitCategory(normalized);

  switch (category) {
    case 'weight':
      return STANDARD_UNITS.WEIGHT.toUpperCase();
    case 'volume':
      return STANDARD_UNITS.VOLUME.toUpperCase();
    case 'piece':
      return STANDARD_UNITS.PIECE.toUpperCase();
    default:
      return STANDARD_UNITS.PIECE.toUpperCase();
  }
}
