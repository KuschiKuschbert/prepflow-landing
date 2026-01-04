#!/usr/bin/env node

/**
 * Estimate Scraping Time
 * Calculates rough time estimates for the comprehensive scraping job
 */

import * as fs from 'fs';
import * as path from 'path';
import { SOURCES } from './config';
import { STORAGE_PATH } from './config';
import { scraperLogger } from './utils/logger';

interface ProgressData {
  source: string;
  total: number;
  scraped: number;
  failed: number;
  filtered: number;
  lastUpdated?: string;
}

/**
 * Load progress for a source
 */
function loadProgress(source: string): ProgressData | null {
  const progressPath = path.join(STORAGE_PATH, '.progress', `${source}.json`);
  if (!fs.existsSync(progressPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(progressPath, 'utf-8');
    const data = JSON.parse(content);

    // Progress file format: { discovered: string[], scraped: string[], failed: Record<string, string> }
    const total = Array.isArray(data.discovered) ? data.discovered.length : 0;
    const scraped = Array.isArray(data.scraped) ? data.scraped.length : 0;
    const failed =
      data.failed && typeof data.failed === 'object' ? Object.keys(data.failed).length : 0;
    const filtered = typeof data.filtered === 'number' ? data.filtered : 0;

    return {
      source,
      total,
      scraped,
      failed,
      filtered,
      lastUpdated: data.lastUpdated,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Estimate time for scraping
 */
function estimateTime(
  remaining: number,
  recipesPerMinute: number = 30,
): {
  minutes: number;
  hours: number;
  days: number;
  formatted: string;
} {
  const totalMinutes = remaining / recipesPerMinute;
  const hours = totalMinutes / 60;
  const days = hours / 24;

  let formatted = '';
  if (days >= 1) {
    formatted = `${Math.round(days * 10) / 10} days`;
  } else if (hours >= 1) {
    formatted = `${Math.round(hours * 10) / 10} hours`;
  } else {
    formatted = `${Math.round(totalMinutes)} minutes`;
  }

  return {
    minutes: Math.round(totalMinutes),
    hours: Math.round(hours * 10) / 10,
    days: Math.round(days * 10) / 10,
    formatted,
  };
}

async function calculateEstimates() {
  scraperLogger.info('📊 Calculating scraping time estimates...\n');

  const sources = [
    SOURCES.ALLRECIPES,
    SOURCES.FOOD_NETWORK,
    SOURCES.EPICURIOUS,
    SOURCES.BON_APPETIT,
    SOURCES.TASTY,
  ];

  let totalRemaining = 0;
  let totalScraped = 0;
  let totalFailed = 0;
  let totalFiltered = 0;
  const sourceStats: Array<{
    source: string;
    total: number;
    scraped: number;
    remaining: number;
    failed: number;
    filtered: number;
    estimate: string;
  }> = [];

  // Conservative estimate: 30 recipes per minute (accounts for rate limiting, network delays, etc.)
  // This is based on:
  // - ~1-2 seconds per recipe (fetch + parse + save)
  // - Rate limiting delays (1-2 seconds between requests)
  // - Retry delays for failed requests
  const recipesPerMinute = 30;

  for (const source of sources) {
    const progress = loadProgress(source);
    if (!progress) {
      scraperLogger.warn(`⚠️  No progress data found for ${source}`);
      continue;
    }

    const remaining = progress.total - progress.scraped - progress.failed - progress.filtered;
    const estimate = estimateTime(remaining, recipesPerMinute);

    totalRemaining += remaining;
    totalScraped += progress.scraped;
    totalFailed += progress.failed;
    totalFiltered += progress.filtered;

    sourceStats.push({
      source,
      total: progress.total,
      scraped: progress.scraped,
      remaining,
      failed: progress.failed,
      filtered: progress.filtered,
      estimate: estimate.formatted,
    });
  }

  // Display results
  scraperLogger.info('📋 Per-Source Statistics:');
  scraperLogger.info('='.repeat(80));
  for (const stat of sourceStats) {
    const percentage = stat.total > 0 ? Math.round((stat.scraped / stat.total) * 100) : 0;
    scraperLogger.info(`\n${stat.source.toUpperCase()}:`);
    scraperLogger.info(`  Total recipes:     ${stat.total.toLocaleString()}`);
    scraperLogger.info(`  Scraped:          ${stat.scraped.toLocaleString()} (${percentage}%)`);
    scraperLogger.info(`  Remaining:        ${stat.remaining.toLocaleString()}`);
    scraperLogger.info(`  Failed:           ${stat.failed.toLocaleString()}`);
    scraperLogger.info(`  Filtered (rating): ${stat.filtered.toLocaleString()}`);
    scraperLogger.info(`  Estimated time:   ${stat.estimate}`);
  }

  // Calculate parallel time estimate (longest source determines total time)
  const maxSourceTime = Math.max(
    ...sourceStats.map(stat => {
      const estimate = estimateTime(stat.remaining, recipesPerMinute);
      return estimate.minutes;
    }),
    0,
  );
  const parallelEstimate = estimateTime(maxSourceTime * recipesPerMinute, recipesPerMinute);

  // Sequential estimate (sum of all sources - old method)
  const sequentialEstimate = estimateTime(totalRemaining, recipesPerMinute);

  const totalPercentage =
    totalScraped + totalFailed + totalFiltered > 0
      ? Math.round(
          ((totalScraped + totalFailed + totalFiltered) /
            (totalScraped + totalFailed + totalFiltered + totalRemaining)) *
            100,
        )
      : 0;

  scraperLogger.info('\n' + '='.repeat(80));
  scraperLogger.info('📊 OVERALL STATISTICS:');
  scraperLogger.info('='.repeat(80));
  scraperLogger.info(
    `Total recipes to scrape:  ${(totalScraped + totalFailed + totalFiltered + totalRemaining).toLocaleString()}`,
  );
  scraperLogger.info(`Already scraped:         ${totalScraped.toLocaleString()}`);
  scraperLogger.info(`Failed:                  ${totalFailed.toLocaleString()}`);
  scraperLogger.info(`Filtered (rating):      ${totalFiltered.toLocaleString()}`);
  scraperLogger.info(`Remaining:               ${totalRemaining.toLocaleString()}`);
  scraperLogger.info(`Progress:                ${totalPercentage}%`);
  scraperLogger.info(`\n⏱️  ESTIMATED TIME TO COMPLETE:`);
  scraperLogger.info(
    `   🚀 PARALLEL (current): ${parallelEstimate.formatted} (all sources simultaneously)`,
  );
  scraperLogger.info(
    `   📊 Sequential (old):   ${sequentialEstimate.formatted} (one source at a time)`,
  );
  scraperLogger.info(
    `   💡 Speed improvement:   ~${Math.round((1 - parallelEstimate.minutes / sequentialEstimate.minutes) * 100)}% faster with parallel processing`,
  );
  scraperLogger.info(`   (Based on ${recipesPerMinute} recipes/minute - conservative estimate)`);
  scraperLogger.info('\n📝 Notes:');
  scraperLogger.info('   - Estimate assumes continuous scraping without interruptions');
  scraperLogger.info('   - Actual time may vary based on network conditions and rate limiting');
  scraperLogger.info('   - Rating filter may reduce actual recipes saved');
  scraperLogger.info('   - Failed recipes will be retried, which may add time');
  scraperLogger.info('='.repeat(80));
}

calculateEstimates();
