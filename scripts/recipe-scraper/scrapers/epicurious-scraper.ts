/**
 * Epicurious Scraper
 * Scrapes recipes from Epicurious.com using JSON-LD structured data
 */

import * as cheerio from 'cheerio';
import { BaseScraper } from './base-scraper';
import { ScrapedRecipe, RecipeIngredient } from '../parsers/types';
import { scraperLogger } from '../utils/logger';
import { SitemapParser } from '../utils/sitemap-parser';

export class EpicuriousScraper extends BaseScraper {
  constructor(config?: Partial<import('../parsers/types').ScraperConfig>) {
    super('epicurious', config);
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
      // First try JSON-LD temperature fields
      const temperatureFromJSONLD = recipeData.cookingMethod?.temperature || recipeData.temperature;

      // If not found in JSON-LD, extract from instructions using BaseScraper method
      const temperatureFromInstructions = this.extractTemperatureFromInstructions(
        recipeData.recipeInstructions || [],
      );

      // Use JSON-LD temperature if available, otherwise use extracted temperature
      const temperatureData =
        temperatureFromJSONLD ||
        (temperatureFromInstructions.temperature_celsius ||
        temperatureFromInstructions.temperature_fahrenheit
          ? temperatureFromInstructions
          : undefined);

      // Parse temperature data (returns object with temperature_celsius, temperature_fahrenheit, temperature_unit)
      const parsedTemperature = this.parseTemperature(temperatureData);

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
        ...(parsedTemperature.temperature_celsius || parsedTemperature.temperature_fahrenheit
          ? parsedTemperature
          : {}), // Only spread if temperature data exists
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
      scraperLogger.error('Error parsing Epicurious recipe:', error);
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
      // Use BaseScraper's parseIngredientName method for consistency
      const name = this.parseIngredientName(originalText);
      return {
        name: name || originalText, // Fallback to original text if extraction fails
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

  // parseAuthor, parseRating, parseTemperature, and extractTemperatureFromInstructions are inherited from BaseScraper (protected methods)

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
    const visited = new Set<string>();

    // Try sitemap parsing first (fastest and most complete)
    // Epicurious has 1000+ sitemaps, so we allow up to 10 minutes for complete discovery
    // This ensures we get all ~17k recipes instead of falling back to pagination (~2k recipes)
    try {
      scraperLogger.info(
        'Attempting to discover Epicurious URLs via sitemap (this may take 5-10 minutes for 1000+ sitemaps)...',
      );
      const sitemapParser = new SitemapParser();

      // Set 10-minute timeout for sitemap parsing (Epicurious needs time for 1000+ sitemaps)
      // This is much better than falling back to pagination which only finds ~2k recipes
      const sitemapPromise = sitemapParser.discoverRecipeUrls('epicurious');
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Sitemap parsing timeout (10min)')), 600000); // 10 minutes
      });

      const sitemapUrls = await Promise.race([sitemapPromise, timeoutPromise]);

      if (sitemapUrls.length > 0) {
        scraperLogger.info(`Discovered ${sitemapUrls.length} recipe URLs from sitemap`);
        return sitemapUrls;
      } else {
        scraperLogger.warn('Sitemap parsing returned 0 URLs, falling back to pagination');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('timeout')) {
        scraperLogger.warn(
          'Sitemap parsing timed out after 10 minutes, falling back to pagination (will only find ~2k recipes)',
        );
      } else if (errorMessage.includes('Scraping stopped by user')) {
        // Re-throw stop errors
        throw error;
      } else {
        scraperLogger.warn('Sitemap parsing failed, falling back to pagination:', error);
      }
    }

    // Fallback to pagination crawling
    scraperLogger.info('Falling back to pagination crawling for Epicurious...');
    try {
      const baseUrl = 'https://www.epicurious.com/recipes-menus';
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const paginatedUrl = currentPage === 1 ? baseUrl : `${baseUrl}?page=${currentPage}`;
        const html = await this.fetchPage(paginatedUrl);
        const $ = cheerio.load(html);

        // Extract recipe links matching pattern: /recipes/food/views/[recipe-slug]
        const recipeLinks = $('a[href*="/recipes/food/views/"]')
          .map((_, el) => {
            const href = $(el).attr('href');
            if (!href) return null;

            // Normalize URL: handle relative and absolute URLs
            let normalizedUrl: string | null = null;

            // Already absolute URL
            if (href.startsWith('http://') || href.startsWith('https://')) {
              normalizedUrl = href;
            }
            // Relative URL starting with /
            else if (href.startsWith('/')) {
              normalizedUrl = `https://www.epicurious.com${href}`;
            }
            // Protocol-relative URL
            else if (href.startsWith('//')) {
              normalizedUrl = `https:${href}`;
            }
            // Relative URL without leading /
            else {
              normalizedUrl = `https://www.epicurious.com/${href}`;
            }

            // Clean URL (remove query params and fragments)
            const cleanUrl = normalizedUrl.split('?')[0].split('#')[0];

            // Only include actual recipe pages (must match pattern: /recipes/food/views/[recipe-slug])
            if (cleanUrl.match(/\/recipes\/food\/views\/[^/]+$/)) {
              return cleanUrl;
            }
            return null;
          })
          .get()
          .filter((url): url is string => {
            if (!url) return false;
            return url.includes('/recipes/food/views/') && !visited.has(url);
          });

        if (recipeLinks.length === 0) {
          hasMorePages = false;
        } else {
          for (const url of recipeLinks) {
            visited.add(url);
            urls.push(url);
          }
          scraperLogger.info(
            `Found ${recipeLinks.length} recipes on page ${currentPage} of ${baseUrl}`,
          );
          currentPage++;
          // Increased pagination limit to 200 pages for maximum discovery
          // Note: Pagination only finds ~20 recipes per page, so 200 pages = ~4000 recipes
          // This is still less than sitemap parsing which finds all ~17k recipes
          // If you're seeing only ~4k recipes, the sitemap parsing likely timed out
          if (currentPage > 200) {
            scraperLogger.warn(
              `Pagination limit reached (200 pages). Found ${urls.length} recipes, but Epicurious likely has ~17k total. Consider allowing sitemap parsing more time.`,
            );
            hasMorePages = false;
          }
        }
      }

      scraperLogger.info(`Discovered ${urls.length} recipe URLs from Epicurious via pagination`);
      return urls;
    } catch (error) {
      scraperLogger.error('Error in pagination crawling for Epicurious:', error);
      return urls;
    }
  }
}
