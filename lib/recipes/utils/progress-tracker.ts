/**
 * Progress Tracker (Migrated from scripts)
 */
import { logger } from '@/lib/logger';
import * as fs from 'fs';
import * as path from 'path';
import { STORAGE_PATH } from '../config';
import { SourceType } from '../types';
import { scraperLogger } from './logger';
import { computeProgressStatistics } from './progress-tracker/statistics';

export interface ScrapingProgress {
  source: SourceType;
  discovered: string[];
  scraped: string[];
  failed: Record<string, string>;
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
  estimatedTimeRemaining?: number;
  averageTimePerRecipe?: number;
}

export class ProgressTracker {
  private progressDir: string;

  constructor(storagePath: string = STORAGE_PATH) {
    this.progressDir = path.resolve(path.join(storagePath, '.progress'));
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.progressDir)) {
      fs.mkdirSync(this.progressDir, { recursive: true });
    }
  }

  private getProgressFilePath(source: SourceType): string {
    return path.join(this.progressDir, `${source}.json`);
  }

  loadProgress(source: SourceType): ScrapingProgress | null {
    const filePath = this.getProgressFilePath(source);
    if (!fs.existsSync(filePath)) return null;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const progress = JSON.parse(content) as ScrapingProgress;
      scraperLogger.info(
        `Loaded progress for ${source}: ${progress.scraped.length}/${progress.discovered.length} scraped`,
      );
      return progress;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`[Progress Tracker] Failed to load progress for ${source}:`, {
        error: errorMessage,
      });
      return null;
    }
  }

  saveProgress(progress: ScrapingProgress): void {
    const filePath = this.getProgressFilePath(progress.source);
    const tempFilePath = `${filePath}.tmp`;
    progress.lastUpdated = new Date().toISOString();

    try {
      fs.writeFileSync(tempFilePath, JSON.stringify(progress, null, 2), 'utf-8');
      fs.renameSync(tempFilePath, filePath);
      scraperLogger.debug(`Saved progress for ${progress.source}`);
    } catch (error) {
      scraperLogger.error(`Failed to save progress for ${progress.source}:`, error);
      try {
        fs.writeFileSync(filePath, JSON.stringify(progress, null, 2), 'utf-8');
      } catch {}
    }
  }

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

  updateProgress(
    source: SourceType,
    url: string,
    success: boolean,
    error?: string,
  ): ScrapingProgress | null {
    const progress = this.loadProgress(source);
    if (!progress) return null;

    if (success) {
      if (!progress.scraped.includes(url)) progress.scraped.push(url);
      delete progress.failed[url];
    } else {
      if (error) progress.failed[url] = error;
      progress.scraped = progress.scraped.filter(u => u !== url);
    }

    const scrapedSet = new Set(progress.scraped);
    progress.currentIndex = progress.discovered.findIndex(url => !scrapedSet.has(url));
    if (progress.currentIndex === -1) progress.currentIndex = progress.discovered.length;
    progress.currentBatch = Math.floor(progress.scraped.length / 50);

    this.saveProgress(progress);
    return progress;
  }

  getStatistics(progress: ScrapingProgress, startTime?: Date): ProgressStatistics {
    return computeProgressStatistics(progress, startTime);
  }

  getRemainingUrls(progress: ScrapingProgress): string[] {
    const scrapedSet = new Set(progress.scraped);
    return progress.discovered.filter(url => !scrapedSet.has(url));
  }

  isComplete(progress: ScrapingProgress): boolean {
    return progress.scraped.length >= progress.discovered.length;
  }
}
