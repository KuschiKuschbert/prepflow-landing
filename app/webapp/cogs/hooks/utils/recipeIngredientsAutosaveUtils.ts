'use client';

import { COGSCalculation } from '../../types';
import { logger } from '@/lib/logger';

export function serializeCalculations(calculations: COGSCalculation[]): string {
  return JSON.stringify(
    calculations.map(calc => ({
      ingredientId: calc.ingredientId,
      quantity: calc.quantity,
      unit: calc.unit,
    })),
  );
}

export async function saveRecipeIngredients(
  recipeId: string,
  calculations: COGSCalculation[],
): Promise<{ success: boolean; error?: string }> {
  try {
    const recipeIngredientInserts = calculations.map(calc => ({
      ingredient_id: calc.ingredientId,
      quantity: calc.quantity,
      unit: calc.unit,
    }));

    const response = await fetch(`/api/recipes/${recipeId}/ingredients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredients: recipeIngredientInserts,
        isUpdate: true,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Failed to save recipe ingredients',
      };
    }

    return { success: true };
  } catch (err) {
    logger.error('[recipeIngredientsAutosaveUtils.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save recipe ingredients',
    };
  }
}
