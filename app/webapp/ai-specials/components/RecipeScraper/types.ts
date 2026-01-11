/**
 * Type definitions for Comprehensive Scraper components
 */

export interface ComprehensiveSourceStatus {
  discovered: number;
  scraped: number;
  failed: number;
  remaining: number;
  progressPercent: number;
  estimatedTimeRemaining?: number;
  isComplete: boolean;
}

export interface ComprehensiveJobStatus {
  isRunning: boolean;
  sources: Record<string, ComprehensiveSourceStatus>;
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

export interface ComprehensiveScraperSectionProps {
  comprehensiveScraping: boolean;
  comprehensiveStatus: ComprehensiveJobStatus | null;
  onStartComprehensive: () => void;
  onStopComprehensive?: () => void;
  onResumeComprehensive?: () => void;
  onRefreshStatus?: () => void;
}
