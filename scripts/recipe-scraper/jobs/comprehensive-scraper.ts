/**
 * Comprehensive Scraper Job
 * Orchestrates comprehensive scraping across all sources with batch processing and progress tracking
 */

import { AllRecipesScraper } from '../scrapers/allrecipes-scraper';
import { BBCGoodFoodScraper } from '../scrapers/bbc-good-food-scraper';
import { FoodNetworkScraper } from '../scrapers/food-network-scraper';
import { JSONStorage } from '../storage/json-storage';
import { ProgressTracker, ScrapingProgress } from '../utils/progress-tracker';
import { SOURCES, SourceType } from '../config';
import { scraperLogger } from '../utils/logger';
import { logger } from '@/lib/logger';

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

export class ComprehensiveScraperJob {
  private storage: JSONStorage;
  private progressTracker: ProgressTracker;
  private isRunning: boolean = false;
  private startTime: Date | null = null;
  private activeSources: Set<SourceType> = new Set();

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

    this.isRunning = true;
    this.startTime = new Date();
    this.activeSources = new Set(sources);

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
      this.isRunning = false;
      this.activeSources.clear();
    }
  }

  /**
   * Resume scraping from saved progress
   */
  async resume(): Promise<void> {
    if (this.isRunning) {
      scraperLogger.warn('Comprehensive scraping job is already running');
      return;
    }

    this.isRunning = true;
    this.startTime = new Date();

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
      this.isRunning = false;
      this.activeSources.clear();
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
      const batchStart = batchIndex * BATCH_SIZE;
      const batchEnd = Math.min(batchStart + BATCH_SIZE, remainingUrls.length);
      const batch = remainingUrls.slice(batchStart, batchEnd);

      scraperLogger.info(
        `Processing batch ${batchIndex + 1}/${totalBatches} for ${source} (${batch.length} recipes)`,
      );

      // Process batch
      for (const url of batch) {
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
            this.progressTracker.updateProgress(
              source,
              url,
              false,
              result.error || 'Failed to scrape',
            );
            scraperLogger.warn(`❌ Failed: ${url} - ${result.error}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.progressTracker.updateProgress(source, url, false, errorMessage);
          scraperLogger.error(`❌ Error scraping ${url}:`, errorMessage);
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

    scraperLogger.info(`Completed scraping for ${source}`);
  }

  /**
   * Get current job status
   */
  getStatus(): JobStatus {
    const sources: SourceType[] = [SOURCES.ALLRECIPES, SOURCES.BBC_GOOD_FOOD, SOURCES.FOOD_NETWORK];
    const status: JobStatus = {
      isRunning: this.isRunning,
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
   * Stop the job (graceful shutdown)
   */
  stop(): void {
    if (this.isRunning) {
      scraperLogger.info('Stopping comprehensive scraping job...');
      this.isRunning = false;
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
