/**
 * Pasta pattern ingredient matching.
 */

import type { IngredientMatch } from '../types';

/**
 * Match pasta pattern ingredients.
 */
export function matchPastaPattern(
  findIngredient: (name: string) => string | null,
): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  const pastaId = findIngredient('pasta') || findIngredient('spaghetti');
  const sauceId =
    findIngredient('tomato sauce') ||
    findIngredient('pasta sauce') ||
    findIngredient('fresh tomatoes');
  const cheeseId =
    findIngredient('cheese') || findIngredient('parmesan') || findIngredient('cheddar');
  const garlicId = findIngredient('garlic');
  const oilId = findIngredient('olive oil') || findIngredient('olive oil extra virgin');

  if (pastaId)
    matches.push({ ingredient_id: pastaId, ingredient_name: 'Pasta', quantity: 150, unit: 'GM' });
  if (sauceId)
    matches.push({ ingredient_id: sauceId, ingredient_name: 'Sauce', quantity: 100, unit: 'GM' });
  if (cheeseId)
    matches.push({
      ingredient_id: cheeseId,
      ingredient_name: 'Cheese',
      quantity: 30,
      unit: 'GM',
    });
  if (garlicId)
    matches.push({ ingredient_id: garlicId, ingredient_name: 'Garlic', quantity: 5, unit: 'GM' });
  if (oilId)
    matches.push({ ingredient_id: oilId, ingredient_name: 'Oil', quantity: 10, unit: 'ML' });

  return matches;
}
