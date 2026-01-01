/**
 * Index Manager
 * Manages recipe index and provides search functionality
 */

import { JSONStorage } from './json-storage';
import { ScrapedRecipe } from '../parsers/types';

export class IndexManager {
  private storage: JSONStorage;

  constructor(storage: JSONStorage) {
    this.storage = storage;
  }

  /**
   * Search recipes by multiple criteria
   */
  async searchRecipes(criteria: {
    ingredients?: string[];
    category?: string;
    cuisine?: string;
    dietaryTags?: string[];
    limit?: number;
  }): Promise<ScrapedRecipe[]> {
    const { ingredients, category, cuisine, dietaryTags, limit = 10 } = criteria;
    const allRecipes = this.storage.getAllRecipes();
    const results: ScrapedRecipe[] = [];

    for (const entry of allRecipes) {
      if (results.length >= limit) break;

      const recipe = await this.storage.loadRecipe(entry.file_path);
      if (!recipe) continue;

      // Filter by ingredients
      if (ingredients && ingredients.length > 0) {
        const recipeIngredientNames = recipe.ingredients.map(ing =>
          (typeof ing === 'string' ? ing : ing.name || ing.original_text).toLowerCase(),
        );
        const hasAllIngredients = ingredients.every(ing =>
          recipeIngredientNames.some(recipeIng => recipeIng.includes(ing.toLowerCase())),
        );
        if (!hasAllIngredients) continue;
      }

      // Filter by category
      if (category && recipe.category?.toLowerCase() !== category.toLowerCase()) {
        continue;
      }

      // Filter by cuisine
      if (cuisine && recipe.cuisine?.toLowerCase() !== cuisine.toLowerCase()) {
        continue;
      }

      // Filter by dietary tags
      if (dietaryTags && dietaryTags.length > 0) {
        const recipeTags = (recipe.dietary_tags || []).map(t => t.toLowerCase());
        const hasAllTags = dietaryTags.every(tag => recipeTags.includes(tag.toLowerCase()));
        if (!hasAllTags) continue;
      }

      results.push(recipe);
    }

    return results;
  }

  /**
   * Get recipes similar to given ingredients
   */
  async findSimilarRecipes(ingredients: string[], limit: number = 5): Promise<ScrapedRecipe[]> {
    return this.searchRecipes({ ingredients, limit });
  }

  /**
   * Get recipe statistics
   */
  getStatistics() {
    return this.storage.getStatistics();
  }
}
