import { DishBuilderState } from '../../types';
import { COGSCalculation } from '@/lib/types/cogs';

/**
 * Validate dish state before saving.
 *
 * @param {DishBuilderState} dishState - Dish state to validate
 * @param {COGSCalculation[]} calculations - Calculations array
 * @returns {string | null} Error message if invalid, null if valid
 */
export function validateDishState(
  dishState: DishBuilderState,
  calculations: COGSCalculation[],
): string | null {
  if (!dishState.dishName.trim()) {
    return 'Dish name is required';
  }
  if (calculations.length === 0) {
    return 'At least one ingredient is required';
  }
  if (dishState.itemType === 'dish' && dishState.sellingPrice <= 0) {
    return 'Selling price must be greater than 0';
  }
  if (dishState.itemType === 'recipe' && (!dishState.yield || dishState.yield <= 0)) {
    return 'Yield must be greater than 0';
  }
  return null;
}
