/**
 * Food Network Scraper
 * Scrapes recipes from Food Network (may require Puppeteer for JS-heavy pages)
 */

import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { BaseScraper } from './base-scraper';
import { ScrapedRecipe, RecipeIngredient } from '../parsers/types';
import { scraperLogger } from '../utils/logger';
import { SitemapParser } from '../utils/sitemap-parser';

export class FoodNetworkScraper extends BaseScraper {
  private usePuppeteer: boolean = true;

  constructor(config?: Partial<import('../parsers/types').ScraperConfig>) {
    super('food-network', config);
    // Check if Puppeteer is available
    this.usePuppeteer = typeof puppeteer !== 'undefined';
  }

  /**
   * Fetch page with Puppeteer if needed, otherwise use base method
   */
  protected async fetchPageWithPuppeteer(url: string): Promise<string> {
    if (!this.usePuppeteer) {
      return this.fetchPage(url);
    }

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setUserAgent(this.config.userAgent);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const html = await page.content();
      await browser.close();
      return html;
    } catch (error) {
      scraperLogger.warn('Puppeteer fetch failed, falling back to regular fetch:', error);
      return this.fetchPage(url);
    }
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
      scraperLogger.error('Error parsing Food Network recipe:', error);
      return null;
    }
  }

  /**
   * Override scrapeRecipe to use Puppeteer if needed
   */
  async scrapeRecipe(url: string): Promise<import('../parsers/types').ScrapeResult> {
    try {
      scraperLogger.info(`Scraping recipe from ${this.source}: ${url}`);

      // Check robots.txt
      if (this.config.respectRobotsTxt) {
        const { isUrlAllowed } = await import('../utils/robots-checker');
        const allowed = await isUrlAllowed(url, this.config.userAgent);
        if (!allowed) {
          return {
            success: false,
            error: 'URL disallowed by robots.txt',
            source: this.source,
            url,
          };
        }
      }

      // Fetch with Puppeteer if enabled
      const html = this.usePuppeteer
        ? await this.fetchPageWithPuppeteer(url)
        : await this.fetchPage(url);

      // Parse recipe
      const parsed = this.parseRecipe(html, url);
      if (!parsed) {
        return {
          success: false,
          error: 'Failed to parse recipe',
          source: this.source,
          url,
        };
      }

      // Add source metadata
      parsed.source = this.source;
      parsed.source_url = url;
      parsed.scraped_at = new Date().toISOString();

      // Validate and normalize
      const recipe = this.validateAndNormalize(parsed);
      if (!recipe) {
        return {
          success: false,
          error: 'Recipe validation failed',
          source: this.source,
          url,
        };
      }

      scraperLogger.info(`Successfully scraped recipe: ${recipe.recipe_name}`);
      return {
        success: true,
        recipe,
        source: this.source,
        url,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      scraperLogger.error(`Error scraping recipe from ${url}:`, errorMessage);
      return {
        success: false,
        error: errorMessage,
        source: this.source,
        url,
      };
    }
  }

  /**
   * Parse from JSON-LD
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
   * Parse from HTML
   */
  private parseFromHTML($: cheerio.CheerioAPI, url: string): Partial<ScrapedRecipe> | null {
    try {
      const recipe: Partial<ScrapedRecipe> = {
        id: url,
        recipe_name: $('h1.o-AssetTitle__a-Headline, h1').first().text().trim() || '',
        description:
          $('.o-AssetDescription__a-Description, .recipe-description').text().trim() || '',
        instructions: $('.o-Method__m-Step, .recipe-instructions li')
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 0),
        ingredients: $('.o-Ingredients__a-ListItem, .recipe-ingredients li')
          .map((_, el) => ({
            name: '',
            original_text: $(el).text().trim(),
          }))
          .get()
          .filter(ing => ing.original_text.length > 0) as RecipeIngredient[],
        image_url: $('meta[property="og:image"]').attr('content') || undefined,
      };

      // Parse yield
      const yieldText = $('.o-RecipeInfo__a-Serving, .recipe-servings').text() || '';
      const yieldMatch = yieldText.match(/(\d+)/);
      if (yieldMatch) {
        recipe.yield = parseInt(yieldMatch[1], 10);
        recipe.yield_unit = 'servings';
      }

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
   * Parse duration
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
   * Parse image
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
   * Get recipe URLs from Food Network by browsing categories
   */
  async getRecipeUrls(limit: number = 50): Promise<string[]> {
    const urls: string[] = [];
    const visited = new Set<string>();

    try {
      // Browse popular recipe categories
      const categoryPages = [
        'https://www.foodnetwork.com/recipes',
        'https://www.foodnetwork.com/recipes/photos/easy-recipes',
        'https://www.foodnetwork.com/recipes/photos/quick-recipes',
        'https://www.foodnetwork.com/recipes/photos/dinner-recipes',
        'https://www.foodnetwork.com/recipes/photos/healthy-recipes',
        'https://www.foodnetwork.com/recipes/photos/dessert-recipes',
      ];

      for (const pageUrl of categoryPages) {
        if (urls.length >= limit) break;

        try {
          // Use Puppeteer for Food Network as it's JS-heavy
          const html = this.usePuppeteer
            ? await this.fetchPageWithPuppeteer(pageUrl)
            : await this.fetchPage(pageUrl);
          const $ = cheerio.load(html);

          // Extract recipe links
          const recipeLinks = $('a[href*="/recipes/"]')
            .map((_, el) => {
              const href = $(el).attr('href');
              if (!href) return null;
              // Convert relative URLs to absolute
              if (href.startsWith('/')) {
                return `https://www.foodnetwork.com${href}`;
              }
              if (href.includes('foodnetwork.com/recipes/')) {
                const cleanUrl = href.split('?')[0].split('#')[0];
                // Only include actual recipe pages
                if (cleanUrl.match(/\/recipes\/[^/]+$/)) {
                  return cleanUrl;
                }
              }
              return null;
            })
            .get()
            .filter((url): url is string => {
              if (!url) return false;
              return url.includes('/recipes/') && !visited.has(url) && !url.includes('/photos/');
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

      scraperLogger.info(`Discovered ${urls.length} recipe URLs from Food Network`);
      return urls;
    } catch (error) {
      scraperLogger.error('Error discovering Food Network URLs:', error);
      return urls;
    }
  }

  /**
   * Get ALL recipe URLs (comprehensive, no limit)
   * Uses sitemap parsing first, then falls back to pagination crawling
   */
  async getAllRecipeUrls(): Promise<string[]> {
    const urls: string[] = [];
    const visited = new Set<string>();

    // Try sitemap parsing first
    try {
      scraperLogger.info('Attempting to discover Food Network URLs via sitemap...');
      const sitemapParser = new SitemapParser();
      const sitemapUrls = await sitemapParser.discoverRecipeUrls('food-network');
      if (sitemapUrls.length > 0) {
        scraperLogger.info(`Discovered ${sitemapUrls.length} recipe URLs from sitemap`);
        return sitemapUrls;
      }
    } catch (error) {
      scraperLogger.warn('Sitemap parsing failed, falling back to pagination:', error);
    }

    // Fallback to pagination crawling
    scraperLogger.info('Falling back to pagination crawling for Food Network...');
    try {
      const categoryPages = [
        'https://www.foodnetwork.com/recipes',
        'https://www.foodnetwork.com/recipes/photos/easy-recipes',
        'https://www.foodnetwork.com/recipes/photos/quick-recipes',
        'https://www.foodnetwork.com/recipes/photos/dinner-recipes',
        'https://www.foodnetwork.com/recipes/photos/healthy-recipes',
        'https://www.foodnetwork.com/recipes/photos/dessert-recipes',
      ];

      for (const pageUrl of categoryPages) {
        try {
          let currentPage = 1;
          let hasMorePages = true;

          while (hasMorePages) {
            const paginatedUrl = currentPage === 1 ? pageUrl : `${pageUrl}?page=${currentPage}`;
            const html = this.usePuppeteer
              ? await this.fetchPageWithPuppeteer(paginatedUrl)
              : await this.fetchPage(paginatedUrl);
            const $ = cheerio.load(html);

            // Extract recipe links
            const recipeLinks = $('a[href*="/recipes/"]')
              .map((_, el) => {
                const href = $(el).attr('href');
                if (!href) return null;
                if (href.startsWith('/')) {
                  return `https://www.foodnetwork.com${href}`;
                }
                if (href.includes('foodnetwork.com/recipes/')) {
                  const cleanUrl = href.split('?')[0].split('#')[0];
                  if (cleanUrl.match(/\/recipes\/[^/]+$/)) {
                    return cleanUrl;
                  }
                }
                return null;
              })
              .get()
              .filter((url): url is string => {
                if (!url) return false;
                return url.includes('/recipes/') && !visited.has(url) && !url.includes('/photos/');
              });

            if (recipeLinks.length === 0) {
              hasMorePages = false;
            } else {
              for (const url of recipeLinks) {
                visited.add(url);
                urls.push(url);
              }
              scraperLogger.info(`Found ${recipeLinks.length} recipes on page ${currentPage} of ${pageUrl}`);
              currentPage++;
              if (currentPage > 100) {
                hasMorePages = false;
              }
            }
          }
        } catch (error) {
          scraperLogger.warn(`Failed to fetch ${pageUrl}:`, error);
        }
      }

      scraperLogger.info(`Discovered ${urls.length} recipe URLs from Food Network via pagination`);
      return urls;
    } catch (error) {
      scraperLogger.error('Error in pagination crawling for Food Network:', error);
      return urls;
    }
  }
}
