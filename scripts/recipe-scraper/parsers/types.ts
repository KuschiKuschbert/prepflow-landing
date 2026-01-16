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

// ============================================================================
// JSON-LD Recipe Types (Schema.org Recipe structured data)
// ============================================================================

/**
 * JSON-LD Person or Organization author
 */
export interface JSONLDAuthor {
  '@type'?: 'Person' | 'Organization' | string;
  name?: string;
  url?: string;
}

/**
 * JSON-LD HowToStep instruction
 */
export interface JSONLDHowToStep {
  '@type'?: 'HowToStep' | 'HowToSection' | string;
  text?: string;
  name?: string;
  itemListElement?: JSONLDHowToStep[];
}

/**
 * JSON-LD ImageObject
 */
export interface JSONLDImageObject {
  '@type'?: 'ImageObject' | string;
  url?: string;
  contentUrl?: string;
}

/**
 * JSON-LD AggregateRating
 */
export interface JSONLDAggregateRating {
  '@type'?: 'AggregateRating' | string;
  ratingValue?: number | string;
  ratingCount?: number | string;
  reviewCount?: number | string;
}

/**
 * JSON-LD Recipe structured data from schema.org
 * Used for parsing recipe data from websites
 */
export interface JSONLDRecipe {
  '@type'?: string | string[];
  '@context'?: string;
  name?: string;
  headline?: string; // Some sites use headline instead of name
  description?: string;
  url?: string;
  image?: string | string[] | JSONLDImageObject | JSONLDImageObject[];
  author?: string | JSONLDAuthor | JSONLDAuthor[];
  datePublished?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string | number | string[];
  recipeCategory?: string | string[];
  recipeCuisine?: string | string[];
  recipeIngredient?: string[];
  recipeInstructions?: string | string[] | JSONLDHowToStep | JSONLDHowToStep[];
  aggregateRating?: JSONLDAggregateRating;
  ratingValue?: number | string;
  nutrition?: Record<string, unknown>;
  keywords?: string | string[];
  cookingMethod?: { temperature?: unknown } | string;
  temperature?: unknown;
  articleBody?: string;
  [key: string]: unknown; // Allow additional properties
}

/**
 * Type guard to check if an item is a Recipe
 */
export function isJSONLDRecipe(item: unknown): item is JSONLDRecipe {
  if (typeof item !== 'object' || item === null) return false;
  const obj = item as Record<string, unknown>;
  const types = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
  return types.includes('Recipe');
}
