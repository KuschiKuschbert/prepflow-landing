/**
 * Base Scraper (Migrated from scripts)
 * Abstract base class for all recipe scrapers
 */

import axios, { AxiosInstance } from 'axios';
import { DEFAULT_CONFIG } from '../config';
import { normalizeRecipe } from '../parsers/recipe-normalizer';
import { validateRecipe } from '../parsers/schema-validator';
import { RecipeUrlWithRating, ScrapedRecipe, ScraperConfig, ScrapeResult } from '../types';
import { categorizeError, getRetryDelay, shouldSkipPermanently } from '../utils/error-categorizer';
import { scraperLogger } from '../utils/logger';
import { RateLimiter } from '../utils/rate-limiter';
import { getCrawlDelay, isUrlAllowed } from '../utils/robots-checker';

export abstract class BaseScraper {
  protected config: ScraperConfig;
  protected rateLimiter: RateLimiter;
  protected httpClient: AxiosInstance;
  protected source: string;

  constructor(source: string, config: Partial<ScraperConfig> = {}) {
    this.source = source;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.rateLimiter = new RateLimiter(this.config.delayBetweenRequests, 3);
    this.httpClient = axios.create({
      timeout: this.config.timeout,
      headers: { 'User-Agent': this.config.userAgent },
    });
  }

  private extractHttpStatus(error: unknown): number | null {
    if (axios.isAxiosError(error)) return error.response?.status ?? null;
    return null;
  }

  private createErrorMessage(error: unknown, statusCode: number | null): string {
    const baseMessage = error instanceof Error ? error.message : String(error);
    return statusCode ? `HTTP ${statusCode}: ${baseMessage}` : baseMessage;
  }

  protected async fetchPage(url: string): Promise<string> {
    if (this.config.respectRobotsTxt) {
      const allowed = await isUrlAllowed(url, this.config.userAgent);
      if (!allowed) throw new Error(`URL disallowed by robots.txt: ${url}`);

      const crawlDelay = await getCrawlDelay(url, this.config.userAgent);
      if (crawlDelay && crawlDelay > this.config.delayBetweenRequests) {
        scraperLogger.info(`Using crawl delay from robots.txt: ${crawlDelay}ms`);
        await new Promise(resolve => setTimeout(resolve, crawlDelay));
      }
    }

    await this.rateLimiter.wait();

    let lastError: Error | null = null;
    let lastStatusCode: number | null = null;
    const maxRetries = this.config.maxRetries;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        scraperLogger.debug(`Fetching ${url} (attempt ${attempt}/${maxRetries})`);
        const response = await this.httpClient.get(url);
        return response.data;
      } catch (error) {
        const statusCode = this.extractHttpStatus(error);
        lastStatusCode = statusCode;
        const errorMessage = this.createErrorMessage(error, statusCode);
        lastError = new Error(errorMessage);

        if (shouldSkipPermanently(error)) throw lastError;

        const errorCategory = categorizeError(error);
        if (!errorCategory.isRetryable || attempt >= maxRetries) throw lastError;

        const retryDelay = getRetryDelay(error, attempt, 1000);
        await new Promise(resolve =>
          setTimeout(
            resolve,
            statusCode === 429 ? this.config.rateLimitRetryDelay || 60000 : retryDelay,
          ),
        );
      }
    }
    throw lastError!;
  }

  protected abstract parseRecipe(html: string, url: string): Partial<ScrapedRecipe> | null;

  protected validateAndNormalize(recipe: Partial<ScrapedRecipe>): ScrapedRecipe | null {
    const normalized = normalizeRecipe(recipe);
    const validation = validateRecipe(normalized);
    if (!validation.success || !validation.recipe) {
      scraperLogger.error(`Recipe validation failed:`, validation.error);
      return null;
    }
    return validation.recipe;
  }

  async scrapeRecipe(url: string): Promise<ScrapeResult> {
    try {
      scraperLogger.info(`Scraping recipe from ${this.source}: ${url}`);
      const html = await this.fetchPage(url);
      let parsed = this.parseRecipe(html, url);

      if (!parsed) {
        const { getAIExtractor } = await import('../utils/ai-extractor');
        const aiExtractor = getAIExtractor();
        if (aiExtractor.isEnabled()) {
          scraperLogger.info(
            `[${this.source}] Traditional parsing failed, trying AI extraction...`,
          );
          parsed = await aiExtractor.extractRecipe(html, url);
        }
      }

      if (!parsed)
        return { success: false, error: 'Failed to parse recipe', source: this.source, url };

      parsed.source = this.source;
      parsed.source_url = url;
      parsed.scraped_at = new Date().toISOString();

      const recipe = this.validateAndNormalize(parsed);
      if (!recipe)
        return { success: false, error: 'Recipe validation failed', source: this.source, url };

      return { success: true, recipe, source: this.source, url };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage, source: this.source, url };
    }
  }

  abstract getRecipeUrls(limit?: number): Promise<string[]>;
  abstract getAllRecipeUrls(): Promise<string[]>;

  async getAllRecipeUrlsWithRatings(): Promise<RecipeUrlWithRating[]> {
    const urls = await this.getAllRecipeUrls();
    return urls.map(url => ({ url }));
  }
}
