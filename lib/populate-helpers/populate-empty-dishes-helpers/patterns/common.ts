/**
 * Common ingredients fallback pattern matching.
 */

import type { IngredientMatch } from '../types';

/**
 * Match common ingredients as fallback.
 */
export function matchCommonIngredients(
  findIngredient: (name: string) => string | null,
): IngredientMatch[] {
  const matches: IngredientMatch[] = [];
  const commonIngredients = [
    { name: 'onion', variants: ['onion', 'onions brown'] },
    { name: 'garlic', variants: ['garlic'] },
    { name: 'oil', variants: ['olive oil', 'olive oil extra virgin', 'vegetable oil'] },
  ];

  for (const common of commonIngredients) {
    for (const variant of common.variants) {
      const id = findIngredient(variant);
      if (id) {
        matches.push({
          ingredient_id: id,
          ingredient_name: common.name.charAt(0).toUpperCase() + common.name.slice(1),
          quantity: common.name === 'oil' ? 10 : 50,
          unit: common.name === 'oil' ? 'ML' : 'GM',
        });
        break;
      }
    }
  }

  return matches;
}
