import type { AllergenItem } from '../../types';

export function buildIngredientAllergenMap(item: AllergenItem): Record<string, string[]> {
  const ingredientAllergenMap: Record<string, string[]> = {};
  if (item.allergenSources) {
    Object.entries(item.allergenSources).forEach(([allergen, ingredients]) => {
      (ingredients as string[]).forEach((ingredientName: string) => {
        if (!ingredientAllergenMap[ingredientName]) {
          ingredientAllergenMap[ingredientName] = [];
        }
        if (!ingredientAllergenMap[ingredientName].includes(allergen)) {
          ingredientAllergenMap[ingredientName].push(allergen);
        }
      });
    });
  }
  return ingredientAllergenMap;
}
