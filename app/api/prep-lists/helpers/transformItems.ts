import { CreatePrepListItemParams } from '../types';

/**
 * Transform items from schema format to function format
 */
export function transformItems(
  items?: Array<{
    ingredient_id?: string;
    quantity?: number | string;
    unit?: string;
    notes?: string;
  }>,
): CreatePrepListItemParams[] | undefined {
  return items?.map(item => ({
    ingredient_id: item.ingredient_id || '',
    quantity: item.quantity,
    unit: item.unit,
    notes: item.notes,
  }));
}
