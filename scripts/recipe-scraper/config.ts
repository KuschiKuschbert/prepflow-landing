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
  SERIOUS_EATS: 'serious-eats',
  FOOD52: 'food52',
  SIMPLY_RECIPES: 'simply-recipes',
  SMITTEN_KITCHEN: 'smitten-kitchen',
  THE_KITCHN: 'the-kitchn',
  DELISH: 'delish',
} as const;

export type SourceType = (typeof SOURCES)[keyof typeof SOURCES];

/**
 * Rating Filter Configuration
 * Controls which recipes are saved based on their rating
 *
 * Rating Threshold: 97.5% minimum
 * - For star ratings (0-5 scale): 4.875/5.0 stars = 97.5%
 * - For percentage ratings (0-100 scale): 97.5% = 97.5
 */
export const RATING_CONFIG = {
  DEFAULT_MIN_RATING: 4.875, // 97.5% threshold (4.875/5.0 stars)
  DEFAULT_MIN_RATING_PERCENTAGE: 97.5, // 97.5% for percentage-based ratings (0-100 scale)
  DEFAULT_INCLUDE_UNRATED: true, // Include professional sites without ratings

  // Per-source configuration (optional overrides)
  SOURCE_CONFIG: {
    allrecipes: { minRating: 4.875, includeUnrated: false }, // 97.5% threshold
    // 'bbc-good-food': { minRating: 4.875, includeUnrated: true }, // REMOVED - Terms of Service violation
    'food-network': { minRating: 4.875, includeUnrated: false }, // 97.5% threshold
    'recipe-nlg': { minRating: 0, includeUnrated: true }, // Dataset source, include all
    epicurious: { minRating: 4.875, includeUnrated: false }, // 97.5% threshold
    'bon-appetit': { minRating: 0, includeUnrated: true }, // Professional site, no ratings
    tasty: { minRating: 4.875, includeUnrated: false }, // 97.5% threshold (handles percentage ratings)
    'serious-eats': { minRating: 0, includeUnrated: true }, // Professional site, no ratings
    food52: { minRating: 4.875, includeUnrated: false }, // 97.5% threshold
    'simply-recipes': { minRating: 4.875, includeUnrated: false }, // 97.5% threshold
    'smitten-kitchen': { minRating: 0, includeUnrated: true }, // Blog, no ratings
    'the-kitchn': { minRating: 0, includeUnrated: true }, // Professional site, no ratings
    delish: { minRating: 4.875, includeUnrated: false }, // 97.5% threshold
  } as Record<SourceType | string, { minRating: number; includeUnrated: boolean }>,
};
