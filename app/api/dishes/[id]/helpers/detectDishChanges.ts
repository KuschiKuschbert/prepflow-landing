/**
 * Helper for detecting changes in dish updates
 */

import { Dish, UpdateDishInput } from '@/types/dish';

export interface DishChange {
  type: string;
  details: unknown;
}

export interface ChangeDetectionResult {
  changes: string[];
  changeDetails: Record<string, unknown>;
}

/**
 * Detects changes between current dish and update data
 *
 * @param {Dish | null} currentDish - Current dish data
 * @param {Partial<Dish>} updateData - Update data
 * @returns {ChangeDetectionResult} Detected changes
 */
export function detectDishChanges(
  currentDish: Dish | null,
  updateData: Partial<Dish>,
): ChangeDetectionResult {
  const changes: string[] = [];
  const changeDetails: Record<string, unknown> = {};

  if (!currentDish) {
    return { changes, changeDetails };
  }

  // Check price change
  if (
    updateData.selling_price !== undefined &&
    updateData.selling_price !== currentDish.selling_price
  ) {
    changes.push('price_changed');
    changeDetails.price = {
      field: 'selling_price',
      before: currentDish.selling_price,
      after: updateData.selling_price,
      change: updateData.selling_price > currentDish.selling_price ? 'increased' : 'decreased',
    };
  }

  // Check description change
  if (updateData.description !== undefined && updateData.description !== currentDish.description) {
    changes.push('updated');
    changeDetails.description = {
      field: 'description',
      before: currentDish.description,
      after: updateData.description,
    };
  }

  return { changes, changeDetails };
}
