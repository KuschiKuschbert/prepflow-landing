/**
 * Recipe Card Scaling Utilities
 * Helper functions for scaling ingredient quantities based on prep quantity
 */

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
 * @param ingredients - Base ingredients (already normalized to 1 serving)
 * @param prepQuantity - Number of servings to prep
 * @param baseYield - Base yield per serving (for reference only, not used in calculation)
 * @returns Scaled ingredients with original and scaled quantities
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
      console.log(
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
 * Convert quantity to larger unit if appropriate (e.g., 1000 GM → 1 KG)
 * @param quantity - Quantity to convert
 * @param unit - Current unit
 * @returns Object with converted quantity and unit, or original if no conversion needed
 */
function convertToLargerUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  const normalizedUnit = unit.toLowerCase().trim();

  // Weight conversions: GM/G → KG
  if (
    normalizedUnit === 'gm' ||
    normalizedUnit === 'g' ||
    normalizedUnit === 'gram' ||
    normalizedUnit === 'grams'
  ) {
    if (quantity >= 1000) {
      return {
        quantity: quantity / 1000,
        unit: 'KG',
      };
    }
  }

  // Volume conversions: ML → L
  if (
    normalizedUnit === 'ml' ||
    normalizedUnit === 'milliliter' ||
    normalizedUnit === 'milliliters'
  ) {
    if (quantity >= 1000) {
      return {
        quantity: quantity / 1000,
        unit: 'L',
      };
    }
  }

  // Return original if no conversion needed
  return { quantity, unit };
}

/**
 * Format scaled quantity for display
 * @param quantity - Scaled quantity
 * @param unit - Unit of measurement
 * @returns Formatted string
 */
export function formatScaledQuantity(quantity: number, unit: string): string {
  // Ensure we're working with a number
  const num = typeof quantity === 'number' ? quantity : parseFloat(String(quantity));

  // Convert to larger unit if appropriate (e.g., 1000 GM → 1 KG)
  const converted = convertToLargerUnit(num, unit);
  const displayQuantity = converted.quantity;
  const displayUnit = converted.unit;

  // Check if it's effectively a whole number (within floating point precision)
  const isWholeNumber = Math.abs(displayQuantity - Math.round(displayQuantity)) < 0.0001;

  if (isWholeNumber) {
    // For whole numbers, display directly without any decimal formatting
    const wholeNum = Math.round(displayQuantity);
    return `${wholeNum} ${displayUnit}`;
  }

  // For decimal numbers, round to reasonable precision based on quantity
  let rounded: number;
  if (displayQuantity < 1) {
    rounded = Math.round(displayQuantity * 1000) / 1000; // 3 decimal places for small quantities
  } else if (displayQuantity < 10) {
    rounded = Math.round(displayQuantity * 100) / 100; // 2 decimal places
  } else {
    rounded = Math.round(displayQuantity * 10) / 10; // 1 decimal place for larger quantities
  }

  // Remove trailing zeros from decimal portion only
  const formatted = rounded.toString().replace(/\.?0+$/, '');

  return `${formatted} ${displayUnit}`;
}

/**
 * Calculate total yield based on base yield and prep quantity
 * @param baseYield - Base yield per serving (typically 1)
 * @param prepQuantity - Number of servings to prep
 * @returns Total yield
 */
export function calculateTotalYield(baseYield: number, prepQuantity: number): number {
  return baseYield * prepQuantity;
}

/**
 * Format yield for display
 * @param yield - Yield number
 * @param unit - Yield unit (e.g., 'servings', 'portions')
 * @returns Formatted string
 */
export function formatYield(yieldNum: number, unit: string = 'servings'): string {
  if (yieldNum === 1) {
    return `1 ${unit.slice(0, -1)}`; // Remove 's' for singular
  }
  return `${yieldNum} ${unit}`;
}
