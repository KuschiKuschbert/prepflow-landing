/**
 * Cron Scheduler
 * Scheduled scraping with node-cron
 */

import * as cron from 'node-cron';
import { RecipeScraperCLI } from '../index';
import { scraperLogger } from '../utils/logger';
import { logger } from '../../../lib/logger';
import { SourceType } from '../config';

interface ScheduledJob {
  source: SourceType;
  urls: string[];
  schedule: string; // Cron expression
  enabled: boolean;
}

/**
 * Recipe Scraper Scheduler
 */
export class RecipeScraperScheduler {
  private jobs: Map<string, cron.ScheduledTask> = new Map();
  private cli: RecipeScraperCLI;

  constructor() {
    this.cli = new RecipeScraperCLI();
  }

  /**
   * Schedule a scraping job
   */
  scheduleJob(jobId: string, job: ScheduledJob): void {
    if (!job.enabled) {
      scraperLogger.info(`Job ${jobId} is disabled, skipping`);
      return;
    }

    // Validate cron expression
    if (!cron.validate(job.schedule)) {
      scraperLogger.error(`Invalid cron expression for job ${jobId}: ${job.schedule}`);
      return;
    }

    // Cancel existing job if any
    this.cancelJob(jobId);

    // Create new scheduled task
    const task = cron.schedule(
      job.schedule,
      async () => {
        scraperLogger.info(`Running scheduled job ${jobId} for source ${job.source}`);
        try {
          await this.cli.scrapeFromUrls(job.urls, job.source, false);
          scraperLogger.info(`Completed scheduled job ${jobId}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`Error in scheduled recipe scraping job ${jobId}`, {
            error: errorMessage,
            source: job.source,
          });
          scraperLogger.error(`Error in scheduled job ${jobId}:`, error);
        }
      },
      {
        timezone: 'UTC',
      },
    );

    this.jobs.set(jobId, task);
    scraperLogger.info(`Scheduled job ${jobId} with schedule: ${job.schedule}`);
  }

  /**
   * Cancel a scheduled job
   */
  cancelJob(jobId: string): void {
    const task = this.jobs.get(jobId);
    if (task) {
      task.stop();
      this.jobs.delete(jobId);
      scraperLogger.info(`Cancelled job ${jobId}`);
    }
  }

  /**
   * Cancel all jobs
   */
  cancelAllJobs(): void {
    for (const jobId of this.jobs.keys()) {
      this.cancelJob(jobId);
    }
  }

  /**
   * Get all scheduled jobs
   */
  getJobs(): string[] {
    return Array.from(this.jobs.keys());
  }
}

/**
 * Load scheduled jobs from environment or config
 */
export function loadScheduledJobs(): ScheduledJob[] {
  // In production, load from config file or environment variables
  // For now, return empty array - jobs should be configured manually
  const jobs: ScheduledJob[] = [];

  // Example: Daily scraping at 2 AM UTC
  // jobs.push({
  //   source: SOURCES.ALLRECIPES,
  //   urls: ['https://www.allrecipes.com/recipe/...'],
  //   schedule: '0 2 * * *', // Daily at 2 AM
  //   enabled: false, // Disabled by default
  // });

  return jobs;
}

/**
 * Start scheduler with configured jobs
 */
export function startScheduler(): RecipeScraperScheduler {
  const scheduler = new RecipeScraperScheduler();
  const jobs = loadScheduledJobs();

  jobs.forEach((job, index) => {
    const jobId = `job-${index + 1}`;
    scheduler.scheduleJob(jobId, job);
  });

  scraperLogger.info(`Scheduler started with ${jobs.length} jobs`);
  return scheduler;
}
