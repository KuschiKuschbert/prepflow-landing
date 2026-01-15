/**
 * Recipe Scraper Types
 * Type definitions for scraped recipe data
 */

import { HelperRecipeIngredient, ScrapedRecipe } from '../../../types/scraped-recipe';

export type { ScrapedRecipe };
// Rename to match existing usage if needed, or update consumers.
// The existing code uses RecipeIngredient, so we alias it.
export type RecipeIngredient = HelperRecipeIngredient;

export interface ScraperConfig {
  delayBetweenRequests: number; // Milliseconds
  maxRetries: number;
  timeout: number; // Milliseconds
  userAgent: string;
  respectRobotsTxt: boolean;
  rateLimitRetryDelay?: number; // Milliseconds - delay after 429 rate limit errors
}

export interface ScrapeResult {
  success: boolean;
  recipe?: ScrapedRecipe;
  error?: string;
  source: string;
  url: string;
}

/**
 * Recipe URL with optional rating from listing page
 * Used for pre-filtering optimization - extract ratings from listing pages
 * to skip low-rated recipes before downloading full pages
 */
export interface RecipeUrlWithRating {
  url: string;
  rating?: number; // Rating from listing page (may be undefined if not shown)
  ratingCount?: number; // Number of ratings (optional)
}
