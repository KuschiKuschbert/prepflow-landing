// PrepFlow - Recipe Validation Hook
// Extracted from useRecipeSaving.ts to meet file size limits

'use client';

import { COGSCalculation } from '../types';

export function useRecipeValidation() {
  const validateCalculations = (calculations: COGSCalculation[]): COGSCalculation[] => {
    return calculations.filter(calc => {
      if (!calc.ingredientId) {
        console.warn('Calculation missing ingredientId:', calc);
        return false;
      }
      if (!calc.quantity || calc.quantity <= 0) {
        console.warn('Calculation has invalid quantity:', calc);
        return false;
      }
      if (!calc.unit) {
        console.warn('Calculation missing unit:', calc);
        return false;
      }
      return true;
    });
  };

  return {
    validateCalculations,
  };
}
