/**
 * Recipe Scraper Types
 * Shared type definitions for scraped recipe data
 */

export interface HelperRecipeIngredient {
  name: string; // Ingredient name
  quantity?: number; // Numeric quantity
  unit?: string; // Unit of measurement
  notes?: string; // Additional notes (e.g., "chopped", "diced")
  original_text: string; // Original ingredient line from source
}

export interface ScrapedRecipe {
  id: string; // UUID or source-specific ID
  source: string; // Website name (e.g., "allrecipes", "bbc-good-food")
  source_url: string; // Original recipe URL
  recipe_name: string; // Recipe title
  description?: string; // Recipe description
  instructions: string[]; // Step-by-step instructions
  ingredients: HelperRecipeIngredient[]; // Structured ingredients
  yield?: number; // Number of servings
  yield_unit?: string; // "servings", "portions", etc.
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  temperature_celsius?: number; // Cooking/baking temperature in Celsius
  temperature_fahrenheit?: number; // Cooking/baking temperature in Fahrenheit
  temperature_unit?: 'celsius' | 'fahrenheit'; // Preferred unit
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
