/**
 * Recipe Database
 * Loads and searches recipes from JSON database for AI specials feature
 */

import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { ScrapedRecipe } from '../../scripts/recipe-scraper/parsers/types';
import { logger } from '@/lib/logger';

const gunzip = promisify(zlib.gunzip);

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
    // Check if database directory exists
    if (!fs.existsSync(RECIPE_DATABASE_PATH)) {
      logger.debug('Recipe database directory not found');
      return null;
    }

    // Check if index file exists
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
 * Load a recipe from file (handles both compressed .json.gz and uncompressed .json files)
 */
async function loadRecipe(filePath: string): Promise<ScrapedRecipe | null> {
  try {
    // Check if database directory exists
    if (!fs.existsSync(RECIPE_DATABASE_PATH)) {
      logger.debug('Recipe database directory not found');
      return null;
    }

    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(RECIPE_DATABASE_PATH, filePath);

    if (!fs.existsSync(fullPath)) {
      logger.debug(`Recipe file not found: ${fullPath}`);
      return null;
    }

    const buffer = fs.readFileSync(fullPath);

    // Check if file is compressed (.json.gz) or uncompressed (.json)
    let content: string;
    if (fullPath.endsWith('.json.gz')) {
      // Decompress gzip file
      const decompressed = await gunzip(buffer);
      content = decompressed.toString('utf-8');
    } else {
      // Uncompressed JSON file (for backward compatibility)
      content = buffer.toString('utf-8');
    }

    return JSON.parse(content) as ScrapedRecipe;
  } catch (error) {
    logger.error(`Error loading recipe from ${filePath}:`, error);
    return null;
  }
}

/**
 * Search recipes by ingredients
 */
export async function searchRecipesByIngredients(
  ingredientNames: string[],
  limit: number = 5,
): Promise<ScrapedRecipe[]> {
  try {
    // Check if database directory exists
    if (!fs.existsSync(RECIPE_DATABASE_PATH)) {
      logger.debug('Recipe database directory not found');
      return [];
    }

    const index = loadIndex();
    if (!index || index.recipes.length === 0) {
      logger.debug('No recipes in database');
      return [];
    }

    const results: ScrapedRecipe[] = [];
    const lowerIngredients = ingredientNames.map(ing => ing.toLowerCase());

    for (const entry of index.recipes) {
      if (results.length >= limit) break;

      try {
        const recipe = await loadRecipe(entry.file_path);
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
      } catch (error) {
        logger.error(`Error processing recipe entry ${entry.id}:`, error);
        // Continue to next recipe instead of failing entire search
        continue;
      }
    }

    return results;
  } catch (error) {
    logger.error('Error searching recipes by ingredients:', error);
    return [];
  }
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
  try {
    // Check if database directory exists
    if (!fs.existsSync(RECIPE_DATABASE_PATH)) {
      logger.debug('Recipe database directory not found');
      return {
        totalRecipes: 0,
        bySource: {},
        lastUpdated: null,
      };
    }

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
  } catch (error) {
    logger.error('Error getting recipe database stats:', error);
    return {
      totalRecipes: 0,
      bySource: {},
      lastUpdated: null,
    };
  }
}
