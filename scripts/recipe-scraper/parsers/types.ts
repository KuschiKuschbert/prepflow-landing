/**
 * Recipe Scraper Types
 * Type definitions for scraped recipe data
 */

export interface ScrapedRecipe {
  id: string; // UUID or source-specific ID
  source: string; // Website name (e.g., "allrecipes", "bbc-good-food")
  source_url: string; // Original recipe URL
  recipe_name: string; // Recipe title
  description?: string; // Recipe description
  instructions: string[]; // Step-by-step instructions
  ingredients: RecipeIngredient[]; // Structured ingredients
  yield?: number; // Number of servings
  yield_unit?: string; // "servings", "portions", etc.
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string; // e.g., "main-course", "dessert"
  cuisine?: string; // e.g., "italian", "asian"
  dietary_tags?: string[]; // ["vegetarian", "vegan", "gluten-free"]
  image_url?: string; // Recipe image URL
  author?: string; // Recipe author/chef
  rating?: number; // 1-5 rating if available
  scraped_at: string; // ISO timestamp
  updated_at?: string; // Last update timestamp
}

export interface RecipeIngredient {
  name: string; // Ingredient name
  quantity?: number; // Numeric quantity
  unit?: string; // Unit of measurement
  notes?: string; // Additional notes (e.g., "chopped", "diced")
  original_text: string; // Original ingredient line from source
}

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
