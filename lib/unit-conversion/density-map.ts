/**
 * Ingredient Density Map - maps ingredient names to density in g/ml.
 */
import { INGREDIENT_DENSITIES } from './density-data';

export { INGREDIENT_DENSITIES };

export function getIngredientDensity(ingredientName: string): number | null {
  if (!ingredientName) return null;
  const lower = ingredientName.toLowerCase().trim();
  if (INGREDIENT_DENSITIES[lower]) return INGREDIENT_DENSITIES[lower];
  const sortedKeys = Object.keys(INGREDIENT_DENSITIES).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lower.includes(key)) return INGREDIENT_DENSITIES[key];
  }
  return null;
}
