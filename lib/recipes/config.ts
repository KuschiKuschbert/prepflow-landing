/**
 * Scraper Configuration (Migrated from scripts)
 */

import { ScraperConfig, SourceType } from './types';

export type { SourceType }; // Re-export for easier consumption by legacy-style imports

export const DEFAULT_CONFIG: ScraperConfig = {
  delayBetweenRequests: 1000,
  maxRetries: 5,
  timeout: 60000,
  userAgent: 'PrepFlow Recipe Scraper (contact: hello@prepflow.org)',
  respectRobotsTxt: true,
  rateLimitRetryDelay: 60000,
};

export const STORAGE_PATH = 'data/recipe-database';

export const SOURCES = {
  ALLRECIPES: 'allrecipes',
  BBC_GOOD_FOOD: 'bbc-good-food',
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
  FOOD_AND_WINE: 'foodandwine',
} as const;

export const RATING_CONFIG = {
  DEFAULT_MIN_RATING: 4.875,
  DEFAULT_MIN_RATING_PERCENTAGE: 97.5,
  DEFAULT_INCLUDE_UNRATED: true,

  SOURCE_CONFIG: {
    allrecipes: { minRating: 4.875, includeUnrated: false },
    'food-network': { minRating: 4.875, includeUnrated: false },
    'recipe-nlg': { minRating: 0, includeUnrated: true },
    epicurious: { minRating: 4.875, includeUnrated: false },
    'bon-appetit': { minRating: 0, includeUnrated: true },
    tasty: { minRating: 4.875, includeUnrated: false },
    'serious-eats': { minRating: 0, includeUnrated: true },
    food52: { minRating: 4.875, includeUnrated: false },
    'simply-recipes': { minRating: 4.875, includeUnrated: false },
    'smitten-kitchen': { minRating: 0, includeUnrated: true },
    'the-kitchn': { minRating: 0, includeUnrated: true },
    delish: { minRating: 4.875, includeUnrated: false },
    foodandwine: { minRating: 4.875, includeUnrated: false },
  } as Record<SourceType | string, { minRating: number; includeUnrated: boolean }>,
};
