/**
 * Fish pattern ingredient matching.
 */

import type { IngredientMatch } from '../types';

/**
 * Match fish pattern ingredients.
 */
export function matchFishPattern(
  findIngredient: (name: string) => string | null,
): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  const fishId =
    findIngredient('fish') ||
    findIngredient('salmon') ||
    findIngredient('salmon fillet') ||
    findIngredient('white fish');
  const lemonId = findIngredient('lemon');
  const oilId = findIngredient('olive oil') || findIngredient('olive oil extra virgin');
  const chipsId = findIngredient('chips') || findIngredient('potato') || findIngredient('potatoes');

  if (fishId)
    matches.push({ ingredient_id: fishId, ingredient_name: 'Fish', quantity: 200, unit: 'GM' });
  if (lemonId)
    matches.push({ ingredient_id: lemonId, ingredient_name: 'Lemon', quantity: 1, unit: 'PC' });
  if (oilId)
    matches.push({ ingredient_id: oilId, ingredient_name: 'Oil', quantity: 10, unit: 'ML' });
  if (chipsId)
    matches.push({ ingredient_id: chipsId, ingredient_name: 'Chips', quantity: 150, unit: 'GM' });

  return matches;
}
