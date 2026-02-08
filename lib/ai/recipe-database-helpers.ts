/**
 * Helper functions for recipe database operations
 * Migrated to use core lib types
 */

import { logger } from '@/lib/logger';
import { ScrapedRecipe } from '@/lib/recipes/types';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as zlib from 'zlib';
import { formatRecipesForPrompt } from './recipe-database-helpers/format-helpers';

const gunzip = promisify(zlib.gunzip);

// Lazy-load paths to prevent Next.js from scanning directory at build time
function getRecipeDatabasePath(): string {
  return path.join(process.cwd(), 'data', 'recipe-database');
}

function getIndexPath(): string {
  return path.join(getRecipeDatabasePath(), 'index.json');
}

interface RecipeIndexEntry {
  id: string;
  recipe_name: string;
  source: string;
  source_url: string;
  file_path: string;
  scraped_at: string;
  updated_at?: string;
}

interface RecipeIndex {
  recipes: RecipeIndexEntry[];
  lastUpdated: string;
  totalCount: number;
}

/**
 * Load recipe index
 */
export function loadIndex(): RecipeIndex | null {
  try {
    const dbPath = getRecipeDatabasePath();
    const indexPath = getIndexPath();
    if (!fs.existsSync(dbPath)) return null;
    if (!fs.existsSync(indexPath)) return null;
    const content = fs.readFileSync(indexPath, 'utf-8');
    return JSON.parse(content) as RecipeIndex;
  } catch (error) {
    logger.error('Error loading recipe index:', error);
    return null;
  }
}

/**
 * Load a recipe from file
 */
export async function loadRecipe(filePath: string): Promise<ScrapedRecipe | null> {
  try {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(getRecipeDatabasePath(), filePath);
    if (!fs.existsSync(fullPath)) return null;

    const buffer = fs.readFileSync(fullPath);
    let content: string;
    if (fullPath.endsWith('.json.gz')) {
      const decompressed = await gunzip(buffer);
      content = decompressed.toString('utf-8');
    } else {
      content = buffer.toString('utf-8');
    }
    return JSON.parse(content) as ScrapedRecipe;
  } catch (error) {
    logger.error(`Error loading recipe from ${filePath}:`, error);
    return null;
  }
}

export { formatRecipesForPrompt };

/**
 * Get recipe database statistics
 */
export function getRecipeDatabaseStats(): {
  totalRecipes: number;
  bySource: Record<string, number>;
  lastUpdated: string | null;
} {
  try {
    const index = loadIndex();
    if (!index) return { totalRecipes: 0, bySource: {}, lastUpdated: null };
    const bySource: Record<string, number> = {};
    for (const entry of index.recipes) {
      bySource[entry.source] = (bySource[entry.source] || 0) + 1;
    }
    return { totalRecipes: index.totalCount, bySource, lastUpdated: index.lastUpdated };
  } catch (error) {
    logger.error('Error getting recipe database stats:', error);
    return { totalRecipes: 0, bySource: {}, lastUpdated: null };
  }
}
