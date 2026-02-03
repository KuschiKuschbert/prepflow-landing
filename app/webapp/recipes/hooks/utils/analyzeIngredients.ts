import { RecipeIngredientWithDetails } from '@/lib/types/recipes';

export interface IngredientAnalysis {
  hasProtein: boolean;
  hasVegetables: boolean;
  hasDairy: boolean;
  hasGrains: boolean;
}

export function analyzeIngredients(ingredients: RecipeIngredientWithDetails[]): IngredientAnalysis {
  const ingredientNames = ingredients.map(ri =>
    (ri.ingredients.ingredient_name || '').toLowerCase(),
  );
  const hasProtein = ingredientNames.some(
    name =>
      name.includes('beef') ||
      name.includes('chicken') ||
      name.includes('pork') ||
      name.includes('fish') ||
      name.includes('lamb') ||
      name.includes('mince'),
  );
  const hasVegetables = ingredientNames.some(
    name =>
      name.includes('carrot') ||
      name.includes('onion') ||
      name.includes('garlic') ||
      name.includes('tomato') ||
      name.includes('pepper') ||
      name.includes('celery'),
  );
  const hasDairy = ingredientNames.some(
    name =>
      name.includes('cheese') ||
      name.includes('milk') ||
      name.includes('cream') ||
      name.includes('butter') ||
      name.includes('yogurt'),
  );
  const hasGrains = ingredientNames.some(
    name =>
      name.includes('rice') ||
      name.includes('pasta') ||
      name.includes('bread') ||
      name.includes('flour') ||
      name.includes('quinoa'),
  );
  return { hasProtein, hasVegetables, hasDairy, hasGrains };
}
