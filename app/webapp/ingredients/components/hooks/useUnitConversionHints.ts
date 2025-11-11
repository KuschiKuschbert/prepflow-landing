// PrepFlow - Unit Conversion Hints Hook
// Extracted from IngredientFormFields to meet file size limits

import { useMemo } from 'react';
import {
  convertToStandardUnit,
  getUnitCategory,
  STANDARD_UNITS,
  normalizeUnit,
} from '@/lib/unit-conversion';

export function useUnitConversionHints(packSizeUnit?: string, unit?: string) {
  const packSizeUnitHint = useMemo(() => {
    if (!packSizeUnit) return null;
    const normalized = normalizeUnit(packSizeUnit);
    const category = getUnitCategory(normalized);
    let standardUnit: string;
    switch (category) {
      case 'weight':
        standardUnit = STANDARD_UNITS.WEIGHT;
        break;
      case 'volume':
        standardUnit = STANDARD_UNITS.VOLUME;
        break;
      case 'piece':
        standardUnit = STANDARD_UNITS.PIECE;
        break;
      default:
        return null;
    }

    if (normalized === standardUnit) return null;

    const conversion = convertToStandardUnit(1, normalized);
    if (conversion.value === 1) return null;

    return `1 ${packSizeUnit} = ${conversion.value.toFixed(2)} ${standardUnit}`;
  }, [packSizeUnit]);

  const unitHint = useMemo(() => {
    if (!unit) return null;
    const normalized = normalizeUnit(unit);
    const category = getUnitCategory(normalized);
    let standardUnit: string;
    switch (category) {
      case 'weight':
        standardUnit = STANDARD_UNITS.WEIGHT;
        break;
      case 'volume':
        standardUnit = STANDARD_UNITS.VOLUME;
        break;
      case 'piece':
        standardUnit = STANDARD_UNITS.PIECE;
        break;
      default:
        return null;
    }

    if (normalized === standardUnit) return null;

    const conversion = convertToStandardUnit(1, normalized);
    if (conversion.value === 1) return null;

    return `1 ${unit} = ${conversion.value.toFixed(2)} ${standardUnit}`;
  }, [unit]);

  return { packSizeUnitHint, unitHint };
}
