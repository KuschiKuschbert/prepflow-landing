/**
 * BBC Good Food Scraper
 * Scrapes recipes from BBC Good Food using HTML parsing
 */

import * as cheerio from 'cheerio';
import { BaseScraper } from './base-scraper';
import { ScrapedRecipe, RecipeIngredient } from '../parsers/types';
import { scraperLogger } from '../utils/logger';

export class BBCGoodFoodScraper extends BaseScraper {
  constructor(config?: Partial<import('../parsers/types').ScraperConfig>) {
    super('bbc-good-food', config);
  }

  /**
   * Parse recipe from HTML
   */
  protected parseRecipe(html: string, url: string): Partial<ScrapedRecipe> | null {
    try {
      const $ = cheerio.load(html);

      // Try JSON-LD first
      const jsonLdScripts = $('script[type="application/ld+json"]');
      let recipeData: any = null;

      for (let i = 0; i < jsonLdScripts.length; i++) {
        try {
          const content = $(jsonLdScripts[i]).html();
          if (content) {
            const parsed = JSON.parse(content);
            const items = Array.isArray(parsed) ? parsed : [parsed];
            recipeData = items.find((item: any) => item['@type'] === 'Recipe');
            if (recipeData) break;
          }
        } catch (e) {
          // Continue
        }
      }

      if (recipeData) {
        return this.parseFromJSONLD(recipeData, url);
      }

      // Fallback to HTML parsing
      return this.parseFromHTML($, url);
    } catch (error) {
      scraperLogger.error('Error parsing BBC Good Food recipe:', error);
      return null;
    }
  }

  /**
   * Parse from JSON-LD structured data
   */
  private parseFromJSONLD(recipeData: any, url: string): Partial<ScrapedRecipe> {
    const recipe: Partial<ScrapedRecipe> = {
      id: recipeData.url || url,
      recipe_name: recipeData.name || '',
      description: recipeData.description || '',
      instructions: this.parseInstructions(recipeData.recipeInstructions || []),
      ingredients: this.parseIngredients(recipeData.recipeIngredient || []),
      yield: this.parseYield(recipeData.recipeYield),
      yield_unit: 'servings',
      prep_time_minutes: this.parseDuration(recipeData.prepTime),
      cook_time_minutes: this.parseDuration(recipeData.cookTime),
      total_time_minutes: this.parseDuration(recipeData.totalTime),
      image_url: this.parseImage(recipeData.image),
      author: recipeData.author?.name || recipeData.author,
    };

    if (recipeData.recipeCategory) {
      recipe.category = Array.isArray(recipeData.recipeCategory)
        ? recipeData.recipeCategory[0]
        : recipeData.recipeCategory;
    }

    if (recipeData.recipeCuisine) {
      recipe.cuisine = Array.isArray(recipeData.recipeCuisine)
        ? recipeData.recipeCuisine[0]
        : recipeData.recipeCuisine;
    }

    return recipe;
  }

  /**
   * Parse from HTML (fallback)
   */
  private parseFromHTML($: cheerio.CheerioAPI, url: string): Partial<ScrapedRecipe> | null {
    try {
      const recipe: Partial<ScrapedRecipe> = {
        id: url,
        recipe_name: $('h1.recipe-header__title, h1').first().text().trim() || '',
        description: $('.recipe-header__description, .recipe-description').text().trim() || '',
        instructions: $('.method__list-item, .recipe-method__list-item, ol.recipe-method__list li')
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 0),
        ingredients: $('.ingredients-list__item, .recipe-ingredients__list-item')
          .map((_, el) => ({
            name: '',
            original_text: $(el).text().trim(),
          }))
          .get()
          .filter(ing => ing.original_text.length > 0) as RecipeIngredient[],
        image_url: $('meta[property="og:image"]').attr('content') || undefined,
      };

      // Parse yield
      const yieldText = $('.recipe-header__servings, .recipe-servings').text() || '';
      const yieldMatch = yieldText.match(/(\d+)/);
      if (yieldMatch) {
        recipe.yield = parseInt(yieldMatch[1], 10);
        recipe.yield_unit = 'servings';
      }

      // Parse prep/cook time
      const prepTime = $('.recipe-header__cooking-time-prep, .prep-time').text();
      const cookTime = $('.recipe-header__cooking-time-cook, .cook-time').text();
      recipe.prep_time_minutes = this.parseTimeText(prepTime);
      recipe.cook_time_minutes = this.parseTimeText(cookTime);

      return recipe;
    } catch (error) {
      scraperLogger.error('Error in HTML parsing:', error);
      return null;
    }
  }

  /**
   * Parse instructions
   */
  private parseInstructions(instructions: any): string[] {
    if (Array.isArray(instructions)) {
      return instructions.map(inst => {
        if (typeof inst === 'string') return inst;
        if (inst.text) return inst.text;
        if (inst['@type'] === 'HowToStep' && inst.text) return inst.text;
        return String(inst);
      });
    }
    return [];
  }

  /**
   * Parse ingredients
   */
  private parseIngredients(ingredients: any[]): RecipeIngredient[] {
    if (!Array.isArray(ingredients)) return [];
    return ingredients.map(ing => ({
      name: '',
      original_text: typeof ing === 'string' ? ing : String(ing),
    }));
  }

  /**
   * Parse yield
   */
  private parseYield(yieldData: any): number | undefined {
    if (!yieldData) return undefined;
    if (typeof yieldData === 'number') return yieldData;
    if (typeof yieldData === 'string') {
      const match = yieldData.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    return undefined;
  }

  /**
   * Parse duration to minutes
   */
  private parseDuration(duration: string | undefined): number | undefined {
    if (!duration) return undefined;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
      const hours = parseInt(match[1] || '0', 10);
      const minutes = parseInt(match[2] || '0', 10);
      return hours * 60 + minutes;
    }
    return undefined;
  }

  /**
   * Parse time text (e.g., "15 mins", "1 hr 30 mins")
   */
  private parseTimeText(timeText: string): number | undefined {
    if (!timeText) return undefined;
    const hoursMatch = timeText.match(/(\d+)\s*hr/);
    const minsMatch = timeText.match(/(\d+)\s*min/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
    return hours * 60 + mins || undefined;
  }

  /**
   * Parse image URL
   */
  private parseImage(image: any): string | undefined {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    if (Array.isArray(image) && image.length > 0) {
      return typeof image[0] === 'string' ? image[0] : image[0].url;
    }
    if (image.url) return image.url;
    return undefined;
  }

  /**
   * Get recipe URLs
   */
  async getRecipeUrls(limit: number = 10): Promise<string[]> {
    scraperLogger.warn('BBC Good Food URL discovery not implemented - provide URLs manually');
    return [];
  }
}
