/**
 * JSON Storage
 * Stores recipes as JSON files with index management
 */

import * as fs from 'fs';
import * as path from 'path';
import { ScrapedRecipe } from '../parsers/types';
import { STORAGE_PATH } from '../config';
import { scraperLogger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

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
   * Generate filename for recipe
   */
  private generateFilename(recipe: ScrapedRecipe): string {
    // Sanitize recipe name for filename
    const sanitized = recipe.recipe_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
    const id = recipe.id || uuidv4();
    return `${sanitized}-${id.substring(0, 8)}.json`;
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
    index.lastUpdated = new Date().toISOString();
    index.totalCount = index.recipes.length;
    fs.writeFileSync(this.indexPath, JSON.stringify(index, null, 2), 'utf-8');
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
   * Save a recipe to JSON file
   */
  async saveRecipe(
    recipe: ScrapedRecipe,
  ): Promise<{ saved: boolean; filePath?: string; reason?: string }> {
    try {
      const index = this.loadIndex();

      // Check for duplicates
      if (this.isDuplicate(recipe, index)) {
        scraperLogger.debug(`Recipe already exists: ${recipe.recipe_name} from ${recipe.source}`);
        return { saved: false, reason: 'duplicate' };
      }

      // Get source directory
      const sourceDir = this.getSourceDir(recipe.source);

      // Generate filename
      const filename = this.generateFilename(recipe);
      const filePath = path.join(sourceDir, filename);

      // Save recipe JSON
      fs.writeFileSync(filePath, JSON.stringify(recipe, null, 2), 'utf-8');

      // Update index
      index.recipes.push({
        id: recipe.id,
        recipe_name: recipe.recipe_name,
        source: recipe.source,
        source_url: recipe.source_url,
        file_path: path.relative(this.storagePath, filePath),
        scraped_at: recipe.scraped_at,
      });

      this.saveIndex(index);

      scraperLogger.info(`Saved recipe: ${recipe.recipe_name} to ${filePath}`);
      return { saved: true, filePath };
    } catch (error) {
      scraperLogger.error('Error saving recipe:', error);
      return { saved: false, reason: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Load a recipe from file
   */
  loadRecipe(filePath: string): ScrapedRecipe | null {
    try {
      const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.storagePath, filePath);
      const content = fs.readFileSync(fullPath, 'utf-8');
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
    const index = this.loadIndex();
    return index.recipes;
  }

  /**
   * Search recipes by ingredient name
   */
  searchByIngredient(ingredientName: string, limit: number = 10): ScrapedRecipe[] {
    const index = this.loadIndex();
    const results: ScrapedRecipe[] = [];
    const lowerIngredient = ingredientName.toLowerCase();

    for (const entry of index.recipes) {
      if (results.length >= limit) break;

      const recipe = this.loadRecipe(entry.file_path);
      if (!recipe) continue;

      // Check if recipe contains ingredient
      const hasIngredient = recipe.ingredients.some(ing => {
        const ingName = typeof ing === 'string' ? ing : ing.name || ing.original_text;
        return ingName.toLowerCase().includes(lowerIngredient);
      });

      if (hasIngredient) {
        results.push(recipe);
      }
    }

    return results;
  }

  /**
   * Get recipe count by source
   */
  getCountBySource(): Record<string, number> {
    const index = this.loadIndex();
    const counts: Record<string, number> = {};

    for (const entry of index.recipes) {
      counts[entry.source] = (counts[entry.source] || 0) + 1;
    }

    return counts;
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalRecipes: number;
    bySource: Record<string, number>;
    lastUpdated: string;
  } {
    const index = this.loadIndex();
    return {
      totalRecipes: index.totalCount,
      bySource: this.getCountBySource(),
      lastUpdated: index.lastUpdated,
    };
  }
}
