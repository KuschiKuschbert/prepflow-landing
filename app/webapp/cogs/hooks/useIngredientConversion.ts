// PrepFlow - Ingredient Conversion Utilities Hook
// Extracted from useIngredientAddition.ts to meet file size limits

'use client';

import { useMemo } from 'react';
import { convertUnit } from '@/lib/unit-conversion';

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
    const userUnitLower = userUnit.toLowerCase().trim();
    const ingredientUnitLower = ingredientUnit.toLowerCase().trim();

    const isUserVolume = volumeUnits.includes(userUnitLower);
    const isUserWeight = weightUnits.includes(userUnitLower);
    const isIngredientVolume = volumeUnits.includes(ingredientUnitLower);
    const isIngredientWeight = weightUnits.includes(ingredientUnitLower);

    if ((isUserVolume && isIngredientWeight) || (isUserWeight && isIngredientVolume)) {
      const conversionResult = convertUnit(quantity, userUnit, ingredientUnit);
      return {
        convertedQuantity: quantity * conversionResult.value,
        convertedUnit: ingredientUnit,
        conversionNote: ` (converted from ${quantity} ${userUnit})`,
      };
    }

    return {
      convertedQuantity: quantity,
      convertedUnit: userUnit,
      conversionNote: '',
    };
  };

  return {
    volumeUnits,
    weightUnits,
    convertIngredientQuantity,
  };
}
