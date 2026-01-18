/**
 * Tasty Scraper
 * Scrapes recipes from Tasty.co using JSON-LD structured data
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
      let recipeData: JSONLDRecipe | null = null;

      for (let i = 0; i < jsonLdScripts.length; i++) {
        try {
          const content = $(jsonLdScripts[i]).html();
          if (content) {
            const parsed = JSON.parse(content) as unknown;
            // Handle both single objects and arrays
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

      if (!recipeData) {
        scraperLogger.warn('No JSON-LD recipe data found, falling back to HTML parsing');
        return this.parseFromHTML($, url);
      }

      // Extract temperature from JSON-LD (check multiple possible locations)
      const cookingMethod = recipeData.cookingMethod;
      const temperatureData =
        (typeof cookingMethod === 'object' && cookingMethod?.temperature) ||
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
  private parseIngredients(ingredients: string[] | undefined): RecipeIngredient[] {
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
    const visited = new Set<string>();

    // Try sitemap parsing first (fastest and most complete)
    try {
      scraperLogger.info(
        'Attempting to discover Tasty URLs via sitemap (this may take a few minutes)...',
      );
      const sitemapParser = new SitemapParser();

      // Set 5-minute timeout for sitemap parsing
      const sitemapPromise = sitemapParser.discoverRecipeUrls('tasty');
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Sitemap parsing timeout (5min)')), 300000); // 5 minutes
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
        scraperLogger.warn('Sitemap parsing timed out after 5 minutes, falling back to pagination');
      } else if (errorMessage.includes('Scraping stopped by user')) {
        // Re-throw stop errors
        throw error;
      } else {
        scraperLogger.warn('Sitemap parsing failed, falling back to pagination:', error);
      }
    }

    // Fallback to pagination crawling
    scraperLogger.info('Falling back to pagination crawling for Tasty...');
    try {
      const baseUrl = 'https://tasty.co/recipe';
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        // Tasty uses different pagination patterns - try multiple approaches
        const paginatedUrls = [
          currentPage === 1 ? baseUrl : `${baseUrl}?page=${currentPage}`,
          currentPage === 1
            ? 'https://tasty.co/recipes'
            : `https://tasty.co/recipes?page=${currentPage}`,
        ];

        let foundAny = false;

        for (const paginatedUrl of paginatedUrls) {
          try {
            const html = await this.fetchPage(paginatedUrl);
            const $ = cheerio.load(html);

            // Extract recipe links matching pattern: /recipe/[recipe-slug]
            const recipeLinks = $('a[href*="/recipe/"]')
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
                  normalizedUrl = `https://tasty.co${href}`;
                }
                // Protocol-relative URL
                else if (href.startsWith('//')) {
                  normalizedUrl = `https:${href}`;
                }
                // Relative URL without leading /
                else {
                  normalizedUrl = `https://tasty.co/${href}`;
                }

                // Clean URL (remove query params and fragments)
                const cleanUrl = normalizedUrl.split('?')[0].split('#')[0];

                // Only include actual recipe pages (must match pattern: /recipe/[recipe-slug])
                if (cleanUrl.match(/\/recipe\/[^/]+$/)) {
                  return cleanUrl;
                }
                return null;
              })
              .get()
              .filter((url): url is string => {
                if (!url) return false;
                return url.includes('/recipe/') && !visited.has(url);
              });

            if (recipeLinks.length > 0) {
              foundAny = true;
              for (const url of recipeLinks) {
                visited.add(url);
                urls.push(url);
              }
              scraperLogger.info(
                `Found ${recipeLinks.length} recipes on page ${currentPage} of ${paginatedUrl}`,
              );
            }
          } catch (error) {
            scraperLogger.warn(`Failed to fetch ${paginatedUrl}:`, error);
          }
        }

        if (!foundAny) {
          hasMorePages = false;
        } else {
          currentPage++;
          // Limit pagination depth to prevent infinite loops
          // Tasty has many recipes, so we allow up to 200 pages
          if (currentPage > 200) {
            scraperLogger.info(
              `Reached pagination limit (200 pages) for Tasty, found ${urls.length} recipes so far`,
            );
            hasMorePages = false;
          }
        }
      }

      scraperLogger.info(`Discovered ${urls.length} recipe URLs from Tasty via pagination`);
      return urls;
    } catch (error) {
      scraperLogger.error('Error in pagination crawling for Tasty:', error);
      return urls;
    }
  }

  /**
   * Get ALL recipe URLs with ratings from listing pages (optimized pre-filtering)
   * Tasty uses percentage ratings (0-100) displayed on recipe cards.
   */
  async getAllRecipeUrlsWithRatings(): Promise<import('../parsers/types').RecipeUrlWithRating[]> {
    const urlsWithRatings: import('../parsers/types').RecipeUrlWithRating[] = [];
    const visited = new Set<string>();

    scraperLogger.info('[Tasty] Starting optimized URL discovery with rating extraction...');

    // Crawl category pages
    const categoryUrls = [
      'https://tasty.co/recipes',
      'https://tasty.co/topic/quick-and-easy',
      'https://tasty.co/topic/dinner',
      'https://tasty.co/topic/healthy',
      'https://tasty.co/topic/desserts',
    ];

    for (const categoryUrl of categoryUrls) {
      try {
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages && currentPage <= 10) {
          const pageUrl = currentPage === 1 ? categoryUrl : `${categoryUrl}?page=${currentPage}`;
          const html = await this.fetchPage(pageUrl);
          const $ = cheerio.load(html);

          const cards = $('a[href*="/recipe/"]').closest(
            '[class*="feed-item"], [class*="card"], article',
          );

          if (cards.length === 0) {
            hasMorePages = false;
            continue;
          }

          cards.each((_, card) => {
            const $card = $(card);
            const link =
              $card.find('a[href*="/recipe/"]').first().attr('href') || $card.attr('href');

            if (!link) return;

            let normalizedUrl = link;
            if (!link.startsWith('http')) {
              normalizedUrl = `https://tasty.co${link.startsWith('/') ? '' : '/'}${link}`;
            }
            normalizedUrl = normalizedUrl.split('?')[0].split('#')[0];

            if (!normalizedUrl.includes('/recipe/') || visited.has(normalizedUrl)) return;

            // Extract percentage rating (Tasty shows "86%" format)
            let rating: number | undefined;

            const ratingEl = $card
              .find('[class*="rating"], [class*="score"], [class*="percent"]')
              .first();
            if (ratingEl.length) {
              const ratingText = ratingEl.text().trim();
              const percentMatch = ratingText.match(/(\d+)%/);
              if (percentMatch) {
                // Convert percentage (0-100) to star rating (0-5) for consistency
                const percent = parseInt(percentMatch[1], 10);
                rating = (percent / 100) * 5; // 97.5% → 4.875
              }
            }

            visited.add(normalizedUrl);
            urlsWithRatings.push({
              url: normalizedUrl,
              rating,
            });
          });

          scraperLogger.debug(`[Tasty] Page ${currentPage}: found ${urlsWithRatings.length} URLs`);
          currentPage++;
        }
      } catch (error) {
        scraperLogger.warn(`[Tasty] Failed to fetch category ${categoryUrl}:`, error);
      }
    }

    const withRatings = urlsWithRatings.filter(u => u.rating !== undefined).length;
    scraperLogger.info(
      `[Tasty] Discovered ${urlsWithRatings.length} URLs (${withRatings} with ratings)`,
    );

    return urlsWithRatings;
  }
}
