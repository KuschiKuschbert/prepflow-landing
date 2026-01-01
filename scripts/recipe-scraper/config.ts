/**
 * Scraper Configuration
 * Configuration for recipe scraping
 */

import { ScraperConfig } from './parsers/types';

export const DEFAULT_CONFIG: ScraperConfig = {
  delayBetweenRequests: 2000, // 2 seconds
  maxRetries: 3,
  timeout: 30000, // 30 seconds
  userAgent: 'PrepFlow Recipe Scraper (contact: hello@prepflow.org)',
  respectRobotsTxt: true,
};

export const STORAGE_PATH = 'data/recipe-database';

export const SOURCES = {
  ALLRECIPES: 'allrecipes',
  BBC_GOOD_FOOD: 'bbc-good-food',
  FOOD_NETWORK: 'food-network',
  RECIPE_NLG: 'recipe-nlg',
} as const;

export type SourceType = (typeof SOURCES)[keyof typeof SOURCES];
