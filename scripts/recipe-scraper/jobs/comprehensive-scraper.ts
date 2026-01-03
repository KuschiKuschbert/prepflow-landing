/**
 * Comprehensive Scraper Job
 * Orchestrates comprehensive scraping across all sources with batch processing and progress tracking
 */

import * as fs from 'fs';
import * as path from 'path';
import { AllRecipesScraper } from '../scrapers/allrecipes-scraper';
import { BBCGoodFoodScraper } from '../scrapers/bbc-good-food-scraper';
import { FoodNetworkScraper } from '../scrapers/food-network-scraper';
import { JSONStorage } from '../storage/json-storage';
import { ProgressTracker, ScrapingProgress } from '../utils/progress-tracker';
import { SOURCES, SourceType, STORAGE_PATH } from '../config';
import { scraperLogger } from '../utils/logger';
import { logger } from '@/lib/logger';
import {
  isRetryableError,
  shouldSkipPermanently,
  getRetryDelay,
  categorizeError,
} from '../utils/error-categorizer';

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
  };
  startedAt?: string;
  lastUpdated: string;
}

const BATCH_SIZE = 50;
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
    sources: SourceType[] = [SOURCES.ALLRECIPES, SOURCES.BBC_GOOD_FOOD, SOURCES.FOOD_NETWORK],
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

    try {
      // Process each source
      for (const source of sources) {
        await this.processSource(source);
      }

      scraperLogger.info('Comprehensive scraping completed for all sources');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('[Comprehensive Scraper] Error during comprehensive scraping:', {
        error: errorMessage,
        sources,
      });
      scraperLogger.error('Error during comprehensive scraping:', error);
    } finally {
      // Retry any remaining failed URLs across all sources before finishing
      // But only if not stopped
      if (this.isRunning && !this.checkStopFlag()) {
        for (const source of this.activeSources) {
          // Check stop flag before each source retry
          if (!this.isRunning || this.checkStopFlag()) {
            scraperLogger.info('Scraping stopped, skipping final retry phase');
            break;
          }
          const scraper = this.getScraper(source);
          await this.retryFailedUrls(source, scraper);
        }
      }

      this.isRunning = false;
      this.activeSources.clear();
      this.removeStopFlag(); // Clean up stop flag when done
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

    try {
      const sources: SourceType[] = [
        SOURCES.ALLRECIPES,
        SOURCES.BBC_GOOD_FOOD,
        SOURCES.FOOD_NETWORK,
      ];

      for (const source of sources) {
        const progress = this.progressTracker.loadProgress(source);
        if (progress && !this.progressTracker.isComplete(progress)) {
          this.activeSources.add(source);
          await this.processSource(source, progress);
        }
      }

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
        const sources: SourceType[] = [
          SOURCES.ALLRECIPES,
          SOURCES.BBC_GOOD_FOOD,
          SOURCES.FOOD_NETWORK,
        ];

        for (const source of sources) {
          // Check stop flag before each source retry
          if (!this.isRunning || this.checkStopFlag()) {
            scraperLogger.info('Scraping stopped, skipping final retry phase');
            break;
          }
          const progress = this.progressTracker.loadProgress(source);
          if (progress && !this.progressTracker.isComplete(progress)) {
            const scraper = this.getScraper(source);
            await this.retryFailedUrls(source, scraper);
          }
        }
      }

      this.isRunning = false;
      this.activeSources.clear();
      this.removeStopFlag(); // Clean up stop flag when done
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
      // Discover all URLs
      scraperLogger.info(`Discovering all recipe URLs for ${source}...`);
      const discoveredUrls = await scraper.getAllRecipeUrls();

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

      // Process batch
      for (const url of batch) {
        // Check if job was stopped during batch processing (check both flag and file)
        if (!this.isRunning || this.checkStopFlag()) {
          scraperLogger.info(`Scraping stopped by user for ${source}`);
          this.isRunning = false; // Ensure flag is set
          return;
        }
        try {
          // Check if URL already exists before scraping (skip duplicate scraping)
          if (this.storage.urlExists(source, url)) {
            scraperLogger.debug(`⚠️  Skipping duplicate URL (already exists): ${url}`);
            this.progressTracker.updateProgress(source, url, true);
            continue;
          }

          const result = await scraper.scrapeRecipe(url);
          if (result.success && result.recipe) {
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
            scraperLogger.info(`Scraping stopped by user for ${source} (during error handling)`);
            this.isRunning = false;
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
      }

      // Save progress after each batch
      const updatedProgress = this.progressTracker.loadProgress(source);
      if (updatedProgress) {
        this.progressTracker.saveProgress(updatedProgress);
      }

      scraperLogger.info(
        `Batch ${batchIndex + 1}/${totalBatches} completed for ${source}. Progress: ${updatedProgress?.scraped.length || 0}/${updatedProgress?.discovered.length || 0}`,
      );
    }

    // Retry failed URLs that are retryable
    await this.retryFailedUrls(source, scraper);

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

    scraperLogger.debug(`Added to retry queue: ${url} (attempt ${existingItem ? existingItem.retryCount : 0})`);
  }

  /**
   * Retry failed URLs from retry queue
   */
  private async retryFailedUrls(
    source: SourceType,
    scraper: AllRecipesScraper | BBCGoodFoodScraper | FoodNetworkScraper,
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
        scraperLogger.debug(`Retrying ${item.url} (attempt ${item.retryCount + 1}/${MAX_RETRY_ATTEMPTS})`);

        const result = await scraper.scrapeRecipe(item.url);
        if (result.success && result.recipe) {
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
    const sources: SourceType[] = [SOURCES.ALLRECIPES, SOURCES.BBC_GOOD_FOOD, SOURCES.FOOD_NETWORK];

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
        const stats = this.progressTracker.getStatistics(progress, this.startTime || undefined);
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

    return status;
  }

  /**
   * Get scraper instance for source
   */
  private getScraper(
    source: SourceType,
  ): AllRecipesScraper | BBCGoodFoodScraper | FoodNetworkScraper {
    switch (source) {
      case SOURCES.ALLRECIPES:
        return new AllRecipesScraper();
      case SOURCES.BBC_GOOD_FOOD:
        return new BBCGoodFoodScraper();
      case SOURCES.FOOD_NETWORK:
        return new FoodNetworkScraper();
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  }

  /**
   * Get stop flag file path
   */
  private getStopFlagPath(): string {
    const storagePath = this.storage.getStoragePath ? this.storage.getStoragePath() : STORAGE_PATH;
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
      fs.writeFileSync(stopFlagPath, JSON.stringify({ stoppedAt: new Date().toISOString() }), 'utf-8');
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
   */
  stop(): void {
    if (this.isRunning || this.checkStopFlag()) {
      scraperLogger.info('Stopping comprehensive scraping job...');
      this.isRunning = false;
      this.createStopFlag(); // Create flag file so other instances can see it
    }
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
