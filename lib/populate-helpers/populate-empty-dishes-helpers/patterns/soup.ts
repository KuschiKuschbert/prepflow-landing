/**
 * Soup pattern ingredient matching.
 */

import type { IngredientMatch } from '../types';

/**
 * Match soup pattern ingredients.
 */
export function matchSoupPattern(
  findIngredient: (name: string) => string | null,
): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  const onionId = findIngredient('onion') || findIngredient('onions brown');
  const carrotId = findIngredient('carrot') || findIngredient('carrots');
  const tomatoId = findIngredient('tomato') || findIngredient('fresh tomatoes');
  const garlicId = findIngredient('garlic');
  const stockId =
    findIngredient('stock') || findIngredient('chicken stock') || findIngredient('vegetable stock');

  if (onionId)
    matches.push({ ingredient_id: onionId, ingredient_name: 'Onion', quantity: 50, unit: 'GM' });
  if (carrotId)
    matches.push({
      ingredient_id: carrotId,
      ingredient_name: 'Carrot',
      quantity: 50,
      unit: 'GM',
    });
  if (tomatoId)
    matches.push({
      ingredient_id: tomatoId,
      ingredient_name: 'Tomato',
      quantity: 100,
      unit: 'GM',
    });
  if (garlicId)
    matches.push({ ingredient_id: garlicId, ingredient_name: 'Garlic', quantity: 5, unit: 'GM' });
  if (stockId)
    matches.push({ ingredient_id: stockId, ingredient_name: 'Stock', quantity: 250, unit: 'ML' });

  return matches;
}
