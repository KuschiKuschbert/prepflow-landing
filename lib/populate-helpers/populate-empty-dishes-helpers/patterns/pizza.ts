/**
 * Pizza pattern ingredient matching.
 */

import type { IngredientMatch } from '../types';

/**
 * Match pizza pattern ingredients.
 */
export function matchPizzaPattern(
  findIngredient: (name: string) => string | null,
): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  const doughId =
    findIngredient('dough') || findIngredient('flour') || findIngredient('flour plain');
  const cheeseId =
    findIngredient('cheese') || findIngredient('mozzarella') || findIngredient('cheddar');
  const tomatoId = findIngredient('tomato') || findIngredient('tomato sauce');
  const oilId = findIngredient('olive oil') || findIngredient('olive oil extra virgin');

  if (doughId)
    matches.push({ ingredient_id: doughId, ingredient_name: 'Dough', quantity: 200, unit: 'GM' });
  if (cheeseId)
    matches.push({
      ingredient_id: cheeseId,
      ingredient_name: 'Cheese',
      quantity: 100,
      unit: 'GM',
    });
  if (tomatoId)
    matches.push({
      ingredient_id: tomatoId,
      ingredient_name: 'Tomato',
      quantity: 80,
      unit: 'GM',
    });
  if (oilId)
    matches.push({ ingredient_id: oilId, ingredient_name: 'Oil', quantity: 10, unit: 'ML' });

  return matches;
}
