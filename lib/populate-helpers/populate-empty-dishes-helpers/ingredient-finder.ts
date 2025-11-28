/**
 * Ingredient finder utility for pattern matching.
 */

type IngredientLookup = Array<{ id: string; ingredient_name: string; unit: string }>;

/**
 * Create ingredient lookup map and finder function.
 */
export function createIngredientFinder(availableIngredients: IngredientLookup) {
  const ingredientMap = new Map<string, string>();
  availableIngredients.forEach(ing => {
    const nameLower = ing.ingredient_name.toLowerCase();
    ingredientMap.set(nameLower, ing.id);
    ingredientMap.set(ing.ingredient_name, ing.id);
  });

  return (name: string): string | null => {
    const nameLower = name.toLowerCase();
    return ingredientMap.get(nameLower) || ingredientMap.get(name) || null;
  };
}
