import { logger } from '@/lib/logger';
import { ScrapedRecipe } from '@/lib/recipes/types';
import { loadRecipe } from '../../recipe-database-helpers';

export interface RecipeMatch {
  recipe: ScrapedRecipe;
  matchingIngredientCount: number;
  rating: number;
  hasRating: boolean;
}

export async function processRecipeEntry(
  entry: { id: string; file_path: string; source: string },
  lowerIngredients: string[],
): Promise<RecipeMatch | null> {
  try {
    const recipe = await loadRecipe(entry.file_path);
    if (!recipe) return null;

    const recipeIngredientNames = recipe.ingredients.map((ing: unknown) => {
      if (typeof ing === 'string') return (ing as string).toLowerCase();
      if (ing && typeof ing === 'object' && 'name' in ing) {
        return (ing as { name: string }).name.toLowerCase();
      }
      if (ing && typeof ing === 'object' && 'original_text' in ing) {
        return (ing as { original_text: string }).original_text.toLowerCase();
      }
      return '';
    });

    const matchingIngredientCount = lowerIngredients.filter(searchIng =>
      recipeIngredientNames.some((recipeIng: string) => recipeIng.includes(searchIng)),
    ).length;

    if (matchingIngredientCount > 0) {
      return {
        recipe,
        matchingIngredientCount,
        rating: recipe.rating || 0,
        hasRating: !!recipe.rating,
      };
    }
    return null;
  } catch (error) {
    logger.error(`Error processing recipe entry ${entry.id}:`, error);
    return null;
  }
}

export function sortRecipeMatches(matches: RecipeMatch[]): RecipeMatch[] {
  return [...matches].sort((a, b) => {
    if (a.hasRating !== b.hasRating) {
      return a.hasRating ? -1 : 1;
    }
    if (a.hasRating && b.hasRating) {
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
    }
    return b.matchingIngredientCount - a.matchingIngredientCount;
  });
}

export function selectDiverseRecipes(matches: RecipeMatch[], limit: number): ScrapedRecipe[] {
  const results: ScrapedRecipe[] = [];
  const usedSources = new Set<string>();
  const sourceGroups = new Map<string, ScrapedRecipe[]>();

  for (const match of matches) {
    const source = match.recipe.source;
    if (!sourceGroups.has(source)) {
      sourceGroups.set(source, []);
    }
    sourceGroups.get(source)!.push(match.recipe);
  }

  // First, add one recipe from each source
  for (const [source, recipes] of sourceGroups.entries()) {
    if (results.length >= limit) break;
    if (usedSources.has(source)) continue;
    results.push(recipes[0]);
    usedSources.add(source);
  }

  // Then, fill remaining slots
  for (const match of matches) {
    if (results.length >= limit) break;
    if (results.some(r => r.id === match.recipe.id)) continue;
    results.push(match.recipe);
  }

  return results.slice(0, limit);
}
