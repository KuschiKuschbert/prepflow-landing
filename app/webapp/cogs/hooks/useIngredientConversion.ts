// PrepFlow - Ingredient Conversion Utilities Hook
// Extracted from useIngredientAddition.ts to meet file size limits

'use client';

import { useMemo } from 'react';
import {
  convertUnit,
  convertToStandardUnit,
  normalizeUnit,
  getUnitCategory,
} from '@/lib/unit-conversion';

export function useIngredientConversion() {
  const volumeUnits = useMemo(
    () => [
      'tsp',
      'teaspoon',
      'tbsp',
      'tablespoon',
      'cup',
      'cups',
      'ml',
      'milliliter',
      'l',
      'liter',
      'litre',
      'fl oz',
      'fluid ounce',
    ],
    [],
  );

  const weightUnits = useMemo(
    () => [
      'g',
      'gm',
      'gram',
      'grams',
      'kg',
      'kilogram',
      'oz',
      'ounce',
      'lb',
      'pound',
      'mg',
      'milligram',
    ],
    [],
  );

  const convertIngredientQuantity = (
    quantity: number,
    userUnit: string,
    ingredientUnit: string,
  ): { convertedQuantity: number; convertedUnit: string; conversionNote: string } => {
    const normalizedUserUnit = normalizeUnit(userUnit);
    const normalizedIngredientUnit = normalizeUnit(ingredientUnit);
    const userCategory = getUnitCategory(normalizedUserUnit);
    const ingredientCategory = getUnitCategory(normalizedIngredientUnit);

    if (userCategory !== ingredientCategory) {
      const conversionResult = convertUnit(quantity, normalizedUserUnit, normalizedIngredientUnit);
      if (
        conversionResult.value !== quantity ||
        conversionResult.unit !== normalizedIngredientUnit
      ) {
        return {
          convertedQuantity: conversionResult.value,
          convertedUnit: ingredientUnit,
          conversionNote: ` (converted from ${quantity} ${userUnit})`,
        };
      }
      return {
        convertedQuantity: quantity,
        convertedUnit: userUnit,
        conversionNote: ` (cannot convert ${userCategory} to ${ingredientCategory})`,
      };
    }

    const userStandard = convertToStandardUnit(quantity, normalizedUserUnit);
    const conversionResult = convertUnit(
      userStandard.value,
      userStandard.unit,
      normalizedIngredientUnit,
    );

    if (conversionResult.value === quantity && conversionResult.unit === normalizedIngredientUnit) {
      return { convertedQuantity: quantity, convertedUnit: userUnit, conversionNote: '' };
    }

    return {
      convertedQuantity: conversionResult.value,
      convertedUnit: ingredientUnit,
      conversionNote: ` (converted from ${quantity} ${userUnit})`,
    };
  };

  return {
    volumeUnits,
    weightUnits,
    convertIngredientQuantity,
  };
}
