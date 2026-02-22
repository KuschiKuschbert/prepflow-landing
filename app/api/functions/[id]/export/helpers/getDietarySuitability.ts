/**
 * Get dietary suitability labels for a dish or recipe.
 * Returns Vegetarian, Vegan, Gluten-free where applicable.
 */

import { consolidateAllergens } from '@/lib/allergens/australian-allergens';

type DishOrRecipe = {
  is_vegetarian?: boolean | null;
  is_vegan?: boolean | null;
  allergens?: string[] | null;
};

/**
 * Derive dietary suitability labels from dish or recipe data.
 *
 * @param source - Joined dish or recipe object with dietary fields
 * @returns Array of dietary labels, e.g. ['Vegetarian', 'Vegan', 'Gluten-free']
 */
export function getDietarySuitability(source: DishOrRecipe | null | undefined): string[] {
  if (!source) return [];

  const labels: string[] = [];

  if (source.is_vegan === true) {
    labels.push('Vegan');
  } else if (source.is_vegetarian === true) {
    labels.push('Vegetarian');
  }

  if (source.allergens && Array.isArray(source.allergens)) {
    const consolidated = consolidateAllergens(source.allergens);
    if (!consolidated.includes('gluten')) {
      labels.push('Gluten-free');
    }
  }

  return labels;
}
