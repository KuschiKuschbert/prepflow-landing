/**
 * Smitten Kitchen Scraper
 * Scrapes recipes from Smitten Kitchen (blog format, may need custom parsing)
 */

import * as cheerio from 'cheerio';
import {
  isJSONLDRecipe,
  JSONLDImageObject,
  JSONLDRecipe,
  RecipeIngredient,
  ScrapedRecipe,
} from '../parsers/types';
import { scraperLogger } from '../utils/logger';
import { SitemapParser } from '../utils/sitemap-parser';
import { BaseScraper } from './base-scraper';

export class SmittenKitchenScraper extends BaseScraper {
  constructor(config?: Partial<import('../parsers/types').ScraperConfig>) {
    super('smitten-kitchen', config);
  }

  /**
   * Parse recipe from HTML using JSON-LD structured data (if available) or HTML parsing
   */
  protected parseRecipe(html: string, url: string): Partial<ScrapedRecipe> | null {
    try {
      const $ = cheerio.load(html);

      // Try to find JSON-LD structured data (blog may or may not have it)
      const jsonLdScripts = $('script[type="application/ld+json"]');
      let recipeData: JSONLDRecipe | null = null;

      for (let i = 0; i < jsonLdScripts.length; i++) {
        try {
          const content = $(jsonLdScripts[i]).html();
          if (content) {
            const parsed = JSON.parse(content) as unknown;
            const items = Array.isArray(parsed) ? parsed : [parsed];
            recipeData =
              (items.find((item: unknown) => isJSONLDRecipe(item)) as JSONLDRecipe | undefined) ??
              null;
            if (recipeData) break;
          }
        } catch (_e) {
          // Continue to next script
        }
      }

      if (recipeData) {
        // Extract temperature from JSON-LD or instructions
        const cookingMethod = recipeData.cookingMethod;
        const temperatureFromJSONLD =
          (typeof cookingMethod === 'object' && cookingMethod?.temperature) ||
          recipeData.temperature;
        const temperatureFromInstructions = this.extractTemperatureFromInstructions(
          recipeData.recipeInstructions || [],
        );
        const temperatureData =
          temperatureFromJSONLD ||
          (temperatureFromInstructions.temperature_celsius ||
          temperatureFromInstructions.temperature_fahrenheit
            ? temperatureFromInstructions
            : undefined);
        const parsedTemperature = this.parseTemperature(temperatureData);

        // Extract data from JSON-LD
        const recipe: Partial<ScrapedRecipe> = {
          id: recipeData.url || url,
          recipe_name: recipeData.name || recipeData.headline || '',
          description: recipeData.description || recipeData.articleBody || '',
          instructions: this.parseInstructions(recipeData.recipeInstructions || []),
          ingredients: this.parseIngredients(recipeData.recipeIngredient || []),
          yield: this.parseYield(recipeData.recipeYield),
          yield_unit: 'servings',
          prep_time_minutes: this.parseDuration(recipeData.prepTime),
          cook_time_minutes: this.parseDuration(recipeData.cookTime),
          total_time_minutes: this.parseDuration(recipeData.totalTime),
          ...(parsedTemperature.temperature_celsius || parsedTemperature.temperature_fahrenheit
            ? parsedTemperature
            : {}),
          image_url: this.parseImage(recipeData.image),
          author: this.parseAuthor(recipeData.author),
          // Smitten Kitchen is a blog, no user ratings
          rating: this.parseRating(recipeData.aggregateRating?.ratingValue),
        };

        // Extract category and cuisine
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

      // Fallback to HTML parsing (blog format)
      scraperLogger.warn('No JSON-LD recipe data found, using HTML parsing for blog format');
      return this.parseFromHTML($, url);
    } catch (error) {
      scraperLogger.error('Error parsing Smitten Kitchen recipe:', error);
      return null;
    }
  }

  /**
   * HTML parsing for blog format (Smitten Kitchen specific)
   */
  private parseFromHTML($: cheerio.CheerioAPI, url: string): Partial<ScrapedRecipe> | null {
    try {
      // Blog format - try multiple selectors
      const recipe: Partial<ScrapedRecipe> = {
        id: url,
        recipe_name: $('h1.entry-title, h1.post-title, h1').first().text().trim() || '',
        description:
          $('meta[name="description"]').attr('content') ||
          $('.entry-summary, .post-excerpt').first().text().trim() ||
          '',
        instructions: $(
          '.recipe-instructions li, .instructions li, .method li, .entry-content ol li, .entry-content ul li',
        )
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 0),
        ingredients: $(
          '.ingredients li, .recipe-ingredients li, .ingredient-list li, .entry-content ul li',
        )
          .map((_, el) => {
            const text = $(el).text().trim();
            const name = this.parseIngredientName(text);
            return {
              name: name || text,
              original_text: text,
            };
          })
          .get()
          .filter(ing => ing.original_text.length > 0),
        image_url:
          $('meta[property="og:image"]').attr('content') ||
          $('.entry-content img').first().attr('src') ||
          undefined,
      };

      return recipe;
    } catch (error) {
      scraperLogger.error('Error in HTML fallback parsing:', error);
      return null;
    }
  }

