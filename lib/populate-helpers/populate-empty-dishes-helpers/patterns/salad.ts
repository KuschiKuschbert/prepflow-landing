/**
 * Salad pattern ingredient matching.
 */

import type { IngredientMatch } from '../types';

/**
 * Match salad pattern ingredients.
 */
export function matchSaladPattern(
  findIngredient: (name: string) => string | null,
): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  const lettuceId = findIngredient('lettuce');
  const tomatoId = findIngredient('tomato') || findIngredient('fresh tomatoes');
  const onionId = findIngredient('onion') || findIngredient('onions brown');
  const dressingId =
    findIngredient('dressing') ||
    findIngredient('caesar dressing') ||
    findIngredient('olive oil') ||
    findIngredient('olive oil extra virgin');

  if (lettuceId)
    matches.push({
      ingredient_id: lettuceId,
      ingredient_name: 'Lettuce',
      quantity: 100,
      unit: 'GM',
    });
  if (tomatoId)
    matches.push({
      ingredient_id: tomatoId,
      ingredient_name: 'Tomato',
      quantity: 50,
      unit: 'GM',
    });
  if (onionId)
    matches.push({ ingredient_id: onionId, ingredient_name: 'Onion', quantity: 20, unit: 'GM' });
  if (dressingId)
    matches.push({
      ingredient_id: dressingId,
      ingredient_name: 'Dressing',
      quantity: 15,
      unit: 'ML',
    });

  return matches;
}
