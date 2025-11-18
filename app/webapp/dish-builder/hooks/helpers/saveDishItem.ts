import { DishBuilderState } from '../../types';
import { COGSCalculation } from '../../../cogs/types';

interface SaveDishItemProps {
  dishState: DishBuilderState;
  itemIngredients: Array<{ ingredient_id: string; quantity: number; unit: string }>;
}

/**
 * Save dish via API.
 *
 * @param {SaveDishItemProps} props - Dish save props
 * @returns {Promise<{success: boolean, dish?: any}>} Save result
 */
export async function saveDishItem({ dishState, itemIngredients }: SaveDishItemProps) {
  const response = await fetch('/api/dishes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dish_name: dishState.dishName.trim(),
      description: dishState.description.trim() || null,
      selling_price: dishState.sellingPrice,
      ingredients: itemIngredients,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    return { success: false, error: result.error || result.message || 'Failed to save dish' };
  }

  return { success: true, dish: result.dish };
}
