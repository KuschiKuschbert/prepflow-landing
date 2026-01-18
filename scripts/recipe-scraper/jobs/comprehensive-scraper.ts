/**
 * Comprehensive Scraper Job
 * Orchestrates comprehensive scraping across all sources with batch processing and progress tracking
 */

import { logger } from '@/lib/logger';
import * as fs from 'fs';
import * as path from 'path';
import { RATING_CONFIG, SOURCES, SourceType, STORAGE_PATH } from '../config';
import { AllRecipesScraper } from '../scrapers/allrecipes-scraper';
// import { BBCGoodFoodScraper } from '../scrapers/bbc-good-food-scraper'; // REMOVED - Terms of Service violation
import { BonAppetitScraper } from '../scrapers/bon-appetit-scraper';
import { DelishScraper } from '../scrapers/delish-scraper';
import { EpicuriousScraper } from '../scrapers/epicurious-scraper';
import { FoodAndWineScraper } from '../scrapers/food-and-wine-scraper';
import { FoodNetworkScraper } from '../scrapers/food-network-scraper';
import { Food52Scraper } from '../scrapers/food52-scraper';
import { SeriousEatsScraper } from '../scrapers/serious-eats-scraper';
import { SimplyRecipesScraper } from '../scrapers/simply-recipes-scraper';
import { SmittenKitchenScraper } from '../scrapers/smitten-kitchen-scraper';
import { TastyScraper } from '../scrapers/tasty-scraper';
import { TheKitchnScraper } from '../scrapers/the-kitchn-scraper';
import { JSONStorage } from '../storage/json-storage';
import { getRetryDelay, isRetryableError, shouldSkipPermanently } from '../utils/error-categorizer';
import { scraperLogger } from '../utils/logger';
import { ProgressTracker, ScrapingProgress } from '../utils/progress-tracker';
import { shouldIncludeRecipe } from '../utils/rating-filter';

export interface JobStatus {
  isRunning: boolean;
  sources: Record<
    SourceType,
    {
      discovered: number;
      scraped: number;
      failed: number;
      remaining: number;
      progressPercent: number;
      estimatedTimeRemaining?: number;
      isComplete: boolean;
    }
  >;
  overall: {
    totalDiscovered: number;
    totalScraped: number;
    totalFailed: number;
    totalRemaining: number;
    overallProgressPercent: number;
    estimatedTimeRemaining?: number; // in seconds
  };
  startedAt?: string;
  lastUpdated: string;
}

const BATCH_SIZE = 50;
// Concurrency: Process 3-5 recipes simultaneously per source for maximum speed
// With 5 sources × 3-5 concurrent = 15-25 total concurrent requests
const CONCURRENT_REQUESTS_PER_SOURCE = 3; // Conservative: 3 concurrent requests per source
const MAX_RETRY_ATTEMPTS = 3; // Maximum retry attempts per URL

interface RetryQueueItem {
  url: string;
  error: string;
  retryCount: number;
  lastRetryAt?: number;
}

export class ComprehensiveScraperJob {
  private storage: JSONStorage;
  private progressTracker: ProgressTracker;
  private isRunning: boolean = false;
  private startTime: Date | null = null;
  private activeSources: Set<SourceType> = new Set();
  private retryQueues: Map<SourceType, RetryQueueItem[]> = new Map();

  constructor() {
    this.storage = new JSONStorage();
    this.progressTracker = new ProgressTracker();
  }

