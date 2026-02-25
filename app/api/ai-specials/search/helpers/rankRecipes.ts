/**
 * Rank and filter recipes by match count and stock match percentage.
 */

import { ingredientsMatch } from '@/lib/ingredient-normalization';

export interface RecipeForRanking {
  id: string;
  name: string;
  image_url: string;
  ingredients: (string | { name: string; quantity?: number; unit?: string })[];
  meta: Record<string, unknown>;
  matchCount?: number;
  stockMatchCount?: number;
  stockMatchPercentage?: number;
  missingIngredients?: string[];
  randomScore?: number;
}

const PANTRY_STAPLES = ['salt', 'pepper', 'water', 'oil', 'sugar'];

export function rankAndFilterRecipes(
  recipes: RecipeForRanking[],
  usedIngredients: string[],
  stockIngredientsRaw: string[],
  useStock: boolean,
  minStockMatch: number,
): RecipeForRanking[] {
  let ranked = recipes.map(recipe => {
    const recipeText = JSON.stringify(recipe).toLowerCase();
    const matchCount = usedIngredients.filter(ui => recipeText.includes(ui.toLowerCase())).length;

    let stockMatchPercentage = 0;
    let stockMatchCount = 0;
    const missingIngredients: string[] = [];

    if (useStock && recipe.ingredients && Array.isArray(recipe.ingredients)) {
      recipe.ingredients.forEach(recipeIng => {
        let ingName = '';
        if (typeof recipeIng === 'string') ingName = recipeIng;
        else if (typeof recipeIng === 'object' && recipeIng !== null && 'name' in recipeIng) {
          ingName = recipeIng.name;
        }
        if (!ingName) return;

        let isMatch = false;
        for (const stockItem of stockIngredientsRaw) {
          if (ingredientsMatch(stockItem, ingName)) {
            isMatch = true;
            break;
          }
        }

        if (isMatch) stockMatchCount++;
        else {
          const lowerName = ingName.toLowerCase();
          const isPantry = PANTRY_STAPLES.some(p => lowerName.includes(p));
          if (!isPantry) missingIngredients.push(ingName);
        }
      });

      stockMatchPercentage =
        recipe.ingredients.length > 0
          ? Math.round((stockMatchCount / recipe.ingredients.length) * 100)
          : 0;
    }

    return {
      ...recipe,
      matchCount,
      stockMatchCount,
      stockMatchPercentage,
      missingIngredients,
      randomScore: Math.random(),
    };
  });

  ranked = ranked.sort((a, b) => {
    if (useStock) {
      if ((b.stockMatchPercentage || 0) !== (a.stockMatchPercentage || 0)) {
        return (b.stockMatchPercentage || 0) - (a.stockMatchPercentage || 0);
      }
    }
    if ((b.matchCount || 0) !== (a.matchCount || 0)) {
      return (b.matchCount || 0) - (a.matchCount || 0);
    }
    return (a.randomScore || 0) - (b.randomScore || 0);
  });

  if (minStockMatch > 0) {
    ranked = ranked.filter(r => (r.stockMatchPercentage || 0) >= minStockMatch);
  }

  return ranked;
}
