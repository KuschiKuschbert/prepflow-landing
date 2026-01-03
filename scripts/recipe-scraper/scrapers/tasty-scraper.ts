/**
 * Tasty Scraper
 * Scrapes recipes from Tasty.co using JSON-LD structured data
 */

import * as cheerio from 'cheerio';
import { BaseScraper } from './base-scraper';
import { ScrapedRecipe, RecipeIngredient } from '../parsers/types';
import { scraperLogger } from '../utils/logger';
import { SitemapParser } from '../utils/sitemap-parser';

export class TastyScraper extends BaseScraper {
  constructor(config?: Partial<import('../parsers/types').ScraperConfig>) {
    super('tasty', config);
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
            recipeData = items.find((item: any) => {
              // Handle @type as both string and array (e.g., ["Recipe", "NewsArticle"])
              const type = item['@type'];
              if (typeof type === 'string') {
                return type === 'Recipe';
              }
              if (Array.isArray(type)) {
                return type.includes('Recipe');
              }
              return false;
            });
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

      // Extract temperature from JSON-LD (check multiple possible locations)
      const temperatureData =
        recipeData.cookingMethod?.temperature ||
        recipeData.temperature ||
        this.extractTemperatureFromInstructions(recipeData.recipeInstructions || []);

      // Extract data from JSON-LD
      const recipe: Partial<ScrapedRecipe> = {
        id: recipeData.url || url,
        recipe_name: recipeData.name || recipeData.headline || '',
        description: recipeData.description || recipeData.articleBody || '',
        instructions: this.parseInstructions(recipeData.recipeInstructions || []), // Uses BaseScraper.parseInstructions
        ingredients: this.parseIngredients(recipeData.recipeIngredient || []),
        yield: this.parseYield(recipeData.recipeYield),
        yield_unit: 'servings',
        prep_time_minutes: this.parseDuration(recipeData.prepTime),
        cook_time_minutes: this.parseDuration(recipeData.cookTime),
        total_time_minutes: this.parseDuration(recipeData.totalTime),
        ...this.parseTemperature(temperatureData), // Spread temperature fields
        image_url: this.parseImage(recipeData.image),
        author: this.parseAuthor(recipeData.author),
        rating: this.parseRating(recipeData.aggregateRating?.ratingValue),
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
      scraperLogger.error('Error parsing Tasty recipe:', error);
      return null;
    }
  }

  /**
   * Fallback HTML parsing if JSON-LD is not available
   */
  private parseFromHTML($: cheerio.CheerioAPI, url: string): Partial<ScrapedRecipe> | null {
    try {
      // Try multiple selectors for recipe name
      const recipeName =
        $('h1.recipe-title, h1.recipe-header__title, h1').first().text().trim() || '';

      // Try multiple selectors for description
      const description =
        $('meta[name="description"]').attr('content') ||
        $('.recipe-description, .recipe-summary').first().text().trim() ||
        '';

      // Try multiple selectors for instructions
      let instructions: string[] = [];
      const instructionSelectors = [
        '.recipe-instructions li',
        '.instructions li',
        '.preparation li',
        '.method li',
        '.directions li',
        '.steps li',
        '[data-testid="recipe-instructions"] li',
        'ol.recipe-instructions li',
        'ol.instructions li',
      ];

      for (const selector of instructionSelectors) {
        const found = $(selector)
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 0);
        if (found.length > 0) {
          instructions = found;
          break;
        }
      }

      // Try multiple selectors for ingredients
      let ingredients: RecipeIngredient[] = [];
      const ingredientSelectors = [
        '.ingredients li',
        '.recipe-ingredients li',
        '.ingredient-list li',
        '[data-testid="ingredient-item"]',
        'ul.ingredients li',
        'ul.recipe-ingredients li',
      ];

      for (const selector of ingredientSelectors) {
        const found = $(selector)
          .map((_, el) => {
            const text = $(el).text().trim();
            if (text.length > 0) {
              const name = this.parseIngredientName(text);
              return {
                name: name || text,
                original_text: text,
              };
            }
            return null;
          })
          .get()
          .filter((ing): ing is RecipeIngredient => ing !== null);
        if (found.length > 0) {
          ingredients = found;
          break;
        }
      }

      const recipe: Partial<ScrapedRecipe> = {
        id: url,
        recipe_name: recipeName,
        description,
        instructions,
        ingredients,
        image_url: $('meta[property="og:image"]').attr('content') || undefined,
      };

      return recipe;
    } catch (error) {
      scraperLogger.error('Error in HTML fallback parsing:', error);
      return null;
    }
  }

  // parseInstructions is now inherited from BaseScraper (handles all JSON-LD formats)

  /**
   * Parse ingredients from JSON-LD
   */
  private parseIngredients(ingredients: any[]): RecipeIngredient[] {
    if (!Array.isArray(ingredients)) return [];
    return ingredients.map(ing => {
      const originalText = typeof ing === 'string' ? ing : String(ing);
      return {
        name: this.parseIngredientName(originalText),
        original_text: originalText,
      };
    });
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

  // parseAuthor and parseRating are inherited from BaseScraper (protected methods)

  /**
   * Get recipe URLs to scrape (limited)
   */
  async getRecipeUrls(limit: number = 50): Promise<string[]> {
    const allUrls = await this.getAllRecipeUrls();
    return allUrls.slice(0, limit);
  }

  /**
   * Get ALL recipe URLs (comprehensive, no limit)
   * Uses sitemap parsing first, then falls back to pagination crawling
   */
  async getAllRecipeUrls(): Promise<string[]> {
    const urls: string[] = [];

    // Try sitemap parsing first (fastest and most complete)
    try {
      scraperLogger.info('Attempting to discover Tasty URLs via sitemap...');
      const sitemapParser = new SitemapParser();
      const sitemapUrls = await sitemapParser.discoverRecipeUrls('tasty');
      if (sitemapUrls.length > 0) {
        scraperLogger.info(`Discovered ${sitemapUrls.length} recipe URLs from sitemap`);
        return sitemapUrls;
      }
    } catch (error) {
      scraperLogger.warn('Sitemap parsing failed for Tasty:', error);
    }

    scraperLogger.warn('Tasty sitemap parsing not available, manual URL discovery needed');
    return urls;
  }
}
