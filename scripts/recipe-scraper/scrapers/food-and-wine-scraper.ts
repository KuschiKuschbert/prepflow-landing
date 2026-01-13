/**
 * FoodAndWine Scraper
 * Scrapes recipes from FoodAndWine.com using JSON-LD structured data
 */

import * as cheerio from 'cheerio';
import { RecipeIngredient, ScrapedRecipe } from '../parsers/types';
import { scraperLogger } from '../utils/logger';
import { SitemapParser } from '../utils/sitemap-parser';
import { BaseScraper } from './base-scraper';

export class FoodAndWineScraper extends BaseScraper {
  constructor(config?: Partial<import('../parsers/types').ScraperConfig>) {
    super('foodandwine', config);
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
        this._extractTemperatureString(recipeData.recipeInstructions || []);

      // Extract data from JSON-LD
      const recipe: Partial<ScrapedRecipe> = {
        id: recipeData.url || url,
        recipe_name: recipeData.name || recipeData.headline || 'Untitled Recipe',
        description: recipeData.description || '',
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
      scraperLogger.error('Error parsing FoodAndWine recipe:', error);
      return null;
    }
  }

  /**
   * Fallback HTML parsing if JSON-LD is not available
   */
  private parseFromHTML($: cheerio.CheerioAPI, url: string): Partial<ScrapedRecipe> | null {
    try {
      // Recipe Name
      const recipeName = $('h1.article-heading').first().text().trim() || '';

      // Description
      const description = $('.article-subheading').first().text().trim() || '';

      // Instructions
      let instructions: string[] = [];
      const instructionSelectors = [
        '.mntl-sc-block-group--OL li',
        '.recipe__steps-content li',
        '.directions ol li',
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

      // Ingredients
      let ingredients: RecipeIngredient[] = [];
      const ingredientSelectors = ['.mntl-structured-ingredients__list-item', '.ingredients-item'];

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

      // Parse yield
      const yieldText =
        $('.mntl-recipe-details__item:contains("Servings:") .mntl-recipe-details__value')
          .text()
          .trim() || $('.recipe-meta-item:contains("Yield:") .recipe-meta-item-body').text().trim();
      const yieldMatch = yieldText.match(/(\d+)/);
      if (yieldMatch) {
        recipe.yield = parseInt(yieldMatch[1], 10);
        recipe.yield_unit = 'servings';
      }

      return recipe;
    } catch (error) {
      scraperLogger.error('Error in HTML fallback parsing for FoodAndWine:', error);
      return null;
    }
  }

  /**
   * Parse ingredients from JSON-LD
   */
  private parseIngredients(ingredients: any[]): RecipeIngredient[] {
    if (!Array.isArray(ingredients)) return [];
    return ingredients.map(ing => {
      const originalText = typeof ing === 'string' ? ing : String(ing);
      const name = this.parseIngredientName(originalText);
      return {
        name: name || originalText,
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
   * Extract temperature from instructions text (fallback method)
   */
  private _extractTemperatureString(instructions: any): string | undefined {
    if (!instructions) return undefined;
    const instructionTexts: string[] = [];
    if (Array.isArray(instructions)) {
      instructions.forEach(inst => {
        if (typeof inst === 'string') instructionTexts.push(inst);
        else if (inst.text) instructionTexts.push(inst.text);
        else if (inst['@type'] === 'HowToStep' && inst.text) instructionTexts.push(inst.text);
      });
    }
    const combinedText = instructionTexts.join(' ');
    const tempPatterns = [/(\d+)\s*°?\s*F\b/i, /(\d+)\s*°?\s*C\b/i];
    for (const pattern of tempPatterns) {
      const match = combinedText.match(pattern);
      if (match) {
        const unit = pattern.source.includes('C') ? 'C' : 'F';
        return `${match[1]}°${unit}`;
      }
    }
    return undefined;
  }

  /**
   * Get recipe URLs from FoodAndWine by browsing popular pages
   */
  async getRecipeUrls(limit: number = 50): Promise<string[]> {
    const urls: string[] = [];
    const visited = new Set<string>();
    const popularPages = [
      'https://www.foodandwine.com/recipes',
      'https://www.foodandwine.com/appetizers',
      'https://www.foodandwine.com/cocktails-spirits',
      'https://www.foodandwine.com/desserts',
      'https://www.foodandwine.com/pasta-noodles',
    ];

    for (const pageUrl of popularPages) {
      if (urls.length >= limit) break;
      try {
        const html = await this.fetchPage(pageUrl);
        const $ = cheerio.load(html);
        const recipeLinks = $('a[href*="/recipes/"], a[href*="/recipe/"]')
          .map((_, el) => $(el).attr('href'))
          .get()
          .filter((url): url is string => {
            if (!url) return false;
            return (url.includes('/recipes/') || url.includes('/recipe/')) && !visited.has(url);
          });
        for (const url of recipeLinks) {
          let fullUrl = url;
          if (url.startsWith('/')) {
            fullUrl = `https://www.foodandwine.com${url}`;
          }
          if (!visited.has(fullUrl)) {
            visited.add(fullUrl);
            urls.push(fullUrl);
          }
          if (urls.length >= limit) break;
        }
      } catch (error) {
        scraperLogger.warn(`Failed to fetch ${pageUrl}:`, error);
      }
    }
    return urls;
  }

  /**
   * Get ALL recipe URLs (comprehensive, no limit)
   */
  async getAllRecipeUrls(): Promise<string[]> {
    try {
      scraperLogger.info('Attempting to discover FoodAndWine URLs via sitemap...');
      const sitemapParser = new SitemapParser();
      // FoodAndWine typically uses standard sitemaps
      const sitemapUrls = await sitemapParser.discoverRecipeUrls('foodandwine');
      if (sitemapUrls.length > 0) return sitemapUrls;
    } catch (error) {
      scraperLogger.warn('Sitemap parsing failed, falling back to pagination:', error);
    }

    // Fallback: Use getRecipeUrls with a higher limit if sitemap fails
    return this.getRecipeUrls(500);
  }
}
