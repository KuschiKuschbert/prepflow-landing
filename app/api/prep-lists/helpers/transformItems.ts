/**
 * Transform items from schema format to function format
 */
export function transformItems(
  items?: Array<{
    ingredient_id?: string;
    quantity?: number;
    unit?: string;
    notes?: string;
  }>,
):
  | Array<{
      ingredientId: string;
      quantity: string;
      unit: string;
      notes?: string;
    }>
  | undefined {
  return items?.map(item => ({
    ingredientId: item.ingredient_id || '',
    quantity: item.quantity?.toString() || '0',
    unit: item.unit || '',
    notes: item.notes,
  }));
}



