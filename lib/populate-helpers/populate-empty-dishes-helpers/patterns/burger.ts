/**
 * Burger pattern ingredient matching.
 */

import type { IngredientMatch } from '../types';

/**
 * Match burger pattern ingredients.
 */
export function matchBurgerPattern(
  findIngredient: (name: string) => string | null,
): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  const bunId = findIngredient('bun') || findIngredient('bread') || findIngredient('brioche bun');
  const pattyId =
    findIngredient('beef mince') ||
    findIngredient('beef mince premium') ||
    findIngredient('burger patties');
  const lettuceId = findIngredient('lettuce');
  const tomatoId = findIngredient('tomato') || findIngredient('fresh tomatoes');
  const onionId = findIngredient('onion') || findIngredient('onions brown');
  const cheeseId =
    findIngredient('cheese') || findIngredient('cheddar') || findIngredient('cheese cheddar');

  if (bunId)
    matches.push({ ingredient_id: bunId, ingredient_name: 'Bun', quantity: 1, unit: 'PC' });
  if (pattyId)
    matches.push({
      ingredient_id: pattyId,
      ingredient_name: 'Beef Patty',
      quantity: 150,
      unit: 'GM',
    });
  if (lettuceId)
    matches.push({
      ingredient_id: lettuceId,
      ingredient_name: 'Lettuce',
      quantity: 20,
      unit: 'GM',
    });
  if (tomatoId)
    matches.push({
      ingredient_id: tomatoId,
      ingredient_name: 'Tomato',
      quantity: 30,
      unit: 'GM',
    });
  if (onionId)
    matches.push({ ingredient_id: onionId, ingredient_name: 'Onion', quantity: 15, unit: 'GM' });
  if (cheeseId)
    matches.push({
      ingredient_id: cheeseId,
      ingredient_name: 'Cheese',
      quantity: 30,
      unit: 'GM',
    });

  return matches;
}
