/**
 * Map par level to CSV row format.
 */
import type { ParLevel } from '../../../types';

export function mapParLevelToCSVRow(parLevel: ParLevel): Record<string, any> {
  return {
    Ingredient: parLevel.ingredients.ingredient_name || '',
    Category: parLevel.ingredients.category || '',
    'Par Level': parLevel.par_level || 0,
    'Reorder Point': parLevel.reorder_point || 0,
    Unit: parLevel.unit || '',
  };
}
