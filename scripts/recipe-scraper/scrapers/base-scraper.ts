/**
 * Base Scraper
 * Abstract base class for all recipe scrapers
 */

import axios, { AxiosInstance } from 'axios';
import { ScrapedRecipe, ScrapeResult, ScraperConfig } from '../parsers/types';
import { RateLimiter } from '../utils/rate-limiter';
import { isUrlAllowed, getCrawlDelay } from '../utils/robots-checker';
import { scraperLogger } from '../utils/logger';
import { DEFAULT_CONFIG } from '../config';
import { validateRecipe } from '../parsers/schema-validator';
import { normalizeRecipe } from '../parsers/recipe-normalizer';

export abstract class BaseScraper {
  protected config: ScraperConfig;
  protected rateLimiter: RateLimiter;
  protected httpClient: AxiosInstance;
  protected source: string;

  constructor(source: string, config: Partial<ScraperConfig> = {}) {
    this.source = source;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.rateLimiter = new RateLimiter(this.config.delayBetweenRequests);
    this.httpClient = axios.create({
      timeout: this.config.timeout,
      headers: {
        'User-Agent': this.config.userAgent,
      },
    });
  }

  /**
   * Fetch a page and return HTML content
   */
  protected async fetchPage(url: string): Promise<string> {
    // Check robots.txt if enabled
    if (this.config.respectRobotsTxt) {
      const allowed = await isUrlAllowed(url, this.config.userAgent);
      if (!allowed) {
        throw new Error(`URL disallowed by robots.txt: ${url}`);
      }

      // Get crawl delay from robots.txt
      const crawlDelay = await getCrawlDelay(url, this.config.userAgent);
      if (crawlDelay && crawlDelay > this.config.delayBetweenRequests) {
        scraperLogger.info(`Using crawl delay from robots.txt: ${crawlDelay}ms`);
        await new Promise(resolve => setTimeout(resolve, crawlDelay));
      }
    }

    // Rate limiting
    await this.rateLimiter.wait();

    // Fetch with retries
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        scraperLogger.debug(`Fetching ${url} (attempt ${attempt}/${this.config.maxRetries})`);
        const response = await this.httpClient.get(url);
        return response.data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < this.config.maxRetries) {
          const waitTime = attempt * 1000; // Exponential backoff
          scraperLogger.warn(`Request failed, retrying in ${waitTime}ms:`, lastError.message);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
    scraperLogger.error(`Failed to fetch ${url} after ${this.config.maxRetries} attempts`, {
      error: errorMessage,
      url,
    });
    throw new Error(`Failed to fetch ${url} after ${this.config.maxRetries} attempts: ${errorMessage}`);
  }

  /**
   * Parse a recipe from HTML content
   * Must be implemented by subclasses
   */
  protected abstract parseRecipe(html: string, url: string): Partial<ScrapedRecipe> | null;

  /**
   * Validate and normalize a recipe
   */
  protected validateAndNormalize(recipe: Partial<ScrapedRecipe>): ScrapedRecipe | null {
    // Normalize first
    const normalized = normalizeRecipe(recipe);

    // Validate
    const validation = validateRecipe(normalized);
    if (!validation.success || !validation.recipe) {
      scraperLogger.error(`Recipe validation failed:`, validation.error);
      return null;
    }

    return validation.recipe;
  }

  /**
   * Scrape a single recipe URL
   */
  async scrapeRecipe(url: string): Promise<ScrapeResult> {
    try {
      scraperLogger.info(`Scraping recipe from ${this.source}: ${url}`);

      // Fetch page
      const html = await this.fetchPage(url);

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
   * Get recipe URLs to scrape
   * Must be implemented by subclasses for discovery
   */
  abstract getRecipeUrls(limit?: number): Promise<string[]>;
}
