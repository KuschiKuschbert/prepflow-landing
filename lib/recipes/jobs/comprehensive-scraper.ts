/**
 * Comprehensive Scraper Job (Migrated from scripts)
 * Orchestrates comprehensive scraping across all sources with batch processing and progress tracking
 */

import * as fs from 'fs';
import * as path from 'path';
import { SOURCES, SourceType, STORAGE_PATH } from '../config';
import { JSONStorage } from '../storage/json-storage';
import { scraperLogger } from '../utils/logger';
import { ProgressTracker, ScrapingProgress } from '../utils/progress-tracker';
import { shouldIncludeRecipe } from '../utils/rating-filter';

export interface JobStatus {
  isRunning: boolean;
  sources: Record<
    string,
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
    estimatedTimeRemaining?: number;
  };
  startedAt?: string;
  lastUpdated: string;
}

const BATCH_SIZE = 50;
const CONCURRENT_REQUESTS_PER_SOURCE = 3;

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

  async start(
    sources: SourceType[] = [
      SOURCES.ALLRECIPES,
      SOURCES.FOOD_NETWORK,
      SOURCES.EPICURIOUS,
      SOURCES.BON_APPETIT,
      SOURCES.TASTY,
      SOURCES.SERIOUS_EATS,
      SOURCES.SIMPLY_RECIPES,
      SOURCES.SMITTEN_KITCHEN,
      SOURCES.DELISH,
      SOURCES.FOOD_AND_WINE,
    ],
  ): Promise<void> {
    if (this.isRunning) return;

    this.removeStopFlag();
    this.isRunning = true;
    this.startTime = new Date();
    this.activeSources = new Set(sources);

    try {
      const sourcePromises = sources.map(async source => {
        try {
          const existingProgress = this.progressTracker.loadProgress(source);
          if (existingProgress && !this.progressTracker.isComplete(existingProgress)) {
            await this.processSource(source, existingProgress);
          } else {
            await this.processSource(source);
          }
        } catch (error) {
          scraperLogger.error(`Error processing ${source}:`, error);
        }
      });

      await Promise.all(sourcePromises);
    } finally {
      this.isRunning = false;
      this.activeSources.clear();
      this.removeStopFlag();
    }
  }

  /**
   * Resume the job automatically detecting sources with progress
   */
  async resume(): Promise<void> {
    const sourcesToResume: SourceType[] = [];
    // Just a placeholder list of all supported sources to check progress for
    const allSources = Object.values(SOURCES) as SourceType[];

    for (const source of allSources) {
      const progress = this.progressTracker.loadProgress(source);
      if (progress && !this.progressTracker.isComplete(progress)) {
        sourcesToResume.push(source);
      }
    }

    if (sourcesToResume.length > 0) {
      return this.start(sourcesToResume);
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.createStopFlag();
  }

  private async processSource(
    source: SourceType,
    existingProgress?: ScrapingProgress,
  ): Promise<void> {
    const scraper = this.getScraper(source);
    const progress =
      existingProgress ||
      this.progressTracker.initializeProgress(source, await scraper.getAllRecipeUrls());

    const remainingUrls = this.progressTracker.getRemainingUrls(progress);
    for (let i = 0; i < remainingUrls.length; i += BATCH_SIZE) {
      if (!this.isRunning || this.checkStopFlag()) break;
      const batch = remainingUrls.slice(i, i + BATCH_SIZE);
      await this.processBatchWithConcurrency(batch, source, scraper);
      this.progressTracker.saveProgress(this.progressTracker.loadProgress(source)!);
    }
  }

  private async processBatchWithConcurrency(
    batch: string[],
    source: SourceType,
    scraper: any,
  ): Promise<void> {
    const processUrl = async (url: string) => {
      if (!this.isRunning || this.checkStopFlag()) return;
      try {
        if (this.storage.urlExists(source, url)) {
          this.progressTracker.updateProgress(source, url, true);
          return;
        }
        const result = await scraper.scrapeRecipe(url);
        if (result.success && result.recipe && shouldIncludeRecipe(result.recipe, source)) {
          await this.storage.saveRecipe(result.recipe);
          this.progressTracker.updateProgress(source, url, true);
        } else {
          this.progressTracker.updateProgress(source, url, false, result.error || 'Failed');
        }
      } catch (e) {
        this.progressTracker.updateProgress(source, url, false, String(e));
      }
    };

    for (let i = 0; i < batch.length; i += CONCURRENT_REQUESTS_PER_SOURCE) {
      if (!this.isRunning || this.checkStopFlag()) break;
      await Promise.all(
        batch.slice(i, i + CONCURRENT_REQUESTS_PER_SOURCE).map(url => processUrl(url)),
      );
    }
  }

  getStatus(): JobStatus {
    const status: JobStatus = {
      isRunning: this.isRunning,
      sources: {},
      overall: {
        totalDiscovered: 0,
        totalScraped: 0,
        totalFailed: 0,
        totalRemaining: 0,
        overallProgressPercent: 0,
      },
      lastUpdated: new Date().toISOString(),
    };
    return status;
  }

  private getScraper(source: SourceType) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getScraper } = require('../factory');
    return getScraper(source);
  }

  private getStopFlagPath(): string {
    return path.join(STORAGE_PATH, '.stop-flag');
  }
  private checkStopFlag(): boolean {
    return fs.existsSync(this.getStopFlagPath());
  }
  private createStopFlag(): void {
    fs.writeFileSync(
      this.getStopFlagPath(),
      JSON.stringify({ stoppedAt: new Date().toISOString() }),
    );
  }
  private removeStopFlag(): void {
    if (fs.existsSync(this.getStopFlagPath())) fs.unlinkSync(this.getStopFlagPath());
  }
}

let jobInstance: ComprehensiveScraperJob | null = null;
export function getComprehensiveScraperJob(): ComprehensiveScraperJob {
  if (!jobInstance) jobInstance = new ComprehensiveScraperJob();
  return jobInstance;
}
