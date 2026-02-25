/**
 * Statistics computation for ProgressTracker. Extracted to stay under 150-line util limit.
 */
import type { ProgressStatistics, ScrapingProgress } from '../progress-tracker';

export function computeProgressStatistics(
  progress: ScrapingProgress,
  startTime?: Date,
): ProgressStatistics {
  const totalDiscovered = progress.discovered.length;
  const totalScraped = progress.scraped.length;
  const remaining = totalDiscovered - totalScraped;
  const progressPercent =
    totalDiscovered > 0 ? Math.round((totalScraped / totalDiscovered) * 100) : 0;

  let estimatedTimeRemaining: number | undefined;
  let averageTimePerRecipe: number | undefined;

  if (remaining > 0) {
    const actualStartTime = startTime || new Date(progress.startedAt);
    if (totalScraped > 0) {
      const elapsedSeconds = (Date.now() - actualStartTime.getTime()) / 1000;
      if (elapsedSeconds > 0) {
        averageTimePerRecipe = elapsedSeconds / totalScraped;
        estimatedTimeRemaining = averageTimePerRecipe * remaining;
      }
    }
    if (estimatedTimeRemaining === undefined) estimatedTimeRemaining = remaining * 2;
  }

  return {
    totalDiscovered,
    totalScraped,
    totalFailed: Object.keys(progress.failed).length,
    remaining,
    progressPercent,
    estimatedTimeRemaining,
    averageTimePerRecipe,
  };
}