  /**
   * Parse ingredients from JSON-LD
   */
  private parseIngredients(ingredients: string[] | undefined): RecipeIngredient[] {
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
  private parseYield(yieldData: string | number | string[] | undefined): number | undefined {
    if (!yieldData) return undefined;
    if (typeof yieldData === 'number') return yieldData;
    if (typeof yieldData === 'string') {
      const match = yieldData.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    if (Array.isArray(yieldData) && yieldData.length > 0) {
      const first = yieldData[0];
      const match = first.match(/(\d+)/);
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
  private parseImage(
    image: string | string[] | JSONLDImageObject | JSONLDImageObject[] | undefined,
  ): string | undefined {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    if (Array.isArray(image) && image.length > 0) {
      const first = image[0];
      return typeof first === 'string' ? first : first.url || first.contentUrl;
    }
    if (typeof image === 'object' && 'url' in image) return image.url;
    return undefined;
  }

  /**
   * Get ALL recipe URLs (comprehensive, no limit)
   * Uses sitemap parsing first, then falls back to pagination crawling
   */
  /**
   * Get recipe URLs to scrape (limited)
   * Wrapper around getAllRecipeUrls for now
   */
  async getRecipeUrls(limit?: number): Promise<string[]> {
    const urls = await this.getAllRecipeUrls();
    return limit ? urls.slice(0, limit) : urls;
  }

  async getAllRecipeUrls(): Promise<string[]> {
    const urls: string[] = [];
    const visited = new Set<string>();

    // Try sitemap parsing first
    try {
      scraperLogger.info('Attempting to discover Smitten Kitchen URLs via sitemap...');
      const sitemapParser = new SitemapParser();
      const sitemapUrls = await sitemapParser.discoverRecipeUrls('smitten-kitchen');

      if (sitemapUrls.length > 0) {
        scraperLogger.info(`Discovered ${sitemapUrls.length} recipe URLs from sitemap`);
        return sitemapUrls;
      } else {
        scraperLogger.warn('Sitemap parsing returned 0 URLs, falling back to pagination');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Scraping stopped by user')) {
        throw error;
      }
      scraperLogger.warn('Sitemap parsing failed, falling back to pagination:', error);
    }

    // Fallback to pagination crawling (blog format: /[year]/[month]/[recipe-slug].html)
    scraperLogger.info('Falling back to pagination crawling for Smitten Kitchen...');
    try {
      const baseUrl = 'https://smittenkitchen.com';
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const paginatedUrl = currentPage === 1 ? baseUrl : `${baseUrl}/page/${currentPage}`;
        const html = await this.fetchPage(paginatedUrl);
        const $ = cheerio.load(html);

        // Extract recipe links matching blog pattern: /[year]/[month]/[recipe-slug].html
        const recipeLinks = $('a[href*="/20"]')
          .map((_, el) => {
            const href = $(el).attr('href');
            if (!href) return null;

            let normalizedUrl: string | null = null;
            if (href.startsWith('http://') || href.startsWith('https://')) {
              normalizedUrl = href;
            } else if (href.startsWith('/')) {
              normalizedUrl = `https://smittenkitchen.com${href}`;
            } else if (href.startsWith('//')) {
              normalizedUrl = `https:${href}`;
            } else {
              normalizedUrl = `https://smittenkitchen.com/${href}`;
            }

            const cleanUrl = normalizedUrl.split('?')[0].split('#')[0];
            // Match blog pattern: /YYYY/MM/recipe-slug.html or /YYYY/MM/recipe-slug/
            if (cleanUrl.match(/\/\d{4}\/\d{2}\/[^/]+(\.html)?$/)) {
              return cleanUrl;
            }
            return null;
          })
          .get()
          .filter((url): url is string => {
            if (!url) return false;
            return (
              url.includes('/20') &&
              !visited.has(url) &&
              !url.includes('/category/') &&
              !url.includes('/tag/')
            );
          });

        if (recipeLinks.length === 0) {
          hasMorePages = false;
        } else {
          for (const url of recipeLinks) {
            visited.add(url);
            urls.push(url);
          }
          scraperLogger.info(
            `Found ${recipeLinks.length} recipes on page ${currentPage} of ${paginatedUrl}`,
          );
          currentPage++;
          if (currentPage > 200) {
            scraperLogger.info(
              `Reached pagination limit (200 pages) for ${paginatedUrl}, found ${urls.length} recipes so far`,
            );
            hasMorePages = false;
          }
        }
      }
    } catch (error) {
      scraperLogger.warn('Pagination crawling failed:', error);
    }

    scraperLogger.info(`Total Smitten Kitchen URLs discovered: ${urls.length}`);
    return urls;
  }
}
