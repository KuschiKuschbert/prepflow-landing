/**
 * Chicken pattern ingredient matching.
 */

import type { IngredientMatch } from '../types';

/**
 * Match chicken pattern ingredients.
 */
export function matchChickenPattern(
  findIngredient: (name: string) => string | null,
): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  const chickenId = findIngredient('chicken') || findIngredient('chicken breast');
  const oilId = findIngredient('olive oil') || findIngredient('olive oil extra virgin');
  const garlicId = findIngredient('garlic');
  const onionId = findIngredient('onion') || findIngredient('onions brown');

  if (chickenId)
    matches.push({
      ingredient_id: chickenId,
      ingredient_name: 'Chicken',
      quantity: 150,
      unit: 'GM',
    });
  if (oilId)
    matches.push({ ingredient_id: oilId, ingredient_name: 'Oil', quantity: 10, unit: 'ML' });
  if (garlicId)
    matches.push({ ingredient_id: garlicId, ingredient_name: 'Garlic', quantity: 5, unit: 'GM' });
  if (onionId)
    matches.push({ ingredient_id: onionId, ingredient_name: 'Onion', quantity: 30, unit: 'GM' });

  return matches;
}