  /**
   * Start comprehensive scraping for specified sources
   */
  async start(
    sources: SourceType[] = [
      SOURCES.ALLRECIPES,
      // SOURCES.BBC_GOOD_FOOD, // REMOVED - Terms of Service violation (see docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md)
      SOURCES.FOOD_NETWORK,
      SOURCES.EPICURIOUS,
      SOURCES.BON_APPETIT,
      SOURCES.TASTY,
      SOURCES.SERIOUS_EATS,
      // SOURCES.FOOD52, // DISABLED - Aggressive rate limiting (429 errors)
      SOURCES.SIMPLY_RECIPES,
      SOURCES.SMITTEN_KITCHEN,
      // SOURCES.THE_KITCHN, // DISABLED - CDN blocks automated requests (403 errors)
      SOURCES.DELISH,
      SOURCES.FOOD_AND_WINE,
    ],
  ): Promise<void> {
    if (this.isRunning) {
      scraperLogger.warn('Comprehensive scraping job is already running');
      return;
    }

    // Remove any existing stop flag before starting
    this.removeStopFlag();

    this.isRunning = true;
    this.startTime = new Date();
    this.activeSources = new Set(sources);
    this.retryQueues.clear(); // Clear retry queues when starting new job

    scraperLogger.info(`Starting comprehensive scraping for sources: ${sources.join(', ')}`);
    scraperLogger.info('⚠️  Processing all sources in PARALLEL for maximum speed');

    try {
      // Process all sources in parallel (best practice for speed)
      // Each source has its own rate limiting and progress tracking
      const sourcePromises = sources.map(async source => {
        try {
          // OPTIMIZATION: Check for existing progress to avoid re-discovering URLs
          const existingProgress = this.progressTracker.loadProgress(source);
          if (existingProgress && !this.progressTracker.isComplete(existingProgress)) {
            scraperLogger.info(
              `Found existing progress for ${source}, resuming instead of re-discovering`,
            );
            await this.processSource(source, existingProgress);
          } else {
            await this.processSource(source);
          }
          scraperLogger.info(`✅ Completed scraping for ${source}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`[Comprehensive Scraper] Error processing ${source}:`, {
            error: errorMessage,
            source,
          });
          scraperLogger.error(`❌ Error processing ${source}:`, errorMessage);
          // Don't throw - let other sources continue
        }
      });

      // Wait for all sources to complete (or fail independently)
      await Promise.all(sourcePromises);

      scraperLogger.info('Comprehensive scraping completed for all sources');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('[Comprehensive Scraper] Error during comprehensive scraping:', {
        error: errorMessage,
        sources,
      });
      scraperLogger.error('Error during comprehensive scraping:', error);
    } finally {
      // CRITICAL: Save progress for all active sources before finishing
      // This ensures progress is saved even if there's an unexpected error or stop
      scraperLogger.info('Saving final progress for all sources...');
      for (const source of Array.from(this.activeSources)) {
        try {
          const progress = this.progressTracker.loadProgress(source);
          if (progress) {
            this.progressTracker.saveProgress(progress);
            scraperLogger.debug(`✅ Saved final progress for ${source}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          scraperLogger.error(`Failed to save final progress for ${source}:`, errorMessage);
          // Continue with other sources even if one fails
        }
      }

      // Retry any remaining failed URLs across all sources before finishing
      // But only if not stopped
      if (this.isRunning && !this.checkStopFlag()) {
        scraperLogger.info('Retrying failed URLs for all sources in parallel...');
        const retryPromises = Array.from(this.activeSources).map(async source => {
          // Check stop flag before each source retry
          if (!this.isRunning || this.checkStopFlag()) {
            return;
          }
          try {
            const scraper = this.getScraper(source);
            await this.retryFailedUrls(source, scraper);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            scraperLogger.error(`Error retrying failed URLs for ${source}:`, errorMessage);
            // Don't throw - let other sources continue
          }
        });

        // Wait for all retries to complete
        await Promise.all(retryPromises);
      }

      // Final save after retries (in case retries updated progress)
      scraperLogger.info('Saving final progress after retries...');
      for (const source of Array.from(this.activeSources)) {
        try {
          const progress = this.progressTracker.loadProgress(source);
          if (progress) {
            this.progressTracker.saveProgress(progress);
            scraperLogger.debug(`✅ Saved final progress after retries for ${source}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          scraperLogger.error(
            `Failed to save final progress after retries for ${source}:`,
            errorMessage,
          );
        }
      }

      this.isRunning = false;
      this.activeSources.clear();
      this.removeStopFlag(); // Clean up stop flag when done
      scraperLogger.info('✅ Comprehensive scraping job finished - all progress saved');
    }
  }

  /**
   * Resume scraping from saved progress
   */
  async resume(): Promise<void> {
    // Check stop flag first
    if (this.checkStopFlag()) {
      scraperLogger.info('Stop flag detected, cannot resume. Remove stop flag file to resume.');
      this.removeStopFlag(); // Clear it so user can resume later
      return;
    }

    if (this.isRunning) {
      scraperLogger.warn('Comprehensive scraping job is already running');
      return;
    }

    this.isRunning = true;
    this.startTime = new Date();
    // Don't clear retry queues when resuming - they may contain URLs to retry

    scraperLogger.info('Resuming comprehensive scraping from saved progress');
    scraperLogger.info('⚠️  Processing all sources in PARALLEL for maximum speed');

    try {
      const sources: SourceType[] = [
        SOURCES.ALLRECIPES,
        // SOURCES.BBC_GOOD_FOOD, // REMOVED - Terms of Service violation
        SOURCES.FOOD_NETWORK,
        SOURCES.EPICURIOUS,
        SOURCES.BON_APPETIT,
        SOURCES.TASTY,
        SOURCES.SERIOUS_EATS,
        // SOURCES.FOOD52, // DISABLED - Aggressive rate limiting (429 errors)
        SOURCES.SIMPLY_RECIPES,
        SOURCES.SMITTEN_KITCHEN,
        // SOURCES.THE_KITCHN, // DISABLED - CDN blocks automated requests (403 errors)
        SOURCES.DELISH,
        SOURCES.FOOD_AND_WINE,
      ];

      // Process all sources in parallel (best practice for speed)
      const resumePromises = sources.map(async source => {
        try {
          const progress = this.progressTracker.loadProgress(source);
          if (progress && !this.progressTracker.isComplete(progress)) {
            this.activeSources.add(source);
            await this.processSource(source, progress);
            scraperLogger.info(`✅ Resumed and completed scraping for ${source}`);
          } else {
            scraperLogger.info(`⏭️  Skipping ${source} (already complete or no progress)`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`[Comprehensive Scraper] Error resuming ${source}:`, {
            error: errorMessage,
            source,
          });
          scraperLogger.error(`❌ Error resuming ${source}:`, errorMessage);
          // Don't throw - let other sources continue
        }
      });

      // Wait for all sources to complete (or fail independently)
      await Promise.all(resumePromises);

      scraperLogger.info('Resumed comprehensive scraping completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('[Comprehensive Scraper] Error resuming comprehensive scraping:', {
        error: errorMessage,
      });
      scraperLogger.error('Error resuming comprehensive scraping:', error);
    } finally {
      // Retry any remaining failed URLs across all sources before finishing
      // But only if not stopped
      if (this.isRunning && !this.checkStopFlag()) {
        scraperLogger.info('Retrying failed URLs for all sources in parallel...');
        const retryPromises = Array.from(this.activeSources).map(async source => {
          // Check stop flag before each source retry
          if (!this.isRunning || this.checkStopFlag()) {
            return;
          }
          try {
            const progress = this.progressTracker.loadProgress(source);
            if (progress && !this.progressTracker.isComplete(progress)) {
              const scraper = this.getScraper(source);
              await this.retryFailedUrls(source, scraper);
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            scraperLogger.error(`Error retrying failed URLs for ${source}:`, errorMessage);
            // Don't throw - let other sources continue
          }
        });

        // Wait for all retries to complete
        await Promise.all(retryPromises);
      }

      this.isRunning = false;
      this.activeSources.clear();
      this.removeStopFlag(); // Clean up stop flag when done
    }
  }

  /**
   * Process a batch of URLs with concurrency limit (3-5 recipes simultaneously)
   * This dramatically improves speed while respecting rate limits
   */
  private async processBatchWithConcurrency(
    batch: string[],
    source: SourceType,
    scraper:
      | AllRecipesScraper
      | FoodNetworkScraper
      | EpicuriousScraper
      | BonAppetitScraper
      | TastyScraper
      | SeriousEatsScraper
      | Food52Scraper
      | SimplyRecipesScraper
      | SmittenKitchenScraper
      | TheKitchnScraper
      | DelishScraper
      | FoodAndWineScraper,
  ): Promise<void> {
    // Process URLs with concurrency limit using a simple queue pattern
    const processUrl = async (url: string): Promise<void> => {
      // Check if job was stopped
      if (!this.isRunning || this.checkStopFlag()) {
        return;
      }

      try {
        // Check if URL already exists before scraping (skip duplicate scraping)
        if (this.storage.urlExists(source, url)) {
          scraperLogger.debug(`⚠️  Skipping duplicate URL (already exists): ${url}`);
          this.progressTracker.updateProgress(source, url, true);
          return;
        }

        const result = await scraper.scrapeRecipe(url);

        // Check stop flag immediately after scraping (responsive stop)
        if (!this.isRunning || this.checkStopFlag()) {
          scraperLogger.info(`🛑 Stop flag detected after scraping ${url}, stopping immediately`);
          return;
        }

        if (result.success && result.recipe) {
          // Apply rating filter
          if (!shouldIncludeRecipe(result.recipe, source)) {
            const reason = result.recipe.rating
              ? `rating ${result.recipe.rating} below threshold`
              : 'no rating (unrated not allowed)';
            this.progressTracker.updateProgress(source, url, false, reason);
            scraperLogger.debug(
              `⚠️  Skipped (rating filter): ${result.recipe.recipe_name} - ${reason}`,
            );
            return;
          }

          const saveResult = await this.storage.saveRecipe(result.recipe);
          if (saveResult.saved) {
            this.progressTracker.updateProgress(source, url, true);
            scraperLogger.debug(`✅ Scraped: ${result.recipe.recipe_name}`);
          } else {
            this.progressTracker.updateProgress(
              source,
              url,
              false,
              saveResult.reason || 'Duplicate or invalid',
            );
            scraperLogger.debug(`⚠️  Skipped: ${url} (${saveResult.reason})`);
          }
        } else {
          const errorMessage = result.error || 'Failed to scrape';
          this.progressTracker.updateProgress(source, url, false, errorMessage);

          // Check if error should be retried
          if (isRetryableError(errorMessage) && !shouldSkipPermanently(errorMessage)) {
            this.addToRetryQueue(source, url, errorMessage);
          } else {
            scraperLogger.warn(`❌ Failed (permanent): ${url} - ${errorMessage}`);
          }
        }
      } catch (error) {
        // Check if job was stopped before processing error
        if (!this.isRunning || this.checkStopFlag()) {
          return;
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        this.progressTracker.updateProgress(source, url, false, errorMessage);

        // Check if error should be retried
        if (isRetryableError(error) && !shouldSkipPermanently(error)) {
          this.addToRetryQueue(source, url, errorMessage);
        } else {
          scraperLogger.error(`❌ Error scraping (permanent): ${url} - ${errorMessage}`);
        }
      }
    };

    // Process batch with concurrency limit (3-5 concurrent requests per source)
    // This allows multiple recipes to be scraped simultaneously while respecting rate limits
    const concurrencyLimit = CONCURRENT_REQUESTS_PER_SOURCE;
    const chunks: string[][] = [];

    // Split batch into chunks for concurrent processing
    for (let i = 0; i < batch.length; i += concurrencyLimit) {
      chunks.push(batch.slice(i, i + concurrencyLimit));
    }

    // Process each chunk concurrently, but chunks sequentially
    for (const chunk of chunks) {
      // Check if job was stopped (check BEFORE processing chunk)
      if (!this.isRunning || this.checkStopFlag()) {
        scraperLogger.info(`Scraping stopped by user for ${source} (before chunk processing)`);
        this.isRunning = false;
        return;
      }

      // Process all URLs in chunk concurrently
      // Use Promise.allSettled to ensure all promises complete even if one fails
      // This allows us to check stop flag after each chunk
      const _results = await Promise.allSettled(chunk.map(url => processUrl(url)));

      // Check stop flag AFTER processing chunk (more responsive)
      // This ensures we stop as soon as possible after the chunk completes
      if (!this.isRunning || this.checkStopFlag()) {
        scraperLogger.info(`Scraping stopped by user for ${source} (after chunk processing)`);
        this.isRunning = false;
        return;
      }
    }
  }

  /**
   * Process a single source
   */
  private async processSource(
    source: SourceType,
    existingProgress?: ScrapingProgress,
  ): Promise<void> {
    scraperLogger.info(`Processing source: ${source}`);

    let progress: ScrapingProgress;
    const scraper = this.getScraper(source);

    if (existingProgress) {
      // Resume from existing progress
      progress = existingProgress;
      scraperLogger.info(
        `Resuming ${source}: ${progress.scraped.length}/${progress.discovered.length} already scraped`,
      );
    } else {
      // Check stop flag before starting URL discovery
      if (!this.isRunning || this.checkStopFlag()) {
        scraperLogger.info(
          `🛑 Stop flag detected before URL discovery for ${source}, stopping immediately`,
        );
        this.isRunning = false;
        return;
      }

      // Discover all URLs WITH RATINGS (optimized pre-filtering)
      scraperLogger.info(
        `Discovering all recipe URLs for ${source} (with ratings for pre-filtering)...`,
      );
      let discoveredUrls: string[];
      try {
        // Use optimized method that extracts ratings from listing pages
        const urlsWithRatings = await scraper.getAllRecipeUrlsWithRatings();

        // Pre-filter by rating BEFORE downloading full pages (huge efficiency gain)
        const sourceConfig =
          RATING_CONFIG.SOURCE_CONFIG[source as keyof typeof RATING_CONFIG.SOURCE_CONFIG];
        const minRating = sourceConfig?.minRating ?? RATING_CONFIG.DEFAULT_MIN_RATING;
        const includeUnrated =
          sourceConfig?.includeUnrated ?? RATING_CONFIG.DEFAULT_INCLUDE_UNRATED;

        let filteredCount = 0;
        discoveredUrls = urlsWithRatings
          .filter(item => {
            // If we have a rating from listing page, pre-filter
            if (item.rating !== undefined) {
              if (item.rating < minRating) {
                filteredCount++;
                return false; // Skip low-rated
              }
              return true;
            }
            // No rating from listing page - include if unrated allowed
            return includeUnrated;
          })
          .map(item => item.url);

        if (filteredCount > 0) {
          scraperLogger.info(
            `🎯 Pre-filtered ${filteredCount} low-rated URLs for ${source} (${urlsWithRatings.length} total → ${discoveredUrls.length} after filter)`,
          );
        }
      } catch (error) {
        // If it's a stop error, handle it gracefully
        if (error instanceof Error && error.message === 'Scraping stopped by user') {
          scraperLogger.info(
            `🛑 Stop flag detected during URL discovery for ${source}, stopping immediately`,
          );
          this.isRunning = false;
          return;
        }
        // Re-throw other errors
        throw error;
      }

      // Check stop flag after URL discovery (in case it was stopped during discovery)
      if (!this.isRunning || this.checkStopFlag()) {
        scraperLogger.info(
          `🛑 Stop flag detected after URL discovery for ${source}, stopping immediately`,
        );
        this.isRunning = false;
        return;
      }

      if (discoveredUrls.length === 0) {
        scraperLogger.warn(`No recipe URLs discovered for ${source}`);
        return;
      }

      // Initialize progress
      progress = this.progressTracker.initializeProgress(source, discoveredUrls);
      scraperLogger.info(`Discovered ${discoveredUrls.length} recipe URLs for ${source}`);
    }

    // Get remaining URLs to scrape
    const remainingUrls = this.progressTracker.getRemainingUrls(progress);

    if (remainingUrls.length === 0) {
      scraperLogger.info(`All recipes already scraped for ${source}`);
      return;
    }

    scraperLogger.info(`Scraping ${remainingUrls.length} remaining recipes for ${source}`);

    // Process in batches
    const totalBatches = Math.ceil(remainingUrls.length / BATCH_SIZE);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      // Check if job was stopped (check both flag and file)
      if (!this.isRunning || this.checkStopFlag()) {
        scraperLogger.info(`Scraping stopped by user for ${source}`);
        this.isRunning = false; // Ensure flag is set
        return;
      }

      const batchStart = batchIndex * BATCH_SIZE;
      const batchEnd = Math.min(batchStart + BATCH_SIZE, remainingUrls.length);
      const batch = remainingUrls.slice(batchStart, batchEnd);

      scraperLogger.info(
        `Processing batch ${batchIndex + 1}/${totalBatches} for ${source} (${batch.length} recipes)`,
      );

      // Process batch with concurrency limit (3-5 recipes simultaneously per source)
      // This dramatically improves speed while respecting rate limits
      try {
        await this.processBatchWithConcurrency(batch, source, scraper);
      } catch (error) {
        // Save progress even if batch processing fails
        const errorMessage = error instanceof Error ? error.message : String(error);
        scraperLogger.error(
          `Error processing batch ${batchIndex + 1} for ${source}:`,
          errorMessage,
        );
        // Continue to save progress and next batch
      }

      // CRITICAL: Save progress after each batch (even if batch failed)
      // This ensures progress is never lost
      try {
        const updatedProgress = this.progressTracker.loadProgress(source);
        if (updatedProgress) {
          this.progressTracker.saveProgress(updatedProgress);
          scraperLogger.debug(`✅ Saved progress after batch ${batchIndex + 1} for ${source}`);
        }
      } catch (saveError) {
        const errorMessage = saveError instanceof Error ? saveError.message : String(saveError);
        scraperLogger.error(
          `Failed to save progress after batch ${batchIndex + 1} for ${source}:`,
          errorMessage,
        );
        // Continue processing even if save fails (progress is already saved after each recipe)
      }

      scraperLogger.info(
        `Batch ${batchIndex + 1}/${totalBatches} completed for ${source}. Progress: ${this.progressTracker.loadProgress(source)?.scraped.length || 0}/${this.progressTracker.loadProgress(source)?.discovered.length || 0}`,
      );
    }

    // Retry failed URLs that are retryable
    try {
      await this.retryFailedUrls(source, scraper);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      scraperLogger.error(`Error during retry phase for ${source}:`, errorMessage);
      // Continue to save progress even if retry fails
    }

    // CRITICAL: Final save after processing source (including retries)
    // This ensures progress is saved even if there's an error
    try {
      const finalProgress = this.progressTracker.loadProgress(source);
      if (finalProgress) {
        this.progressTracker.saveProgress(finalProgress);
        scraperLogger.debug(`✅ Saved final progress for ${source}`);
      }
    } catch (saveError) {
      const errorMessage = saveError instanceof Error ? saveError.message : String(saveError);
      scraperLogger.error(`Failed to save final progress for ${source}:`, errorMessage);
    }

    scraperLogger.info(`Completed scraping for ${source}`);
  }

  /**
   * Add URL to retry queue
   */
  private addToRetryQueue(source: SourceType, url: string, error: string): void {
    if (!this.retryQueues.has(source)) {
      this.retryQueues.set(source, []);
    }

    const queue = this.retryQueues.get(source)!;

    // Check if URL is already in queue
    const existingItem = queue.find(item => item.url === url);
    if (existingItem) {
      existingItem.retryCount++;
      existingItem.error = error;
      existingItem.lastRetryAt = Date.now();
    } else {
      queue.push({
        url,
        error,
        retryCount: 0,
        lastRetryAt: Date.now(),
      });
    }

    scraperLogger.debug(
      `Added to retry queue: ${url} (attempt ${existingItem ? existingItem.retryCount : 0})`,
    );
  }

  /**
   * Retry failed URLs from retry queue
   */
  private async retryFailedUrls(
    source: SourceType,
    scraper:
      | AllRecipesScraper
      | FoodNetworkScraper
      | EpicuriousScraper
      | BonAppetitScraper
      | TastyScraper
      | SeriousEatsScraper
      | Food52Scraper
      | SimplyRecipesScraper
      | SmittenKitchenScraper
      | TheKitchnScraper
      | DelishScraper
      | FoodAndWineScraper,
  ): Promise<void> {
    const queue = this.retryQueues.get(source);
    if (!queue || queue.length === 0) {
      return;
    }

    // Filter URLs that haven't exceeded max retry attempts
    const retryableUrls = queue.filter(item => item.retryCount < MAX_RETRY_ATTEMPTS);

    if (retryableUrls.length === 0) {
      scraperLogger.info(`No retryable URLs for ${source} (all exceeded max retry attempts)`);
      this.retryQueues.set(source, []);
      return;
    }

    scraperLogger.info(`Retrying ${retryableUrls.length} failed URLs for ${source}`);

    for (const item of retryableUrls) {
      // Check if job was stopped (check both flag and file)
      if (!this.isRunning || this.checkStopFlag()) {
        scraperLogger.info(`Scraping stopped by user during retry for ${source}`);
        this.isRunning = false; // Ensure flag is set
        return;
      }

      // Check if we should still retry this error
      if (!isRetryableError(item.error) || shouldSkipPermanently(item.error)) {
        scraperLogger.debug(`Skipping retry for ${item.url} - ${item.error} (not retryable)`);
        continue;
      }

      // Calculate retry delay with exponential backoff
      const retryDelay = getRetryDelay(item.error, item.retryCount + 1, 2000);

      // Wait before retrying (exponential backoff)
      // Check stop flag during wait with periodic checks
      if (item.lastRetryAt) {
        const timeSinceLastRetry = Date.now() - item.lastRetryAt;
        if (timeSinceLastRetry < retryDelay) {
          const waitTime = retryDelay - timeSinceLastRetry;
          scraperLogger.debug(`Waiting ${waitTime}ms before retrying ${item.url}`);

          // Check stop flag every 2 seconds during wait
          const checkInterval = 2000;
          const totalChecks = Math.ceil(waitTime / checkInterval);
          for (let i = 0; i < totalChecks; i++) {
            if (!this.isRunning || this.checkStopFlag()) {
              scraperLogger.info(`Scraping stopped by user during retry wait for ${source}`);
              this.isRunning = false;
              return;
            }
            const remainingWait = Math.min(checkInterval, waitTime - i * checkInterval);
            if (remainingWait > 0) {
              await new Promise(resolve => setTimeout(resolve, remainingWait));
            }
          }
        }
      } else {
        // Check stop flag periodically during initial retry delay
        const checkInterval = 2000;
        const totalChecks = Math.ceil(retryDelay / checkInterval);
        for (let i = 0; i < totalChecks; i++) {
          if (!this.isRunning || this.checkStopFlag()) {
            scraperLogger.info(`Scraping stopped by user during retry wait for ${source}`);
            this.isRunning = false;
            return;
          }
          const remainingWait = Math.min(checkInterval, retryDelay - i * checkInterval);
          if (remainingWait > 0) {
            await new Promise(resolve => setTimeout(resolve, remainingWait));
          }
        }
      }

      try {
        scraperLogger.debug(
          `Retrying ${item.url} (attempt ${item.retryCount + 1}/${MAX_RETRY_ATTEMPTS})`,
        );

        const result = await scraper.scrapeRecipe(item.url);
        if (result.success && result.recipe) {
          // Apply rating filter (same as main processing)
          if (!shouldIncludeRecipe(result.recipe, source)) {
            const reason = result.recipe.rating
              ? `rating ${result.recipe.rating} below threshold`
              : 'no rating (unrated not allowed)';
            this.progressTracker.updateProgress(source, item.url, false, reason);
            scraperLogger.debug(
              `⚠️  Skipped (rating filter): ${result.recipe.recipe_name} - ${reason}`,
            );

            // Remove from retry queue since it won't pass filter
            const queue = this.retryQueues.get(source);
            if (queue) {
              const index = queue.findIndex(q => q.url === item.url);
              if (index !== -1) {
                queue.splice(index, 1);
              }
            }
            return;
          }

          const saveResult = await this.storage.saveRecipe(result.recipe);
          if (saveResult.saved) {
            this.progressTracker.updateProgress(source, item.url, true);
            scraperLogger.info(`✅ Retry successful: ${item.url}`);

            // Remove from retry queue
            const queue = this.retryQueues.get(source);
            if (queue) {
              const index = queue.findIndex(q => q.url === item.url);
              if (index !== -1) {
                queue.splice(index, 1);
              }
            }
          } else {
            // Still failed, increment retry count
            item.retryCount++;
            item.error = saveResult.reason || 'Failed to save';
            item.lastRetryAt = Date.now();
            scraperLogger.warn(`⚠️  Retry failed (save error): ${item.url} - ${item.error}`);
          }
        } else {
          // Still failed, increment retry count
          item.retryCount++;
          item.error = result.error || 'Failed to scrape';
          item.lastRetryAt = Date.now();
          scraperLogger.warn(`⚠️  Retry failed: ${item.url} - ${item.error}`);
        }
      } catch (error) {
        // Check if job was stopped before processing retry error
        if (!this.isRunning || this.checkStopFlag()) {
          scraperLogger.info(`Scraping stopped by user during retry error handling for ${source}`);
          this.isRunning = false;
          return;
        }

        // Still failed, increment retry count
        const errorMessage = error instanceof Error ? error.message : String(error);
        item.retryCount++;
        item.error = errorMessage;
        item.lastRetryAt = Date.now();
        scraperLogger.error(`❌ Retry error: ${item.url} - ${errorMessage}`);
      }
    }

    // Remove URLs that exceeded max retry attempts
    const remainingQueue = queue.filter(item => item.retryCount < MAX_RETRY_ATTEMPTS);
    this.retryQueues.set(source, remainingQueue);

    if (remainingQueue.length > 0) {
      scraperLogger.info(
        `${remainingQueue.length} URLs still in retry queue for ${source} (will retry in next batch)`,
      );
    } else {
      scraperLogger.info(`All retryable URLs processed for ${source}`);
    }
  }

  /**
   * Get current job status
   */
  getStatus(): JobStatus {
    const sources: SourceType[] = [
      SOURCES.ALLRECIPES,
      SOURCES.FOOD_NETWORK,
      SOURCES.EPICURIOUS,
      SOURCES.BON_APPETIT,
      SOURCES.TASTY,
      SOURCES.SERIOUS_EATS,
      // SOURCES.FOOD52, // DISABLED - Aggressive rate limiting (429 errors)
      SOURCES.SIMPLY_RECIPES,
      SOURCES.SMITTEN_KITCHEN,
      // SOURCES.THE_KITCHN, // DISABLED - CDN blocks automated requests (403 errors)
      SOURCES.DELISH,
      SOURCES.FOOD_AND_WINE,
    ];

    // Check if scraper is actually running by checking for recent progress updates
    // If progress files were updated in the last 30 seconds, consider it running
    let actuallyRunning = this.isRunning;
    if (!actuallyRunning) {
      const now = Date.now();
      const RECENT_THRESHOLD = 30 * 1000; // 30 seconds

      for (const source of sources) {
        const progress = this.progressTracker.loadProgress(source);
        if (progress && progress.lastUpdated) {
          const lastUpdated = new Date(progress.lastUpdated).getTime();
          if (now - lastUpdated < RECENT_THRESHOLD) {
            // Progress was updated recently, scraper is likely running
            actuallyRunning = true;
            scraperLogger.debug(`Detected active scraping for ${source} (recent progress update)`);
            break;
          }
        }
      }
    }

    const status: JobStatus = {
      isRunning: actuallyRunning,
      sources: {} as JobStatus['sources'],
      overall: {
        totalDiscovered: 0,
        totalScraped: 0,
        totalFailed: 0,
        totalRemaining: 0,
        overallProgressPercent: 0,
      },
      lastUpdated: new Date().toISOString(),
    };

    if (this.startTime) {
      status.startedAt = this.startTime.toISOString();
    }

    // Get status for each source
    for (const source of sources) {
      const progress = this.progressTracker.loadProgress(source);
      if (progress) {
        // Use progress.startedAt as fallback if this.startTime is not set
        const progressStartTime = progress.startedAt
          ? new Date(progress.startedAt)
          : this.startTime || undefined;
        const stats = this.progressTracker.getStatistics(progress, progressStartTime);
        status.sources[source] = {
          discovered: stats.totalDiscovered,
          scraped: stats.totalScraped,
          failed: stats.totalFailed,
          remaining: stats.remaining,
          progressPercent: stats.progressPercent,
          estimatedTimeRemaining: stats.estimatedTimeRemaining,
          isComplete: this.progressTracker.isComplete(progress),
        };

        status.overall.totalDiscovered += stats.totalDiscovered;
        status.overall.totalScraped += stats.totalScraped;
        status.overall.totalFailed += stats.totalFailed;
        status.overall.totalRemaining += stats.remaining;
      } else {
        status.sources[source] = {
          discovered: 0,
          scraped: 0,
          failed: 0,
          remaining: 0,
          progressPercent: 0,
          isComplete: false,
        };
      }
    }

    // Calculate overall progress
    if (status.overall.totalDiscovered > 0) {
      status.overall.overallProgressPercent = Math.round(
        (status.overall.totalScraped / status.overall.totalDiscovered) * 100,
      );
    }

    // Calculate overall time estimate (in seconds)
    // Use the maximum time estimate from all sources (since they run in parallel)
    // This gives a realistic estimate for when all sources will complete
    if (status.overall.totalRemaining > 0 && this.startTime) {
      const sourceEstimates = Object.values(status.sources)
        .map(s => s.estimatedTimeRemaining)
        .filter((t): t is number => t !== undefined && t > 0);

      if (sourceEstimates.length > 0) {
        // Use maximum estimate (longest-running source determines completion time)
        // With parallel processing, all sources finish around the same time
        status.overall.estimatedTimeRemaining = Math.max(...sourceEstimates);
      } else {
        // Fallback: estimate based on remaining recipes and average rate
        // Conservative estimate: 30 recipes per minute (accounts for delays, retries, etc.)
        const RECIPES_PER_MINUTE = 30;
        const estimatedMinutes = status.overall.totalRemaining / RECIPES_PER_MINUTE;
        status.overall.estimatedTimeRemaining = Math.round(estimatedMinutes * 60);
      }
    }

    return status;
  }

  /**
   * Get scraper instance for source
   */
  private getScraper(
    source: SourceType,
  ):
    | AllRecipesScraper
    | FoodNetworkScraper
    | EpicuriousScraper
    | BonAppetitScraper
    | TastyScraper
    | SeriousEatsScraper
    | Food52Scraper
    | SimplyRecipesScraper
    | SmittenKitchenScraper
    | TheKitchnScraper
    | DelishScraper
    | FoodAndWineScraper {
    switch (source) {
      case SOURCES.ALLRECIPES:
        return new AllRecipesScraper();
      case SOURCES.BBC_GOOD_FOOD:
        throw new Error(
          'BBC Good Food scraper is disabled due to Terms of Service violation. See docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md',
        );
      case SOURCES.FOOD_NETWORK:
        return new FoodNetworkScraper();
      case SOURCES.EPICURIOUS:
        return new EpicuriousScraper();
      case SOURCES.BON_APPETIT:
        return new BonAppetitScraper();
      case SOURCES.TASTY:
        return new TastyScraper();
      case SOURCES.SERIOUS_EATS:
        return new SeriousEatsScraper();
      case SOURCES.FOOD52:
        return new Food52Scraper();
      case SOURCES.SIMPLY_RECIPES:
        return new SimplyRecipesScraper();
      case SOURCES.SMITTEN_KITCHEN:
        return new SmittenKitchenScraper();
      case SOURCES.THE_KITCHN:
        return new TheKitchnScraper();
      case SOURCES.DELISH:
        return new DelishScraper();
      case SOURCES.FOOD_AND_WINE:
        return new FoodAndWineScraper();
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  }

  /**
   * Get stop flag file path
   */
  private getStopFlagPath(): string {
    const storage = this.storage as unknown as { getStoragePath?: () => string };
    const storagePath = storage.getStoragePath ? storage.getStoragePath() : STORAGE_PATH;
    return path.join(storagePath, '.stop-flag');
  }

  /**
   * Check if stop flag exists
   */
  private checkStopFlag(): boolean {
    try {
      const stopFlagPath = this.getStopFlagPath();
      return fs.existsSync(stopFlagPath);
    } catch {
      return false;
    }
  }

  /**
   * Create stop flag file
   */
  private createStopFlag(): void {
    try {
      const stopFlagPath = this.getStopFlagPath();
      fs.writeFileSync(
        stopFlagPath,
        JSON.stringify({ stoppedAt: new Date().toISOString() }),
        'utf-8',
      );
      scraperLogger.info('Stop flag file created');
    } catch (error) {
      scraperLogger.error('Failed to create stop flag file:', error);
    }
  }

  /**
   * Remove stop flag file
   */
  private removeStopFlag(): void {
    try {
      const stopFlagPath = this.getStopFlagPath();
      if (fs.existsSync(stopFlagPath)) {
        fs.unlinkSync(stopFlagPath);
        scraperLogger.debug('Stop flag file removed');
      }
    } catch (error) {
      scraperLogger.error('Failed to remove stop flag file:', error);
    }
  }

  /**
   * Stop the job (graceful shutdown)
   * Creates a stop flag file that will be checked by all instances
   * This method is called by the API and should stop the scraper immediately
   * CRITICAL: Saves progress for all active sources before stopping
   */
  stop(): void {
    scraperLogger.info('🛑 Stop command received - stopping comprehensive scraping job...');
    this.isRunning = false;
    this.createStopFlag(); // Create flag file so other instances can see it

    // CRITICAL: Save progress for all active sources before stopping
    // This ensures no progress is lost when stopping
    scraperLogger.info('Saving progress for all active sources before stopping...');
    for (const source of Array.from(this.activeSources)) {
      try {
        const progress = this.progressTracker.loadProgress(source);
        if (progress) {
          this.progressTracker.saveProgress(progress);
          scraperLogger.info(`✅ Saved progress for ${source} before stop`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        scraperLogger.error(`Failed to save progress for ${source} before stop:`, errorMessage);
        // Continue with other sources even if one fails
      }
    }

    scraperLogger.info(
      '✅ Stop flag created - scraper will stop at next checkpoint (progress saved)',
    );
  }
}

// Singleton instance for API access
let jobInstance: ComprehensiveScraperJob | null = null;

/**
 * Get or create the singleton comprehensive scraper job instance
 * @returns {ComprehensiveScraperJob} The comprehensive scraper job instance
 */
export function getComprehensiveScraperJob(): ComprehensiveScraperJob {
  if (!jobInstance) {
    jobInstance = new ComprehensiveScraperJob();
  }
  return jobInstance;
}
