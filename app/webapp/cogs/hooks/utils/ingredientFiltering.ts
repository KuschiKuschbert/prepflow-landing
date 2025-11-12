import { Ingredient } from '../../types';

export function filterIngredients(ingredients: Ingredient[], searchTerm: string): Ingredient[] {
  if (!searchTerm.trim()) {
    return ingredients.slice(0, 50);
  }
  const term = searchTerm.toLowerCase().trim();
  const filtered = ingredients
    .filter(
      ingredient =>
        ingredient.ingredient_name.toLowerCase().includes(term) ||
        (ingredient.unit && ingredient.unit.toLowerCase().includes(term)),
    )
    .sort((a, b) => {
      const aName = a.ingredient_name.toLowerCase();
      const bName = b.ingredient_name.toLowerCase();
      if (aName.startsWith(term) && !bName.startsWith(term)) return -1;
      if (!aName.startsWith(term) && bName.startsWith(term)) return 1;
      if (aName === term && bName !== term) return -1;
      if (aName !== term && bName === term) return 1;
      return aName.localeCompare(bName);
    })
    .slice(0, 20);
  return filtered;
}
