/**
 * Default/generic pattern ingredient matching.
 */

import type { IngredientMatch } from '../types';

/**
 * Match default/generic pattern ingredients.
 */
export function matchDefaultPattern(
  findIngredient: (name: string) => string | null,
): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  const onionId = findIngredient('onion') || findIngredient('onions brown');
  const garlicId = findIngredient('garlic');
  const oilId = findIngredient('olive oil') || findIngredient('olive oil extra virgin');
  const saltId = findIngredient('salt');
  const pepperId = findIngredient('pepper') || findIngredient('black pepper');

  if (onionId)
    matches.push({ ingredient_id: onionId, ingredient_name: 'Onion', quantity: 50, unit: 'GM' });
  if (garlicId)
    matches.push({ ingredient_id: garlicId, ingredient_name: 'Garlic', quantity: 5, unit: 'GM' });
  if (oilId)
    matches.push({ ingredient_id: oilId, ingredient_name: 'Oil', quantity: 10, unit: 'ML' });
  if (saltId)
    matches.push({ ingredient_id: saltId, ingredient_name: 'Salt', quantity: 2, unit: 'GM' });
  if (pepperId)
    matches.push({ ingredient_id: pepperId, ingredient_name: 'Pepper', quantity: 1, unit: 'GM' });

  return matches;
}
