// PrepFlow - Recipe Validation Hook
// Extracted from useRecipeSaving.ts to meet file size limits

'use client';

import { COGSCalculation } from '@/lib/types/cogs';

import { logger } from '@/lib/logger';
export function useRecipeValidation() {
  const validateCalculations = (calculations: COGSCalculation[]): COGSCalculation[] => {
    return calculations.filter(calc => {
      if (!calc.ingredientId) {
        logger.warn('Calculation missing ingredientId:', { calculation: JSON.stringify(calc) });
        return false;
      }
      if (!calc.quantity || calc.quantity <= 0) {
        logger.warn('Calculation has invalid quantity:', { calculation: JSON.stringify(calc) });
        return false;
      }
      if (!calc.unit) {
        logger.warn('Calculation missing unit:', { calculation: JSON.stringify(calc) });
        return false;
      }
      return true;
    });
  };

  return {
    validateCalculations,
  };
}
