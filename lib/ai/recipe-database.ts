/**
 * Recipe Database
 * Loads and searches recipes from JSON database for AI specials feature
 */

import * as fs from 'fs';
import * as path from 'path';
import { ScrapedRecipe } from '../../scripts/recipe-scraper/parsers/types';
import { logger } from '../logger';

const RECIPE_DATABASE_PATH = path.join(process.cwd(), 'data', 'recipe-database');
const INDEX_PATH = path.join(RECIPE_DATABASE_PATH, 'index.json');

interface RecipeIndexEntry {
  id: string;
  recipe_name: string;
  source: string;
  source_url: string;
  file_path: string;
  scraped_at: string;
}

interface RecipeIndex {
  recipes: RecipeIndexEntry[];
  lastUpdated: string;
  totalCount: number;
}

/**
 * Load recipe index
 */
function loadIndex(): RecipeIndex | null {
  try {
    if (!fs.existsSync(INDEX_PATH)) {
      logger.debug('Recipe database index not found');
      return null;
    }

    const content = fs.readFileSync(INDEX_PATH, 'utf-8');
    return JSON.parse(content) as RecipeIndex;
  } catch (error) {
    logger.error('Error loading recipe index:', error);
    return null;
  }
}

/**
 * Load a recipe from file
 */
function loadRecipe(filePath: string): ScrapedRecipe | null {
  try {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(RECIPE_DATABASE_PATH, filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content) as ScrapedRecipe;
  } catch (error) {
    logger.error(`Error loading recipe from ${filePath}:`, error);
    return null;
  }
}

/**
 * Search recipes by ingredients
 */
export function searchRecipesByIngredients(
  ingredientNames: string[],
  limit: number = 5,
): ScrapedRecipe[] {
  const index = loadIndex();
  if (!index || index.recipes.length === 0) {
    logger.debug('No recipes in database');
    return [];
  }

  const results: ScrapedRecipe[] = [];
  const lowerIngredients = ingredientNames.map(ing => ing.toLowerCase());

  for (const entry of index.recipes) {
    if (results.length >= limit) break;

    const recipe = loadRecipe(entry.file_path);
    if (!recipe) continue;

    // Check if recipe contains any of the ingredients
    const recipeIngredientNames = recipe.ingredients.map(ing =>
      (typeof ing === 'string' ? ing : ing.name || ing.original_text).toLowerCase(),
    );

    const hasMatchingIngredient = lowerIngredients.some(searchIng =>
      recipeIngredientNames.some(recipeIng => recipeIng.includes(searchIng)),
    );

    if (hasMatchingIngredient) {
      results.push(recipe);
    }
  }

  return results;
}

/**
 * Format recipes for AI prompt context
 */
export function formatRecipesForPrompt(recipes: ScrapedRecipe[]): string {
  if (recipes.length === 0) {
    return '';
  }

  const formatted = recipes.map((recipe, index) => {
    const ingredients = recipe.ingredients
      .map(ing => (typeof ing === 'string' ? ing : ing.original_text))
      .join(', ');

    return `
Recipe ${index + 1}: ${recipe.recipe_name}
- Source: ${recipe.source}
- Ingredients: ${ingredients}
- Instructions: ${recipe.instructions.slice(0, 3).join('; ')}${recipe.instructions.length > 3 ? '...' : ''}
${recipe.category ? `- Category: ${recipe.category}` : ''}
${recipe.cuisine ? `- Cuisine: ${recipe.cuisine}` : ''}
${recipe.dietary_tags && recipe.dietary_tags.length > 0 ? `- Dietary: ${recipe.dietary_tags.join(', ')}` : ''}
`;
  });

  return `
Similar recipes from our database that use these ingredients:
${formatted.join('\n')}
`;
}

/**
 * Get recipe database statistics
 */
export function getRecipeDatabaseStats(): {
  totalRecipes: number;
  bySource: Record<string, number>;
  lastUpdated: string | null;
} {
  const index = loadIndex();
  if (!index) {
    return {
      totalRecipes: 0,
      bySource: {},
      lastUpdated: null,
    };
  }

  const bySource: Record<string, number> = {};
  for (const entry of index.recipes) {
    bySource[entry.source] = (bySource[entry.source] || 0) + 1;
  }

  return {
    totalRecipes: index.totalCount,
    bySource,
    lastUpdated: index.lastUpdated,
  };
}
