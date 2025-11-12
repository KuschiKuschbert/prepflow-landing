import { COGSCalculation, RecipeIngredient } from '../../types';

export function mergeCalculations(
  existing: COGSCalculation[],
  loaded: COGSCalculation[],
): COGSCalculation[] {
  const existingIds = new Set(existing.map(c => c.ingredientId));
  const newFromApi = loaded.filter(c => !existingIds.has(c.ingredientId));
  const updated = existing.map(existing => {
    const fromApi = loaded.find(c => c.ingredientId === existing.ingredientId);
    return fromApi || existing;
  });
  return [...updated, ...newFromApi];
}

export function mergeRecipeIngredients(
  existing: RecipeIngredient[],
  loaded: RecipeIngredient[],
): RecipeIngredient[] {
  const existingIds = new Set(existing.map(r => r.ingredient_id));
  const newFromApi = loaded.filter(r => !existingIds.has(r.ingredient_id));
  const updated = existing.map(existing => {
    const fromApi = loaded.find(r => r.ingredient_id === existing.ingredient_id);
    return fromApi || existing;
  });
  return [...updated, ...newFromApi];
}
