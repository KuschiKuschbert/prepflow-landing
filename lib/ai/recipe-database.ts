/**
 * Recipe Database
 * Loads and searches recipes from JSON database for AI specials feature
 */

import { logger } from '@/lib/logger';
import { ScrapedRecipe } from '../../scripts/recipe-scraper/parsers/types';
import { loadIndex, loadRecipe, formatRecipesForPrompt, getRecipeDatabaseStats } from './recipe-database-helpers';

/**
 * Search recipes by ingredients with rating prioritization and source diversity
 */
export async function searchRecipesByIngredients(
  ingredientNames: string[],
  limit: number = 5,
  sourceFilter?: string,
): Promise<ScrapedRecipe[]> {
  try {
    const index = loadIndex();
    if (!index || index.recipes.length === 0) {
      logger.debug('No recipes in database');
      return [];
    }

    const matches: Array<{
      recipe: ScrapedRecipe;
      matchingIngredientCount: number;
      rating: number;
      hasRating: boolean;
    }> = [];
    const lowerIngredients = ingredientNames.map(ing => ing.toLowerCase());

    // First pass: collect all matching recipes
    for (const entry of index.recipes) {
      if (sourceFilter && entry.source !== sourceFilter) {
        continue;
      }

      try {
        const recipe = await loadRecipe(entry.file_path);
        if (!recipe) continue;

        const recipeIngredientNames = recipe.ingredients.map(ing =>
          (typeof ing === 'string' ? ing : ing.name || ing.original_text).toLowerCase(),
        );

        const matchingIngredientCount = lowerIngredients.filter(searchIng =>
          recipeIngredientNames.some(recipeIng => recipeIng.includes(searchIng)),
        ).length;

        if (matchingIngredientCount > 0) {
          matches.push({
            recipe,
            matchingIngredientCount,
            rating: recipe.rating || 0,
            hasRating: !!recipe.rating,
          });
        }
      } catch (error) {
        logger.error(`Error processing recipe entry ${entry.id}:`, error);
        continue;
      }
    }

    // Sort matches by rating and matching count
    matches.sort((a, b) => {
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

    // Second pass: ensure source diversity
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
  } catch (error) {
    logger.error('Error searching recipes by ingredients:', error);
    return [];
  }
}

// Re-export helper functions
export { formatRecipesForPrompt, getRecipeDatabaseStats };
