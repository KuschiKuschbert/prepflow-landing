/**
 * Recipe Card Scaling Utilities
 * Helper functions for scaling ingredient quantities based on prep quantity
 */

import { logger } from '@/lib/logger';
import { formatScaledQuantity, formatYield } from './recipeCardScaling/formatting';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface ScaledIngredient extends Ingredient {
  scaledQuantity: number;
}

/**
 * Scale ingredients based on prep quantity
 *
 * @param {Ingredient[]} ingredients - Base ingredients (already normalized to 1 serving)
 * @param {number} prepQuantity - Number of servings to prep
 * @param {number} baseYield - Base yield per serving (for reference only, not used in calculation)
 * @returns {ScaledIngredient[]} Scaled ingredients with original and scaled quantities
 */
export function scaleIngredients(
  ingredients: Ingredient[],
  prepQuantity: number,
  baseYield: number = 1,
): ScaledIngredient[] {
  // Ingredients are already normalized to 1 serving, so we simply multiply by prepQuantity
  // baseYield is kept for reference but not used in calculation since ingredients are per-serving
  // IMPORTANT: Do NOT divide by baseYield - ingredients are already per-serving!
  const scaleFactor = prepQuantity;

  return ingredients.map(ingredient => {
    // Ensure we're working with numbers, not strings
    const quantity =
      typeof ingredient.quantity === 'number'
        ? ingredient.quantity
        : parseFloat(String(ingredient.quantity));
    const prepQty =
      typeof prepQuantity === 'number' ? prepQuantity : parseFloat(String(prepQuantity));

    const scaledQuantity = quantity * prepQty;

    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      logger.dev(
        `[scaleIngredients] ${ingredient.name}: ${quantity} ${ingredient.unit} × ${prepQty} = ${scaledQuantity} ${ingredient.unit}`,
        {
          quantity,
          prepQty,
          scaledQuantity,
          quantityType: typeof quantity,
          prepQtyType: typeof prepQty,
        },
      );
    }

    return {
      ...ingredient,
      scaledQuantity: Number(scaledQuantity), // Ensure it's a number
    };
  });
}

/**
 * Calculate total yield based on base yield and prep quantity
 *
 * @param {number} baseYield - Base yield per serving (typically 1)
 * @param {number} prepQuantity - Number of servings to prep
 * @returns {number} Total yield
 */
export function calculateTotalYield(baseYield: number, prepQuantity: number): number {
  return baseYield * prepQuantity;
}

// Re-export formatting functions
export { formatScaledQuantity, formatYield };
