/**
 * Recipe Scraper Core Types (Migrated from scripts)
 */

import { HelperRecipeIngredient, ScrapedRecipe } from '../../types/scraped-recipe';
import { SOURCES } from './config';

export { SOURCES } from './config';

export type { ScrapedRecipe };
export type RecipeIngredient = HelperRecipeIngredient;

export type SourceType = (typeof SOURCES)[keyof typeof SOURCES];

export interface ScraperConfig {
  delayBetweenRequests: number; // Milliseconds
  maxRetries: number;
  timeout: number; // Milliseconds
  userAgent: string;
  respectRobotsTxt: boolean;
  rateLimitRetryDelay?: number; // Milliseconds
}

export interface ScrapeResult {
  success: boolean;
  recipe?: ScrapedRecipe;
  error?: string;
  source: string;
  url: string;
}

export interface RecipeUrlWithRating {
  url: string;
  rating?: number;
  ratingCount?: number;
}

// JSON-LD interfaces
export interface JSONLDAuthor {
  '@type'?: 'Person' | 'Organization' | string;
  name?: string;
  url?: string;
}

export interface JSONLDHowToStep {
  '@type'?: 'HowToStep' | 'HowToSection' | string;
  text?: string;
  name?: string;
  itemListElement?: JSONLDHowToStep[];
}

export interface JSONLDImageObject {
  '@type'?: 'ImageObject' | string;
  url?: string;
  contentUrl?: string;
}

export interface JSONLDAggregateRating {
  '@type'?: 'AggregateRating' | string;
  ratingValue?: number | string;
  ratingCount?: number | string;
  reviewCount?: number | string;
}

export interface JSONLDRecipe {
  '@type'?: string | string[];
  '@context'?: string;
  name?: string;
  headline?: string;
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
  [key: string]: unknown;
}

export function isJSONLDRecipe(item: unknown): item is JSONLDRecipe {
  if (typeof item !== 'object' || item === null) return false;
  const obj = item as Record<string, unknown>;
  const types = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
  return types.includes('Recipe');
}
