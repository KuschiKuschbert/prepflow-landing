/**
 * Type definitions for Comprehensive Scraper components
 */

export interface ScrapedRecipe {
  id: string;
  recipe_name: string;
  source: string;
  source_url: string;
  description?: string;
  ingredients: Array<{ name: string; original_text: string }>;
  instructions: string[];
  yield?: number;
  yield_unit?: string;
  category?: string;
  cuisine?: string;
  image_url?: string;
  scraped_at?: string;
  updated_at?: string;
}

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
