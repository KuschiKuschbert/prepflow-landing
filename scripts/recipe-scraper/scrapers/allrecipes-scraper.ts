/**
 * AllRecipes Scraper
 * Scrapes recipes from AllRecipes.com using JSON-LD structured data
 */

import * as cheerio from 'cheerio';
import {
    isJSONLDRecipe,
    JSONLDHowToStep,
    JSONLDImageObject,
    JSONLDRecipe,
    RecipeIngredient,
    ScrapedRecipe,
} from '../parsers/types';
import { scraperLogger } from '../utils/logger';
import { SitemapParser } from '../utils/sitemap-parser';
import { BaseScraper } from './base-scraper';

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
      let recipeData: JSONLDRecipe | null = null;

      for (let i = 0; i < jsonLdScripts.length; i++) {
        try {
          const content = $(jsonLdScripts[i]).html();
          if (content) {
            const parsed = JSON.parse(content) as unknown;
            // Handle both single objects and arrays
            const items = Array.isArray(parsed) ? parsed : [parsed];
            recipeData = items.find((item: unknown) => isJSONLDRecipe(item)) as JSONLDRecipe | undefined ?? null;
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
      const cookingMethod = recipeData.cookingMethod;
      const temperatureData =
        (typeof cookingMethod === 'object' && cookingMethod?.temperature) ||
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
      scraperLogger.error('Error parsing AllRecipes recipe:', error);
      return null;
    }
  }

  /**
   * Fallback HTML parsing if JSON-LD is not available
   * Uses multiple selector strategies to handle AllRecipes page variations
   */
  private parseFromHTML($: cheerio.CheerioAPI, url: string): Partial<ScrapedRecipe> | null {
    try {
      // Try multiple selectors for recipe name
      const recipeName =
        $('h1.article-heading, h1.heading-content, h1').first().text().trim() || '';

      // Try multiple selectors for description
      const description =
        $('.recipe-summary, .article-subheading, [data-testid="recipe-summary"]')
          .first()
          .text()
          .trim() || '';

      // Try multiple selectors for instructions (AllRecipes uses various structures)
      // Verified 2025-01-03: .mntl-sc-block-group--OL li is the current working selector
      let instructions: string[] = [];
      const instructionSelectors = [
        '.mntl-sc-block-group--OL li', // Current AllRecipes structure (2025) - VERIFIED WORKING
        '.recipe-instructions li',
        '.directions--section__step',
        '[data-testid="recipe-instructions"] li',
        '.comp.recipe__steps-content ol li',
        '.recipe-instructions ol li',
        '.directions ol li',
        'ol.recipe-instructions li',
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
        '.mm-recipes-structured-ingredients__list-item', // Current AllRecipes structure (2025)
        '.ingredients-item-name',
        '.recipe-ingred_txt',
        '[data-testid="ingredient-item"]',
        '.mntl-structured-ingredients__list-item',
        '.comp.ingredients-list li',
        '.recipe-ingredients li',
        'ul.ingredients-section li',
        '.ingredients-section li',
      ];

      for (const selector of ingredientSelectors) {
        const found = $(selector)
          .map((_, el) => {
            const text = $(el).text().trim();
            if (text.length > 0) {
              const name = this.parseIngredientName(text);
              return {
                name: name || text, // Fallback to original_text if parsing fails
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

      // Parse yield - try multiple selectors
      const yieldSelectors = [
        '.recipe-adjust-servings__size-input',
        '[data-testid="recipe-servings"]',
        '.mntl-recipe-details__item[data-ingredient-serving]',
        '.recipe-servings',
      ];

      for (const selector of yieldSelectors) {
        const yieldText = $(selector).attr('value') || $(selector).text() || '';
        const yieldMatch = yieldText.match(/(\d+)/);
        if (yieldMatch) {
          recipe.yield = parseInt(yieldMatch[1], 10);
          recipe.yield_unit = 'servings';
          break;
        }
      }

      // Log if we couldn't find critical data
      if (instructions.length === 0 || ingredients.length === 0) {
        scraperLogger.warn(`[AllRecipes HTML Parse] Missing data for ${url}:`, {
          hasInstructions: instructions.length > 0,
          hasIngredients: ingredients.length > 0,
          instructionCount: instructions.length,
          ingredientCount: ingredients.length,
        });
      }

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
      const name = this.extractIngredientName(originalText);
      return {
        name: name || originalText,
        original_text: originalText,
      };
    });
  }

  /**
   * Extract ingredient name from ingredient text
   */
  private extractIngredientName(text: string): string {
    const cleaned = text
      .replace(/^\d+\s*/, '')
      .replace(/^\d+\/\d+\s*/, '')
      .replace(
        /\s*(cup|cups|tbsp|tsp|oz|lb|g|kg|ml|l|tablespoon|teaspoon|ounce|pound|gram|kilogram|milliliter|liter)s?\s*/gi,
        '',
      )
      .replace(/\s*(and|or|plus)\s*/gi, ' ')
      .trim();
    return cleaned.length > 2 ? cleaned : text;
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
  private parseImage(image: string | string[] | JSONLDImageObject | JSONLDImageObject[] | undefined): string | undefined {
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
   * Extract temperature from instructions text (fallback method)
   * Looks for temperature patterns in instruction text
   */
  private _extractTemperatureString(instructions: string | string[] | JSONLDHowToStep | JSONLDHowToStep[] | undefined): string | undefined {
    if (!instructions) return undefined;

    const instructionTexts: string[] = [];

    // Collect all instruction text
    if (typeof instructions === 'string') {
      instructionTexts.push(instructions);
    } else if (Array.isArray(instructions)) {
      instructions.forEach(inst => {
        if (typeof inst === 'string') {
          instructionTexts.push(inst);
        } else if (typeof inst === 'object' && 'text' in inst && inst.text) {
          instructionTexts.push(inst.text);
        }
      });
    } else if (typeof instructions === 'object' && 'text' in instructions && instructions.text) {
      instructionTexts.push(instructions.text);
    }

    // Search for temperature patterns in instruction text
    const combinedText = instructionTexts.join(' ');
    const tempPatterns = [
      /(\d+)\s*°?\s*F\b/i, // Fahrenheit
      /(\d+)\s*°?\s*C\b/i, // Celsius
      /bake.*?(\d+)\s*°?\s*F/i, // "bake at 350°F"
      /bake.*?(\d+)\s*°?\s*C/i, // "bake at 180°C"
      /preheat.*?(\d+)\s*°?\s*F/i, // "preheat to 350°F"
      /preheat.*?(\d+)\s*°?\s*C/i, // "preheat to 180°C"
    ];

    for (const pattern of tempPatterns) {
      const match = combinedText.match(pattern);
      if (match) {
        const unit = pattern.source.includes('C') ? 'C' : 'F';
        return `${match[1]}°${unit}`;
      }
    }

    return undefined;
  }

  // parseAuthor, parseRating, and parseTemperature are inherited from BaseScraper (protected methods)

  /**
   * Get recipe URLs from AllRecipes by browsing popular/trending pages
   */
  async getRecipeUrls(limit: number = 50): Promise<string[]> {
    const urls: string[] = [];
    const visited = new Set<string>();

    try {
      // Browse popular recipes pages
      const popularPages = [
        'https://www.allrecipes.com/recipes/',
        'https://www.allrecipes.com/recipes/76/appetizers-and-snacks/',
        'https://www.allrecipes.com/recipes/78/breakfast-and-brunch/',
        'https://www.allrecipes.com/recipes/79/desserts/',
        'https://www.allrecipes.com/recipes/156/bread/',
        'https://www.allrecipes.com/recipes/17562/lunch/',
        'https://www.allrecipes.com/recipes/17561/dinner/',
      ];

      for (const pageUrl of popularPages) {
        if (urls.length >= limit) break;

        try {
          const html = await this.fetchPage(pageUrl);
          const $ = cheerio.load(html);

          // Extract recipe links - AllRecipes uses various selectors
          const recipeLinks = $('a[href*="/recipe/"]')
            .map((_, el) => {
              const href = $(el).attr('href');
              if (!href) return null;
              // Convert relative URLs to absolute
              if (href.startsWith('/')) {
                return `https://www.allrecipes.com${href}`;
              }
              if (href.includes('allrecipes.com/recipe/')) {
                return href.split('?')[0]; // Remove query params
              }
              return null;
            })
            .get()
            .filter((url): url is string => {
              if (!url) return false;
              // Filter to actual recipe pages (not category pages)
              return url.includes('/recipe/') && !visited.has(url);
            });

          for (const url of recipeLinks) {
            if (urls.length >= limit) break;
            visited.add(url);
            urls.push(url);
          }

          scraperLogger.info(`Found ${recipeLinks.length} recipes on ${pageUrl}`);
        } catch (error) {
          scraperLogger.warn(`Failed to fetch ${pageUrl}:`, error);
        }
      }

      scraperLogger.info(`Discovered ${urls.length} recipe URLs from AllRecipes`);
      return urls;
    } catch (error) {
      scraperLogger.error('Error discovering AllRecipes URLs:', error);
      return urls; // Return what we found so far
    }
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
        'Attempting to discover AllRecipes URLs via sitemap (this may take a few minutes)...',
      );
      const sitemapParser = new SitemapParser();

      // Set 5-minute timeout for sitemap parsing (AllRecipes has many sitemaps)
      const sitemapPromise = sitemapParser.discoverRecipeUrls('allrecipes');
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
    scraperLogger.info('Falling back to pagination crawling for AllRecipes...');
    try {
      // Comprehensive category list for maximum recipe discovery
      const categoryPages = [
        'https://www.allrecipes.com/recipes/',
        'https://www.allrecipes.com/recipes/76/appetizers-and-snacks/',
        'https://www.allrecipes.com/recipes/78/breakfast-and-brunch/',
        'https://www.allrecipes.com/recipes/79/desserts/',
        'https://www.allrecipes.com/recipes/156/bread/',
        'https://www.allrecipes.com/recipes/17562/lunch/',
        'https://www.allrecipes.com/recipes/17561/dinner/',
        'https://www.allrecipes.com/recipes/17560/side-dishes/',
        'https://www.allrecipes.com/recipes/17559/salads/',
        'https://www.allrecipes.com/recipes/17558/soups-stews-and-chili/',
        'https://www.allrecipes.com/recipes/17557/main-dishes/',
        'https://www.allrecipes.com/recipes/17556/drinks/',
        'https://www.allrecipes.com/recipes/17555/healthy-recipes/',
        'https://www.allrecipes.com/recipes/17554/world-cuisine/',
        'https://www.allrecipes.com/recipes/17553/ingredients/',
      ];

      for (const pageUrl of categoryPages) {
        try {
          let currentPage = 1;
          let hasMorePages = true;

          while (hasMorePages) {
            const paginatedUrl = currentPage === 1 ? pageUrl : `${pageUrl}?page=${currentPage}`;
            const html = await this.fetchPage(paginatedUrl);
            const $ = cheerio.load(html);

            // Extract recipe links
            const recipeLinks = $('a[href*="/recipe/"]')
              .map((_, el) => {
                const href = $(el).attr('href');
                if (!href) return null;
                if (href.startsWith('/')) {
                  return `https://www.allrecipes.com${href}`;
                }
                if (href.includes('allrecipes.com/recipe/')) {
                  return href.split('?')[0];
                }
                return null;
              })
              .get()
              .filter((url): url is string => {
                if (!url) return false;
                return url.includes('/recipe/') && !visited.has(url);
              });

            if (recipeLinks.length === 0) {
              hasMorePages = false;
            } else {
              for (const url of recipeLinks) {
                visited.add(url);
                urls.push(url);
              }
              scraperLogger.info(
                `Found ${recipeLinks.length} recipes on page ${currentPage} of ${pageUrl}`,
              );
              currentPage++;
              // Increased pagination limit to 200 pages per category for maximum discovery
              // AllRecipes has thousands of recipes, so we need to go deeper
              if (currentPage > 200) {
                scraperLogger.info(
                  `Reached pagination limit (200 pages) for ${pageUrl}, found ${urls.length} recipes so far`,
                );
                hasMorePages = false;
              }
            }
          }
        } catch (error) {
          scraperLogger.warn(`Failed to fetch ${pageUrl}:`, error);
        }
      }

      scraperLogger.info(`Discovered ${urls.length} recipe URLs from AllRecipes via pagination`);
      return urls;
    } catch (error) {
      scraperLogger.error('Error in pagination crawling for AllRecipes:', error);
      return urls;
    }
  }

  /**
   * Get ALL recipe URLs with ratings from listing pages (optimized pre-filtering)
   * Extracts ratings from recipe cards on listing pages to filter before full scrape.
   * This can reduce scraping time by ~90% for sites with many low-rated recipes.
   */
  async getAllRecipeUrlsWithRatings(): Promise<import('../parsers/types').RecipeUrlWithRating[]> {
    const urlsWithRatings: import('../parsers/types').RecipeUrlWithRating[] = [];
    const visited = new Set<string>();

    scraperLogger.info('[AllRecipes] Starting optimized URL discovery with rating extraction...');

    // Crawl popular category pages that show ratings on cards
    const categoryUrls = [
      'https://www.allrecipes.com/recipes/',
      'https://www.allrecipes.com/recipes/76/appetizers-and-snacks/',
      'https://www.allrecipes.com/recipes/156/bread/',
      'https://www.allrecipes.com/recipes/78/breakfast-and-brunch/',
      'https://www.allrecipes.com/recipes/79/desserts/',
      'https://www.allrecipes.com/recipes/17562/dinner/',
    ];

    for (const categoryUrl of categoryUrls) {
      try {
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages && currentPage <= 20) {
          // Limit pages per category for speed
          const pageUrl = currentPage === 1 ? categoryUrl : `${categoryUrl}?page=${currentPage}`;
          const html = await this.fetchPage(pageUrl);
          const $ = cheerio.load(html);

          // Find recipe cards - AllRecipes uses various card structures
          const cards = $('a[href*="/recipe/"]').closest('.card, .mntl-card, [class*="card"]');

          if (cards.length === 0) {
            hasMorePages = false;
            continue;
          }

          cards.each((_, card) => {
            const $card = $(card);
            const link =
              $card.find('a[href*="/recipe/"]').first().attr('href') || $card.attr('href');

            if (!link || visited.has(link)) return;

            // Extract rating from card (AllRecipes shows stars/rating on cards)
            let rating: number | undefined;
            let ratingCount: number | undefined;

            // Try multiple selectors for rating
            const ratingSelectors = [
              '.mntl-recipe-card-meta__rating-count-number',
              '.rating-star-text',
              '[class*="rating"]',
              '[data-rating]',
              '.star-rating',
            ];

            for (const selector of ratingSelectors) {
              const ratingEl = $card.find(selector).first();
              if (ratingEl.length) {
                // Try data-rating attribute first
                const dataRating = ratingEl.attr('data-rating');
                if (dataRating) {
                  rating = parseFloat(dataRating);
                  break;
                }

                // Try text content
                const ratingText = ratingEl.text().trim();
                const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
                if (ratingMatch) {
                  rating = parseFloat(ratingMatch[1]);
                  break;
                }
              }
            }

            // Try to get rating count
            const countEl = $card
              .find('.mntl-recipe-card-meta__rating-count-number, [class*="count"]')
              .first();
            if (countEl.length) {
              const countText = countEl.text().replace(/[,\s]/g, '');
              const countMatch = countText.match(/(\d+)/);
              if (countMatch) {
                ratingCount = parseInt(countMatch[1], 10);
              }
            }

            // Normalize URL
            let normalizedUrl = link;
            if (!link.startsWith('http')) {
              normalizedUrl = `https://www.allrecipes.com${link.startsWith('/') ? '' : '/'}${link}`;
            }
            normalizedUrl = normalizedUrl.split('?')[0].split('#')[0];

            if (normalizedUrl.includes('/recipe/') && !visited.has(normalizedUrl)) {
              visited.add(normalizedUrl);
              urlsWithRatings.push({
                url: normalizedUrl,
                rating,
                ratingCount,
              });
            }
          });

          scraperLogger.debug(
            `[AllRecipes] Page ${currentPage} of ${categoryUrl}: found ${urlsWithRatings.length} URLs with ratings`,
          );
          currentPage++;
        }
      } catch (error) {
        scraperLogger.warn(`[AllRecipes] Failed to fetch category ${categoryUrl}:`, error);
      }
    }

    // Log summary
    const withRatings = urlsWithRatings.filter(u => u.rating !== undefined).length;
    scraperLogger.info(
      `[AllRecipes] Discovered ${urlsWithRatings.length} URLs (${withRatings} with ratings)`,
    );

    return urlsWithRatings;
  }
}
