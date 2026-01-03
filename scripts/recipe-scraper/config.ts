/**
 * Scraper Configuration
 * Configuration for recipe scraping
 */

import { ScraperConfig } from './parsers/types';

export const DEFAULT_CONFIG: ScraperConfig = {
  delayBetweenRequests: 1000, // 1 second (optimized from 2s - adaptive rate limiting will increase if needed)
  maxRetries: 5, // Increased from 3 to 5 for better reliability
  timeout: 60000, // Increased from 30 seconds to 60 seconds for slow sites
  userAgent: 'PrepFlow Recipe Scraper (contact: hello@prepflow.org)',
  respectRobotsTxt: true,
  rateLimitRetryDelay: 60000, // 60 seconds delay after 429 rate limit errors
};

export const STORAGE_PATH = 'data/recipe-database';

export const SOURCES = {
  ALLRECIPES: 'allrecipes',
  BBC_GOOD_FOOD: 'bbc-good-food', // DISABLED - Terms of Service violation (see docs/BBC_GOOD_FOOD_LEGAL_ANALYSIS.md)
  FOOD_NETWORK: 'food-network',
  RECIPE_NLG: 'recipe-nlg',
  EPICURIOUS: 'epicurious',
  BON_APPETIT: 'bon-appetit',
  TASTY: 'tasty',
} as const;

export type SourceType = (typeof SOURCES)[keyof typeof SOURCES];

/**
 * Rating Filter Configuration
 * Controls which recipes are saved based on their rating
 */
export const RATING_CONFIG = {
  DEFAULT_MIN_RATING: 4.75, // 95% threshold (4.75/5.0 stars)
  DEFAULT_INCLUDE_UNRATED: true, // Include professional sites without ratings

  // Per-source configuration (optional overrides)
  SOURCE_CONFIG: {
    'allrecipes': { minRating: 4.75, includeUnrated: false },
    // 'bbc-good-food': { minRating: 4.75, includeUnrated: true }, // REMOVED - Terms of Service violation
    'food-network': { minRating: 4.75, includeUnrated: false },
    'recipe-nlg': { minRating: 0, includeUnrated: true }, // Dataset source, include all
    // Future sources
    'epicurious': { minRating: 4.75, includeUnrated: false },
    'bon-appetit': { minRating: 0, includeUnrated: true }, // Professional site, no ratings
    'tasty': { minRating: 4.75, includeUnrated: false },
  } as Record<SourceType | string, { minRating: number; includeUnrated: boolean }>,
};
