/**
 * Save dish ingredients.
 */
import type { COGSCalculation } from '../../../../../cogs/types';
import type { Dish } from '../../../../types';
import type { RecipeDishItem } from '../../useRecipeDishEditorData';

export async function saveDishIngredients(
  selectedItem: RecipeDishItem,
  calculations: COGSCalculation[],
  allDishes: Dish[],
): Promise<{ ingredients: Array<{ ingredient_id: string; quantity: number; unit: string }> }> {
  const dish = allDishes.find(d => d.id === selectedItem.id);
  if (!dish) throw new Error('Dish not found');
  const dishIngredients = calculations.map(calc => ({
    ingredient_id: calc.ingredientId,
    quantity: calc.quantity,
    unit: calc.unit,
  }));
  const response = await fetch(`/api/dishes/${selectedItem.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dish_name: dish.dish_name,
      description: dish.description,
      selling_price: dish.selling_price,
      recipes: [],
      ingredients: dishIngredients,
    }),
  });
  if (!response.ok) throw response;
  return { ingredients: dishIngredients };
}
