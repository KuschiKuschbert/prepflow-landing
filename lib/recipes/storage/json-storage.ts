/**
 * JSON Storage (Migrated from scripts)
 * Stores recipes as JSON files with index management and compression
 */
import * as fs from 'fs';
import * as path from 'path';
import { STORAGE_PATH } from '../config';
import { ScrapedRecipe } from '../types';
import { scraperLogger } from '../utils/logger';
import {
  getStatisticsFromIndex,
  searchByIngredientInIndex,
  type RecipeIndex,
  type RecipeIndexEntry,
} from './json-storage/searchAndStats';
import { readRecipeFile, saveRecipeWithIndex } from './json-storage/saveAndLoad';

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
      const { filePath, isUpdate } = await saveRecipeWithIndex(
        recipe,
        this.storagePath,
        index,
        s => this.getSourceDir(s),
        existingEntry,
      );
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
      return await readRecipeFile(filePath, this.storagePath);
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
      return searchByIngredientInIndex(index, fp => this.loadRecipe(fp), ingredientName, limit);
    } catch (error) {
      scraperLogger.error('Error searching by ingredient:', error);
      return [];
    }
  }

  getStatistics(): { totalRecipes: number; bySource: Record<string, number>; lastUpdated: string } {
    try {
      if (!fs.existsSync(this.storagePath))
        return { totalRecipes: 0, bySource: {}, lastUpdated: new Date().toISOString() };
      return getStatisticsFromIndex(this.loadIndex());
    } catch (error) {
      scraperLogger.error('Error getting statistics:', error);
      return { totalRecipes: 0, bySource: {}, lastUpdated: new Date().toISOString() };
    }
  }
}
