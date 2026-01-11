/**
 * Hook for calculating scraper diagnostics
 */

import { useMemo } from 'react';
import type { ComprehensiveJobStatus } from '../types';

interface Diagnostics {
  isStuck: boolean;
  stuckReason?: string;
  healthStatus: 'healthy' | 'warning' | 'error';
  processingDuration?: number;
  lastError?: string;
  lastScrapedRecipe?: string;
}

export function useScraperDiagnostics(
  comprehensiveStatus: ComprehensiveJobStatus | null,
  isRunning: boolean,
): Diagnostics | null {
  return useMemo(() => {
    if (!comprehensiveStatus) return null;

    const now = Date.now();
    const startedAt = comprehensiveStatus.startedAt
      ? new Date(comprehensiveStatus.startedAt).getTime()
      : null;
    const lastUpdated = comprehensiveStatus.lastUpdated
      ? new Date(comprehensiveStatus.lastUpdated).getTime()
      : null;

    // Processing duration
    const processingDuration =
      startedAt && isRunning ? Math.floor((now - startedAt) / 1000) : undefined;

    // Check if stuck (no progress updates for > 5 minutes while running)
    const STUCK_THRESHOLD = 5 * 60 * 1000; // 5 minutes
    const isStuck = isRunning && lastUpdated && now - lastUpdated > STUCK_THRESHOLD ? true : false;
    const stuckReason = isStuck
      ? `No progress updates for ${Math.floor((now - lastUpdated!) / 60000)} minutes`
      : undefined;

    // Calculate health status based on error rate and progress
    const totalAttempts =
      (comprehensiveStatus.overall?.totalScraped || 0) +
      (comprehensiveStatus.overall?.totalFailed || 0);
    const errorRate =
      totalAttempts > 0 ? (comprehensiveStatus.overall?.totalFailed || 0) / totalAttempts : 0;
    const progressRate = comprehensiveStatus.overall?.overallProgressPercent || 0;

    let healthStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    if (errorRate > 0.5 || (isStuck && isRunning)) {
      healthStatus = 'error';
    } else if (
      errorRate > 0.2 ||
      (progressRate === 0 && isRunning && processingDuration && processingDuration > 300)
    ) {
      healthStatus = 'warning';
    }

    // Last error (would need to be tracked separately, for now use failed count as indicator)
    const lastError =
      comprehensiveStatus.overall?.totalFailed && comprehensiveStatus.overall.totalFailed > 0
        ? `${comprehensiveStatus.overall.totalFailed} recipes failed to scrape`
        : undefined;

    // Last scraped recipe (would need to be tracked separately, for now use total scraped)
    const lastScrapedRecipe =
      comprehensiveStatus.overall?.totalScraped && comprehensiveStatus.overall.totalScraped > 0
        ? `${comprehensiveStatus.overall.totalScraped} recipes scraped successfully`
        : undefined;

    return {
      isStuck,
      stuckReason,
      healthStatus,
      processingDuration,
      lastError,
      lastScrapedRecipe,
    };
  }, [comprehensiveStatus, isRunning]);
}
