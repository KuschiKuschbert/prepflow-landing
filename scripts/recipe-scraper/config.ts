/**
 * Scraper Configuration
 * Configuration for recipe scraping
 */

import { ScraperConfig } from './parsers/types';

export const DEFAULT_CONFIG: ScraperConfig = {
  delayBetweenRequests: 2000, // 2 seconds
  maxRetries: 5, // Increased from 3 to 5 for better reliability
  timeout: 60000, // Increased from 30 seconds to 60 seconds for slow sites
  userAgent: 'PrepFlow Recipe Scraper (contact: hello@prepflow.org)',
  respectRobotsTxt: true,
  rateLimitRetryDelay: 60000, // 60 seconds delay after 429 rate limit errors
};

export const STORAGE_PATH = 'data/recipe-database';

export const SOURCES = {
  ALLRECIPES: 'allrecipes',
  BBC_GOOD_FOOD: 'bbc-good-food',
  FOOD_NETWORK: 'food-network',
  RECIPE_NLG: 'recipe-nlg',
} as const;

export type SourceType = (typeof SOURCES)[keyof typeof SOURCES];
