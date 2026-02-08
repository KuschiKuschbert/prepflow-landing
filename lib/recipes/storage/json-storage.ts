/**
 * JSON Storage (Migrated from scripts)
 * Stores recipes as JSON files with index management and compression
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import * as zlib from 'zlib';
import { STORAGE_PATH } from '../config';
import { ScrapedRecipe } from '../types';
import { scraperLogger } from '../utils/logger';

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
  updated_at?: string;
}

export class JSONStorage {
  private storagePath: string;
  private indexPath: string;

  constructor(storagePath: string = STORAGE_PATH) {
    this.storagePath = path.resolve(storagePath);
    this.indexPath = path.join(this.storagePath, 'index.json');
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  private getSourceDir(source: string): string {
    const sourceDir = path.join(this.storagePath, source);
    if (!fs.existsSync(sourceDir)) {
      fs.mkdirSync(sourceDir, { recursive: true });
    }
    return sourceDir;
  }

  private generateFilename(recipe: ScrapedRecipe): string {
    const sanitized = recipe.recipe_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);

    let id = recipe.id || uuidv4();
    if (id.startsWith('http://') || id.startsWith('https://')) {
      try {
        const urlObj = new URL(id);
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        const numericId = pathParts.find(part => /^\d+$/.test(part));
        if (numericId) {
          id = numericId;
        } else {
          const lastPart = pathParts[pathParts.length - 1] || '';
          id = lastPart || urlObj.pathname.replace(/[^a-z0-9]/gi, '-').substring(0, 32);
        }
      } catch {
        const urlParts = id.split('/').filter(Boolean);
        const lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || '';
        id = lastPart || uuidv4();
      }
    }

    const sanitizedId = id
      .replace(/[^a-z0-9-]/gi, '')
      .replace(/^-+|-+$/g, '')
      .substring(0, 32);
    const finalId = sanitizedId || uuidv4().substring(0, 8);

    return `${sanitized}-${finalId}.json.gz`;
  }

  private loadIndex(): RecipeIndex {
    if (!fs.existsSync(this.indexPath)) {
      return { recipes: [], lastUpdated: new Date().toISOString(), totalCount: 0 };
    }
    try {
      const content = fs.readFileSync(this.indexPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      scraperLogger.error('Error loading index, creating new one:', error);
      return { recipes: [], lastUpdated: new Date().toISOString(), totalCount: 0 };
    }
  }

  private saveIndex(index: RecipeIndex): void {
    try {
      this.ensureDirectoryExists();
      index.lastUpdated = new Date().toISOString();
      index.totalCount = index.recipes.length;
      fs.writeFileSync(this.indexPath, JSON.stringify(index, null, 2), 'utf-8');
    } catch (error) {
      scraperLogger.error('Error saving index:', error);
    }
  }

  urlExists(source: string, url: string): boolean {
    try {
      if (!fs.existsSync(this.storagePath)) return false;
      const index = this.loadIndex();
      return index.recipes.some(entry => entry.source_url === url && entry.source === source);
    } catch (error) {
      scraperLogger.error('Error checking if URL exists:', error);
      return false;
    }
  }

  async saveRecipe(
    recipe: ScrapedRecipe,
  ): Promise<{ saved: boolean; filePath?: string; reason?: string; updated?: boolean }> {
    try {
      const index = this.loadIndex();
      const existingEntry = index.recipes.find(
        entry => entry.source_url === recipe.source_url && entry.source === recipe.source,
      );

      let filePath: string;
      let isUpdate = false;

      if (existingEntry) {
        isUpdate = true;
        filePath = path.isAbsolute(existingEntry.file_path)
          ? existingEntry.file_path
          : path.join(this.storagePath, existingEntry.file_path);
        const parentDir = path.dirname(filePath);
        if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
      } else {
        const sourceDir = this.getSourceDir(recipe.source);
        const filename = this.generateFilename(recipe);
        filePath = path.join(sourceDir, filename);
        if (!fs.existsSync(path.dirname(filePath)))
          fs.mkdirSync(path.dirname(filePath), { recursive: true });

        index.recipes.push({
          id: recipe.id,
          recipe_name: recipe.recipe_name,
          source: recipe.source,
          source_url: recipe.source_url,
          file_path: path.relative(this.storagePath, filePath),
          scraped_at: recipe.scraped_at,
          updated_at: recipe.updated_at,
        });
      }

      const jsonString = JSON.stringify(recipe, null, 2);
      const compressed = await gzip(Buffer.from(jsonString, 'utf-8'));
      fs.writeFileSync(filePath, compressed);

      if (isUpdate && existingEntry) {
        existingEntry.recipe_name = recipe.recipe_name;
        existingEntry.id = recipe.id;
        existingEntry.updated_at = recipe.updated_at;
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

  async loadRecipe(filePath: string): Promise<ScrapedRecipe | null> {
    try {
      if (!fs.existsSync(this.storagePath)) return null;
      const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.storagePath, filePath);
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
      scraperLogger.error(`Error loading recipe from ${filePath}:`, error);
      return null;
    }
  }

  getAllRecipes(): RecipeIndexEntry[] {
    try {
      if (!fs.existsSync(this.storagePath)) return [];
      const index = this.loadIndex();
      return index.recipes;
    } catch (error) {
      scraperLogger.error('Error getting all recipes:', error);
      return [];
    }
  }

  async searchByIngredient(ingredientName: string, limit: number = 10): Promise<ScrapedRecipe[]> {
    try {
      if (!fs.existsSync(this.storagePath)) return [];
      const index = this.loadIndex();
      const results: ScrapedRecipe[] = [];
      const lowerIngredient = ingredientName.toLowerCase();

      for (const entry of index.recipes) {
        if (results.length >= limit) break;
        try {
          const recipe = await this.loadRecipe(entry.file_path);
          if (!recipe) continue;
          const hasIngredient = recipe.ingredients.some(ing => {
            const ingName = typeof ing === 'string' ? ing : ing.name || ing.original_text;
            return ingName.toLowerCase().includes(lowerIngredient);
          });
          if (hasIngredient) results.push(recipe);
        } catch {}
      }
      return results;
    } catch (error) {
      scraperLogger.error('Error searching by ingredient:', error);
      return [];
    }
  }

  getStatistics(): { totalRecipes: number; bySource: Record<string, number>; lastUpdated: string } {
    try {
      if (!fs.existsSync(this.storagePath))
        return { totalRecipes: 0, bySource: {}, lastUpdated: new Date().toISOString() };
      const index = this.loadIndex();
      const counts: Record<string, number> = {};
      for (const entry of index.recipes) counts[entry.source] = (counts[entry.source] || 0) + 1;
      return { totalRecipes: index.totalCount, bySource: counts, lastUpdated: index.lastUpdated };
    } catch (error) {
      scraperLogger.error('Error getting statistics:', error);
      return { totalRecipes: 0, bySource: {}, lastUpdated: new Date().toISOString() };
    }
  }
}
