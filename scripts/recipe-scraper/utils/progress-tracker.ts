/**
 * Progress Tracker
 * Tracks scraping progress for resumability
 */

import * as fs from 'fs';
import * as path from 'path';
import { scraperLogger } from './logger';
import { SourceType, STORAGE_PATH } from '../config';

export interface ScrapingProgress {
  source: SourceType;
  discovered: string[];
  scraped: string[];
  failed: Record<string, string>; // URL -> error message
  currentIndex: number;
  startedAt: string;
  lastUpdated: string;
  totalBatches: number;
  currentBatch: number;
}

export interface ProgressStatistics {
  totalDiscovered: number;
  totalScraped: number;
  totalFailed: number;
  remaining: number;
  progressPercent: number;
  estimatedTimeRemaining?: number; // in seconds
  averageTimePerRecipe?: number; // in seconds
}

export class ProgressTracker {
  private progressDir: string;

  constructor(storagePath: string = STORAGE_PATH) {
    this.progressDir = path.resolve(path.join(storagePath, '.progress'));
    this.ensureDirectoryExists();
  }

  /**
   * Ensure progress directory exists
   */
  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.progressDir)) {
      fs.mkdirSync(this.progressDir, { recursive: true });
    }
  }

  /**
   * Get progress file path for a source
   */
  private getProgressFilePath(source: SourceType): string {
    return path.join(this.progressDir, `${source}.json`);
  }

  /**
   * Load progress for a source
   */
  loadProgress(source: SourceType): ScrapingProgress | null {
    const filePath = this.getProgressFilePath(source);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const progress = JSON.parse(content) as ScrapingProgress;
      scraperLogger.info(`Loaded progress for ${source}: ${progress.scraped.length}/${progress.discovered.length} scraped`);
      return progress;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      scraperLogger.error(`Failed to load progress for ${source}:`, errorMessage);
      return null;
    }
  }

  /**
   * Save progress for a source
   */
  saveProgress(progress: ScrapingProgress): void {
    const filePath = this.getProgressFilePath(progress.source);
    progress.lastUpdated = new Date().toISOString();

    try {
      fs.writeFileSync(filePath, JSON.stringify(progress, null, 2), 'utf-8');
      scraperLogger.debug(`Saved progress for ${progress.source}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      scraperLogger.error(`Failed to save progress for ${progress.source}:`, errorMessage);
    }
  }

  /**
   * Initialize progress for a source
   */
  initializeProgress(source: SourceType, discoveredUrls: string[]): ScrapingProgress {
    const progress: ScrapingProgress = {
      source,
      discovered: discoveredUrls,
      scraped: [],
      failed: {},
      currentIndex: 0,
      startedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      totalBatches: Math.ceil(discoveredUrls.length / 50),
      currentBatch: 0,
    };

    this.saveProgress(progress);
    return progress;
  }

  /**
   * Update progress after scraping a URL
   */
  updateProgress(
    source: SourceType,
    url: string,
    success: boolean,
    error?: string,
  ): ScrapingProgress | null {
    const progress = this.loadProgress(source);
    if (!progress) {
      scraperLogger.warn(`No progress found for ${source}, cannot update`);
      return null;
    }

    if (success) {
      if (!progress.scraped.includes(url)) {
        progress.scraped.push(url);
      }
      // Remove from failed if it was there
      delete progress.failed[url];
    } else {
      if (error) {
        progress.failed[url] = error;
      }
      // Don't add to scraped if it failed
      progress.scraped = progress.scraped.filter(u => u !== url);
    }

    // Update current index to next unscraped URL
    const scrapedSet = new Set(progress.scraped);
    progress.currentIndex = progress.discovered.findIndex(url => !scrapedSet.has(url));
    if (progress.currentIndex === -1) {
      progress.currentIndex = progress.discovered.length;
    }

    // Update batch number
    progress.currentBatch = Math.floor(progress.scraped.length / 50);

    this.saveProgress(progress);
    return progress;
  }

  /**
   * Get statistics for progress
   */
  getStatistics(progress: ScrapingProgress, startTime?: Date): ProgressStatistics {
    const totalDiscovered = progress.discovered.length;
    const totalScraped = progress.scraped.length;
    const totalFailed = Object.keys(progress.failed).length;
    const remaining = totalDiscovered - totalScraped;

    const progressPercent =
      totalDiscovered > 0 ? Math.round((totalScraped / totalDiscovered) * 100) : 0;

    let estimatedTimeRemaining: number | undefined;
    let averageTimePerRecipe: number | undefined;

    if (startTime && totalScraped > 0) {
      const elapsedSeconds = (new Date().getTime() - startTime.getTime()) / 1000;
      averageTimePerRecipe = elapsedSeconds / totalScraped;
      estimatedTimeRemaining = averageTimePerRecipe * remaining;
    }

    return {
      totalDiscovered,
      totalScraped,
      totalFailed,
      remaining,
      progressPercent,
      estimatedTimeRemaining,
      averageTimePerRecipe,
    };
  }

  /**
   * Get remaining URLs to scrape
   */
  getRemainingUrls(progress: ScrapingProgress): string[] {
    const scrapedSet = new Set(progress.scraped);
    return progress.discovered.filter(url => !scrapedSet.has(url));
  }

  /**
   * Clear progress for a source
   */
  clearProgress(source: SourceType): void {
    const filePath = this.getProgressFilePath(source);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      scraperLogger.info(`Cleared progress for ${source}`);
    }
  }

  /**
   * Check if scraping is complete
   */
  isComplete(progress: ScrapingProgress): boolean {
    return progress.scraped.length >= progress.discovered.length;
  }
}

