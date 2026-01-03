/**
 * AllRecipes Scraper
 * Scrapes recipes from AllRecipes.com using JSON-LD structured data
 */

import * as cheerio from 'cheerio';
import { BaseScraper } from './base-scraper';
import { ScrapedRecipe, RecipeIngredient } from '../parsers/types';
import { scraperLogger } from '../utils/logger';
import { SitemapParser } from '../utils/sitemap-parser';

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
  private parseIngredients(ingredients: any[]): RecipeIngredient[] {
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
      .replace(/\s*(cup|cups|tbsp|tsp|oz|lb|g|kg|ml|l|tablespoon|teaspoon|ounce|pound|gram|kilogram|milliliter|liter)s?\s*/gi, '')
      .replace(/\s*(and|or|plus)\s*/gi, ' ')
      .trim();
    return cleaned.length > 2 ? cleaned : text;
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
   * Extract temperature from instructions text (fallback method)
   * Looks for temperature patterns in instruction text
   */
  private extractTemperatureFromInstructions(instructions: any): string | undefined {
    if (!instructions) return undefined;

    const instructionTexts: string[] = [];

    // Collect all instruction text
    if (Array.isArray(instructions)) {
      instructions.forEach(inst => {
        if (typeof inst === 'string') {
          instructionTexts.push(inst);
        } else if (inst.text) {
          instructionTexts.push(inst.text);
        } else if (inst['@type'] === 'HowToStep' && inst.text) {
          instructionTexts.push(inst.text);
        }
      });
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
      scraperLogger.info('Attempting to discover AllRecipes URLs via sitemap...');
      const sitemapParser = new SitemapParser();
      const sitemapUrls = await sitemapParser.discoverRecipeUrls('allrecipes');
      if (sitemapUrls.length > 0) {
        scraperLogger.info(`Discovered ${sitemapUrls.length} recipe URLs from sitemap`);
        return sitemapUrls;
      }
    } catch (error) {
      scraperLogger.warn('Sitemap parsing failed, falling back to pagination:', error);
    }

    // Fallback to pagination crawling
    scraperLogger.info('Falling back to pagination crawling for AllRecipes...');
    try {
      const categoryPages = [
        'https://www.allrecipes.com/recipes/',
        'https://www.allrecipes.com/recipes/76/appetizers-and-snacks/',
        'https://www.allrecipes.com/recipes/78/breakfast-and-brunch/',
        'https://www.allrecipes.com/recipes/79/desserts/',
        'https://www.allrecipes.com/recipes/156/bread/',
        'https://www.allrecipes.com/recipes/17562/lunch/',
        'https://www.allrecipes.com/recipes/17561/dinner/',
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
              // Limit pagination depth to prevent infinite loops
              if (currentPage > 100) {
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
}
