/**
 * AllRecipes Scraper
 * Scrapes recipes from AllRecipes.com using JSON-LD structured data
 */

import * as cheerio from 'cheerio';
import { BaseScraper } from './base-scraper';
import { ScrapedRecipe, RecipeIngredient } from '../parsers/types';
import { scraperLogger } from '../utils/logger';

export class AllRecipesScraper extends BaseScraper {
  constructor(config?: Partial<import('../parsers/types').ScraperConfig>) {
    super('allrecipes', config);
  }

  /**
   * Parse recipe from HTML using JSON-LD structured data
   */
  protected parseRecipe(html: string, url: string): Partial<ScrapedRecipe> | null {
    try {
      const $ = cheerio.load(html);

      // Try to find JSON-LD structured data
      const jsonLdScripts = $('script[type="application/ld+json"]');
      let recipeData: any = null;

      for (let i = 0; i < jsonLdScripts.length; i++) {
        try {
          const content = $(jsonLdScripts[i]).html();
          if (content) {
            const parsed = JSON.parse(content);
            // Handle both single objects and arrays
            const items = Array.isArray(parsed) ? parsed : [parsed];
            recipeData = items.find((item: any) => item['@type'] === 'Recipe');
            if (recipeData) break;
          }
        } catch (e) {
          // Continue to next script
        }
      }

      if (!recipeData) {
        scraperLogger.warn('No JSON-LD recipe data found, falling back to HTML parsing');
        return this.parseFromHTML($, url);
      }

      // Extract data from JSON-LD
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
        rating: recipeData.aggregateRating?.ratingValue,
      };

      // Extract category and cuisine from keywords or category
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
    } catch (error) {
      scraperLogger.error('Error parsing AllRecipes recipe:', error);
      return null;
    }
  }

  /**
   * Fallback HTML parsing if JSON-LD is not available
   */
  private parseFromHTML($: cheerio.CheerioAPI, url: string): Partial<ScrapedRecipe> | null {
    try {
      const recipe: Partial<ScrapedRecipe> = {
        id: url,
        recipe_name: $('h1').first().text().trim() || '',
        description: $('.recipe-summary').text().trim() || '',
        instructions: $('.recipe-instructions li, .directions--section__step')
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 0),
        ingredients: $('.ingredients-item-name, .recipe-ingred_txt')
          .map((_, el) => ({
            name: '',
            original_text: $(el).text().trim(),
          }))
          .get()
          .filter(ing => ing.original_text.length > 0) as RecipeIngredient[],
        image_url: $('meta[property="og:image"]').attr('content') || undefined,
      };

      // Parse yield
      const yieldText = $('.recipe-adjust-servings__size-input').attr('value') || '';
      const yieldMatch = yieldText.match(/(\d+)/);
      if (yieldMatch) {
        recipe.yield = parseInt(yieldMatch[1], 10);
        recipe.yield_unit = 'servings';
      }

      return recipe;
    } catch (error) {
      scraperLogger.error('Error in HTML fallback parsing:', error);
      return null;
    }
  }

  /**
   * Parse instructions from JSON-LD
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
   * Parse ingredients from JSON-LD
   */
  private parseIngredients(ingredients: any[]): RecipeIngredient[] {
    if (!Array.isArray(ingredients)) return [];
    return ingredients.map(ing => ({
      name: '',
      original_text: typeof ing === 'string' ? ing : String(ing),
    }));
  }

  /**
   * Parse yield from JSON-LD
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
   * Parse duration (ISO 8601) to minutes
   */
  private parseDuration(duration: string | undefined): number | undefined {
    if (!duration) return undefined;
    // Parse ISO 8601 duration (PT30M, PT1H30M, etc.)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
      const hours = parseInt(match[1] || '0', 10);
      const minutes = parseInt(match[2] || '0', 10);
      return hours * 60 + minutes;
    }
    return undefined;
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
   * Get recipe URLs from AllRecipes
   * This is a placeholder - in production, you'd implement search/discovery
   */
  async getRecipeUrls(limit: number = 10): Promise<string[]> {
    // For now, return empty array - URLs should be provided manually
    // In production, you could implement search or category browsing
    scraperLogger.warn('AllRecipes URL discovery not implemented - provide URLs manually');
    return [];
  }
}
