import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import type { Ingredient } from '../../types';

/**
 * Aggregate allergens from ingredients
 *
 * @param {Ingredient[]} ingredients - Array of ingredients
 * @returns {string[]} Consolidated allergen codes
 */
export function aggregateIngredientAllergens(ingredients: Ingredient[]): string[] {
  const allIngredientAllergens: string[] = [];
  ingredients.forEach(ing => {
    if (ing.allergens && Array.isArray(ing.allergens)) {
      allIngredientAllergens.push(...ing.allergens);
    }
  });
  return consolidateAllergens(allIngredientAllergens);
}
