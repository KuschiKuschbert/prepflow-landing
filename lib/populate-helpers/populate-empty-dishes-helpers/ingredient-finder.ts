/**
 * Ingredient finder utility for pattern matching.
 * Supports exact match first, then partial (contains) match for flexible naming.
 */

type IngredientLookup = Array<{ id: string; ingredient_name: string; unit: string }>;

/**
 * Create ingredient lookup map and finder function.
 * Tries exact match first, then partial match (ingredient_name contains search term).
 */
export function createIngredientFinder(availableIngredients: IngredientLookup) {
  const ingredientMap = new Map<string, string>();
  availableIngredients.forEach(ing => {
    const nameLower = ing.ingredient_name.toLowerCase();
    ingredientMap.set(nameLower, ing.id);
    ingredientMap.set(ing.ingredient_name, ing.id);
  });

  return (name: string): string | null => {
    const nameLower = name.toLowerCase().trim();
    const exact = ingredientMap.get(nameLower) || ingredientMap.get(name) || null;
    if (exact) return exact;

    // Fallback: partial match - first ingredient whose name contains the search term
    const partial = availableIngredients.find(ing =>
      ing.ingredient_name.toLowerCase().includes(nameLower),
    );
    return partial?.id ?? null;
  };
}
