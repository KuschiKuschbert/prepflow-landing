/**
 * JSON Storage
 * Stores recipes as JSON files with index management and compression
 */

import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { ScrapedRecipe } from '../parsers/types';
import { STORAGE_PATH } from '../config';
import { scraperLogger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

interface RecipeIndex {
  recipes: RecipeIndexEntry[];
  lastUpdated: string;
  totalCount: number;
}

interface RecipeIndexEntry {
  id: string;
  recipe_name: string;
  source: string;
  source_url: string;
  file_path: string;
  scraped_at: string;
  updated_at?: string; // For fast format filtering
}

export class JSONStorage {
  private storagePath: string;
  private indexPath: string;

  constructor(storagePath: string = STORAGE_PATH) {
    this.storagePath = path.resolve(storagePath);
    this.indexPath = path.join(this.storagePath, 'index.json');
    this.ensureDirectoryExists();
  }

  /**
   * Ensure storage directory exists
   */
  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  /**
   * Get source directory path
   */
  private getSourceDir(source: string): string {
    const sourceDir = path.join(this.storagePath, source);
    if (!fs.existsSync(sourceDir)) {
      fs.mkdirSync(sourceDir, { recursive: true });
    }
    return sourceDir;
  }

  /**
   * Generate filename for recipe (with .json.gz extension for compression)
   */
  private generateFilename(recipe: ScrapedRecipe): string {
    // Sanitize recipe name for filename
    const sanitized = recipe.recipe_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);

    // Sanitize ID - handle URLs and special characters
    let id = recipe.id || uuidv4();

    // If ID is a URL, extract a safe identifier from it
    if (id.startsWith('http://') || id.startsWith('https://')) {
      try {
        const urlObj = new URL(id);
        const pathParts = urlObj.pathname.split('/').filter(Boolean);

        // Try to extract numeric ID (common pattern: /recipe/12345/...)
        const numericId = pathParts.find(part => /^\d+$/.test(part));
        if (numericId) {
          id = numericId;
        } else {
          // Extract last meaningful part (usually slug)
          const lastPart = pathParts[pathParts.length - 1] || '';
          id = lastPart || urlObj.pathname.replace(/[^a-z0-9]/gi, '-').substring(0, 32);
        }
      } catch {
        // If URL parsing fails, extract from string
        const urlParts = id.split('/').filter(Boolean);
        const lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || '';
        id = lastPart || uuidv4();
      }
    }

    // Sanitize ID to remove any remaining special characters
    const sanitizedId = id
      .replace(/[^a-z0-9-]/gi, '')
      .replace(/^-+|-+$/g, '')
      .substring(0, 32); // Limit ID length

    // Fallback to UUID if ID is empty after sanitization
    const finalId = sanitizedId || uuidv4().substring(0, 8);

    return `${sanitized}-${finalId}.json.gz`;
  }

  /**
   * Load recipe index
   */
  private loadIndex(): RecipeIndex {
    if (!fs.existsSync(this.indexPath)) {
      return {
        recipes: [],
        lastUpdated: new Date().toISOString(),
        totalCount: 0,
      };
    }

    try {
      const content = fs.readFileSync(this.indexPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      scraperLogger.error('Error loading index, creating new one:', error);
      return {
        recipes: [],
        lastUpdated: new Date().toISOString(),
        totalCount: 0,
      };
    }
  }

  /**
   * Save recipe index
   */
  private saveIndex(index: RecipeIndex): void {
    try {
      // Ensure directory exists before writing
      this.ensureDirectoryExists();
      index.lastUpdated = new Date().toISOString();
      index.totalCount = index.recipes.length;
      fs.writeFileSync(this.indexPath, JSON.stringify(index, null, 2), 'utf-8');
    } catch (error) {
      scraperLogger.error('Error saving index:', error);
      // Don't throw - allow operation to continue even if index save fails
    }
  }

  /**
   * Check if recipe already exists (deduplication)
   */
  private isDuplicate(recipe: ScrapedRecipe, index: RecipeIndex): boolean {
    // Check by source URL (most reliable)
    const existsByUrl = index.recipes.some(
      entry => entry.source_url === recipe.source_url && entry.source === recipe.source,
    );

    if (existsByUrl) return true;

    // Check by recipe name + source (less reliable but catches duplicates)
    const existsByName = index.recipes.some(
      entry =>
        entry.recipe_name.toLowerCase() === recipe.recipe_name.toLowerCase() &&
        entry.source === recipe.source,
    );

    return existsByName;
  }

  /**
   * Check if a URL already exists in the database (for pre-scraping duplicate check)
   */
  urlExists(source: string, url: string): boolean {
    try {
      // Ensure directory exists
      if (!fs.existsSync(this.storagePath)) {
        return false;
      }
      const index = this.loadIndex();
      return index.recipes.some(entry => entry.source_url === url && entry.source === source);
    } catch (error) {
      scraperLogger.error('Error checking if URL exists:', error);
      return false;
    }
  }

  /**
   * Save a recipe to JSON file
   * If recipe already exists (by source_url + source), updates the existing file
   * Otherwise creates a new file
   */
  async saveRecipe(
    recipe: ScrapedRecipe,
  ): Promise<{ saved: boolean; filePath?: string; reason?: string; updated?: boolean }> {
    try {
      const index = this.loadIndex();

      // Check if recipe already exists (for updates)
      const existingEntry = index.recipes.find(
        entry => entry.source_url === recipe.source_url && entry.source === recipe.source,
      );

      let filePath: string;
      let isUpdate = false;

      if (existingEntry) {
        // Recipe exists - update the existing file
        isUpdate = true;
        filePath = path.isAbsolute(existingEntry.file_path)
          ? existingEntry.file_path
          : path.join(this.storagePath, existingEntry.file_path);

        // Ensure directory exists
        const parentDir = path.dirname(filePath);
        if (!fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true });
        }

        scraperLogger.debug(
          `Updating existing recipe: ${recipe.recipe_name} from ${recipe.source}`,
          { filePath: existingEntry.file_path },
        );
      } else {
        // New recipe - create new file
        // Get source directory (this ensures it exists)
        const sourceDir = this.getSourceDir(recipe.source);

        // Generate filename
        const filename = this.generateFilename(recipe);
        filePath = path.join(sourceDir, filename);

        // Ensure parent directory exists (double-check)
        const parentDir = path.dirname(filePath);
        if (!fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true });
        }

        // Add to index
        index.recipes.push({
          id: recipe.id,
          recipe_name: recipe.recipe_name,
          source: recipe.source,
          source_url: recipe.source_url,
          file_path: path.relative(this.storagePath, filePath),
          scraped_at: recipe.scraped_at,
          updated_at: recipe.updated_at, // Include updated_at for fast format filtering
        });

        scraperLogger.debug(`Creating new recipe: ${recipe.recipe_name} from ${recipe.source}`);
      }

      // Save recipe JSON with compression (overwrites existing file if updating)
      const jsonString = JSON.stringify(recipe, null, 2);
      const compressed = await gzip(Buffer.from(jsonString, 'utf-8'));
      fs.writeFileSync(filePath, compressed);

      // Update index entry if recipe name changed (for updates)
      if (isUpdate && existingEntry) {
        existingEntry.recipe_name = recipe.recipe_name;
        existingEntry.id = recipe.id;
        existingEntry.updated_at = recipe.updated_at; // Update updated_at in index for fast format filtering
        // Keep original scraped_at in index, but recipe file has updated updated_at
      }

      this.saveIndex(index);

      scraperLogger.info(
        `${isUpdate ? 'Updated' : 'Saved'} recipe: ${recipe.recipe_name} to ${filePath}`,
      );
      return { saved: true, filePath, updated: isUpdate };
    } catch (error) {
      scraperLogger.error('Error saving recipe:', error);
      return { saved: false, reason: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Load a recipe from file (handles both compressed .json.gz and uncompressed .json files)
   */
  async loadRecipe(filePath: string): Promise<ScrapedRecipe | null> {
    try {
      // Ensure directory exists
      if (!fs.existsSync(this.storagePath)) {
        scraperLogger.debug('Storage directory does not exist');
        return null;
      }

      const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.storagePath, filePath);

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        scraperLogger.warn(`Recipe file not found: ${fullPath}`);
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
      scraperLogger.error(`Error loading recipe from ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Get all recipes from index
   */
  getAllRecipes(): RecipeIndexEntry[] {
    try {
      // Ensure directory exists
      if (!fs.existsSync(this.storagePath)) {
        scraperLogger.debug('Storage directory does not exist');
        return [];
      }
      const index = this.loadIndex();
      return index.recipes;
    } catch (error) {
      scraperLogger.error('Error getting all recipes:', error);
      return [];
    }
  }

  /**
   * Search recipes by ingredient name
   */
  async searchByIngredient(ingredientName: string, limit: number = 10): Promise<ScrapedRecipe[]> {
    try {
      // Ensure directory exists
      if (!fs.existsSync(this.storagePath)) {
        scraperLogger.debug('Storage directory does not exist');
        return [];
      }

      const index = this.loadIndex();
      const results: ScrapedRecipe[] = [];
      const lowerIngredient = ingredientName.toLowerCase();

      for (const entry of index.recipes) {
        if (results.length >= limit) break;

        try {
          const recipe = await this.loadRecipe(entry.file_path);
          if (!recipe) continue;

          // Check if recipe contains ingredient
          const hasIngredient = recipe.ingredients.some(ing => {
            const ingName = typeof ing === 'string' ? ing : ing.name || ing.original_text;
            return ingName.toLowerCase().includes(lowerIngredient);
          });

          if (hasIngredient) {
            results.push(recipe);
          }
        } catch (error) {
          scraperLogger.error(`Error processing recipe entry ${entry.id}:`, error);
          // Continue to next recipe instead of failing entire search
          continue;
        }
      }

      return results;
    } catch (error) {
      scraperLogger.error('Error searching by ingredient:', error);
      return [];
    }
  }

  /**
   * Get recipe count by source
   */
  getCountBySource(): Record<string, number> {
    try {
      // Ensure directory exists
      if (!fs.existsSync(this.storagePath)) {
        return {};
      }
      const index = this.loadIndex();
      const counts: Record<string, number> = {};

      for (const entry of index.recipes) {
        counts[entry.source] = (counts[entry.source] || 0) + 1;
      }

      return counts;
    } catch (error) {
      scraperLogger.error('Error getting count by source:', error);
      return {};
    }
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalRecipes: number;
    bySource: Record<string, number>;
    lastUpdated: string;
  } {
    try {
      // Ensure directory exists
      if (!fs.existsSync(this.storagePath)) {
        return {
          totalRecipes: 0,
          bySource: {},
          lastUpdated: new Date().toISOString(),
        };
      }
      const index = this.loadIndex();
      return {
        totalRecipes: index.totalCount,
        bySource: this.getCountBySource(),
        lastUpdated: index.lastUpdated,
      };
    } catch (error) {
      scraperLogger.error('Error getting statistics:', error);
      return {
        totalRecipes: 0,
        bySource: {},
        lastUpdated: new Date().toISOString(),
      };
    }
  }
}
