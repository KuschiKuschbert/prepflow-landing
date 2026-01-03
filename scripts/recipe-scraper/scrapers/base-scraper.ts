/**
 * Base Scraper
 * Abstract base class for all recipe scrapers
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ScrapedRecipe, ScrapeResult, ScraperConfig } from '../parsers/types';
import { RateLimiter } from '../utils/rate-limiter';
import { isUrlAllowed, getCrawlDelay } from '../utils/robots-checker';
import { scraperLogger } from '../utils/logger';
import { DEFAULT_CONFIG } from '../config';
import { validateRecipe } from '../parsers/schema-validator';
import { normalizeRecipe } from '../parsers/recipe-normalizer';
import {
  categorizeError,
  getRetryDelay,
  getMaxRetries,
  shouldSkipPermanently,
  logErrorCategory,
} from '../utils/error-categorizer';

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
   * Extract HTTP status code from axios error
   */
  private extractHttpStatus(error: unknown): number | null {
    if (axios.isAxiosError(error)) {
      return error.response?.status ?? null;
    }
    return null;
  }

  /**
   * Create error message with HTTP status code if available
   */
  private createErrorMessage(error: unknown, statusCode: number | null): string {
    const baseMessage = error instanceof Error ? error.message : String(error);
    if (statusCode) {
      return `HTTP ${statusCode}: ${baseMessage}`;
    }
    return baseMessage;
  }

  /**
   * Fetch a page and return HTML content
   */
  protected async fetchPage(url: string): Promise<string> {
    // Check robots.txt if enabled
    if (this.config.respectRobotsTxt) {
      const allowed = await isUrlAllowed(url, this.config.userAgent);
      if (!allowed) {
        const error = new Error(`URL disallowed by robots.txt: ${url}`);
        logErrorCategory(error, url);
        throw error;
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

    // Fetch with retries using error categorization
    let lastError: Error | null = null;
    let lastStatusCode: number | null = null;
    const maxRetries = this.config.maxRetries;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        scraperLogger.debug(`Fetching ${url} (attempt ${attempt}/${maxRetries})`);
        const response = await this.httpClient.get(url);
        return response.data;
      } catch (error) {
        // Extract HTTP status code from axios error
        const statusCode = this.extractHttpStatus(error);
        lastStatusCode = statusCode;

        // Create error with status code
        const errorMessage = this.createErrorMessage(error, statusCode);
        lastError = new Error(errorMessage);

        // Categorize error to determine retry strategy
        const errorCategory = categorizeError(error);
        logErrorCategory(error, url);

        // Check if we should skip permanently (404, 403, etc.)
        if (shouldSkipPermanently(error)) {
          scraperLogger.warn(`Skipping permanently: ${url} - ${errorCategory.reason}`);
          throw lastError;
        }

        // Check if we should retry
        if (!errorCategory.isRetryable || attempt >= maxRetries) {
          if (attempt >= maxRetries) {
            scraperLogger.error(`Request failed after ${maxRetries} attempts`, {
              error: errorMessage,
              url,
              statusCode,
            });
          }
          throw lastError;
        }

        // Calculate retry delay based on error category
        const retryDelay = getRetryDelay(error, attempt, 1000);

        // Special handling for rate limit errors (429)
        if (statusCode === 429 && this.config.rateLimitRetryDelay) {
          const rateLimitDelay = this.config.rateLimitRetryDelay;
          scraperLogger.warn(
            `Rate limit (429) detected, waiting ${rateLimitDelay}ms before retry: ${url}`,
          );
          await new Promise(resolve => setTimeout(resolve, rateLimitDelay));
        } else {
          scraperLogger.warn(
            `Request failed, retrying in ${retryDelay}ms (attempt ${attempt}/${maxRetries}): ${errorCategory.reason}`,
            {
              error: errorMessage,
              url,
              statusCode,
            },
          );
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    // Should not reach here, but handle it just in case
    const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
    scraperLogger.error(`Failed to fetch ${url} after ${maxRetries} attempts`, {
      error: errorMessage,
      url,
      statusCode: lastStatusCode,
    });
    throw new Error(
      `Failed to fetch ${url} after ${maxRetries} attempts: ${errorMessage}`,
    );
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
   * Get recipe URLs to scrape (limited)
   * Must be implemented by subclasses for discovery
   */
  abstract getRecipeUrls(limit?: number): Promise<string[]>;

  /**
   * Get ALL recipe URLs (comprehensive, no limit)
   * Must be implemented by subclasses for comprehensive discovery
   * Should use sitemap parsing first, then fallback to pagination
   */
  abstract getAllRecipeUrls(): Promise<string[]>;
}
