/**
 * Base Scraper
 * Abstract base class for all recipe scrapers
 */

import axios, { AxiosInstance } from 'axios';
import { DEFAULT_CONFIG } from '../config';
import { normalizeRecipe } from '../parsers/recipe-normalizer';
import { validateRecipe } from '../parsers/schema-validator';
import { RecipeUrlWithRating, ScrapedRecipe, ScraperConfig, ScrapeResult } from '../parsers/types';
import {
  categorizeError,
  getRetryDelay,
  logErrorCategory,
  shouldSkipPermanently,
} from '../utils/error-categorizer';
import { scraperLogger } from '../utils/logger';
import { RateLimiter } from '../utils/rate-limiter';
import { getCrawlDelay, isUrlAllowed } from '../utils/robots-checker';

export abstract class BaseScraper {
  protected config: ScraperConfig;
  protected rateLimiter: RateLimiter;
  protected httpClient: AxiosInstance;
  protected source: string;

  constructor(source: string, config: Partial<ScraperConfig> = {}) {
    this.source = source;
    this.config = { ...DEFAULT_CONFIG, ...config };
    // Allow up to 3 concurrent requests before enforcing delays (matches CONCURRENT_REQUESTS_PER_SOURCE)
    this.rateLimiter = new RateLimiter(this.config.delayBetweenRequests, 3);
    this.httpClient = axios.create({
      timeout: this.config.timeout,
      headers: {
        'User-Agent': this.config.userAgent,
      },
    });
  }

  /**
   * Extract HTTP status code from axios error
   */
  private extractHttpStatus(error: unknown): number | null {
    if (axios.isAxiosError(error)) {
      return error.response?.status ?? null;
    }
    return null;
  }

  /**
   * Create error message with HTTP status code if available
   */
  private createErrorMessage(error: unknown, statusCode: number | null): string {
    const baseMessage = error instanceof Error ? error.message : String(error);
    if (statusCode) {
      return `HTTP ${statusCode}: ${baseMessage}`;
    }
    return baseMessage;
  }

  /**
   * Fetch a page and return HTML content
   */
  protected async fetchPage(url: string): Promise<string> {
    // Check robots.txt if enabled
    if (this.config.respectRobotsTxt) {
      const allowed = await isUrlAllowed(url, this.config.userAgent);
      if (!allowed) {
        const error = new Error(`URL disallowed by robots.txt: ${url}`);
        logErrorCategory(error, url);
        throw error;
      }

      // Get crawl delay from robots.txt
      const crawlDelay = await getCrawlDelay(url, this.config.userAgent);
      if (crawlDelay && crawlDelay > this.config.delayBetweenRequests) {
        scraperLogger.info(`Using crawl delay from robots.txt: ${crawlDelay}ms`);
        await new Promise(resolve => setTimeout(resolve, crawlDelay));
      }
    }

    // Rate limiting
    await this.rateLimiter.wait();

    // Fetch with retries using error categorization
    let lastError: Error | null = null;
    let lastStatusCode: number | null = null;
    const maxRetries = this.config.maxRetries;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        scraperLogger.debug(`Fetching ${url} (attempt ${attempt}/${maxRetries})`);
        const response = await this.httpClient.get(url);
        return response.data;
      } catch (error) {
        // Extract HTTP status code from axios error
        const statusCode = this.extractHttpStatus(error);
        lastStatusCode = statusCode;

        // Create error with status code
        const errorMessage = this.createErrorMessage(error, statusCode);
        lastError = new Error(errorMessage);

        // Categorize error to determine retry strategy
        const errorCategory = categorizeError(error);
        logErrorCategory(error, url);

        // Check if we should skip permanently (404, 403, etc.)
        if (shouldSkipPermanently(error)) {
          scraperLogger.warn(`Skipping permanently: ${url} - ${errorCategory.reason}`);
          throw lastError;
        }

        // Check if we should retry
        if (!errorCategory.isRetryable || attempt >= maxRetries) {
          if (attempt >= maxRetries) {
            scraperLogger.error(`Request failed after ${maxRetries} attempts`, {
              error: errorMessage,
              url,
              statusCode,
            });
          }
          throw lastError;
        }

        // Calculate retry delay based on error category
        const retryDelay = getRetryDelay(error, attempt, 1000);

        // Special handling for rate limit errors (429)
        if (statusCode === 429 && this.config.rateLimitRetryDelay) {
          const rateLimitDelay = this.config.rateLimitRetryDelay;
          scraperLogger.warn(
            `Rate limit (429) detected, waiting ${rateLimitDelay}ms before retry: ${url}`,
          );
          await new Promise(resolve => setTimeout(resolve, rateLimitDelay));
        } else {
          scraperLogger.warn(
            `Request failed, retrying in ${retryDelay}ms (attempt ${attempt}/${maxRetries}): ${errorCategory.reason}`,
            {
              error: errorMessage,
              url,
              statusCode,
            },
          );
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    // Should not reach here, but handle it just in case
    const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
    scraperLogger.error(`Failed to fetch ${url} after ${maxRetries} attempts`, {
      error: errorMessage,
      url,
      statusCode: lastStatusCode,
    });
    throw new Error(`Failed to fetch ${url} after ${maxRetries} attempts: ${errorMessage}`);
  }

  /**
   * Parse a recipe from HTML content
   * Must be implemented by subclasses
   */
  protected abstract parseRecipe(html: string, url: string): Partial<ScrapedRecipe> | null;

  /**
   * Validate and normalize a recipe
   */
  protected validateAndNormalize(recipe: Partial<ScrapedRecipe>): ScrapedRecipe | null {
    // Normalize first
    const normalized = normalizeRecipe(recipe);

    // Validate
    const validation = validateRecipe(normalized);
    if (!validation.success || !validation.recipe) {
      scraperLogger.error(`Recipe validation failed:`, validation.error);
      return null;
    }

    return validation.recipe;
  }

  /**
   * Scrape a single recipe URL
   */
  async scrapeRecipe(url: string): Promise<ScrapeResult> {
    try {
      scraperLogger.info(`Scraping recipe from ${this.source}: ${url}`);

      // Fetch page
      const html = await this.fetchPage(url);

      // Parse recipe (try traditional methods first)
      let parsed = this.parseRecipe(html, url);

      // AI Fallback: If traditional parsing fails, try AI extraction (FREE)
      if (!parsed) {
        const { getAIExtractor } = await import('../utils/ai-extractor');
        const aiExtractor = getAIExtractor();

        if (aiExtractor.isEnabled()) {
          scraperLogger.info(
            `[${this.source}] Traditional parsing failed, trying FREE AI extraction...`,
          );
          parsed = await aiExtractor.extractRecipe(html, url);

          if (parsed) {
            scraperLogger.info(`[${this.source}] AI extraction succeeded for ${url}`);
          } else {
            scraperLogger.debug(`[${this.source}] AI extraction also failed for ${url}`);
          }
        }
      }

      if (!parsed) {
        return {
          success: false,
          error: 'Failed to parse recipe (tried traditional and AI methods)',
          source: this.source,
          url,
        };
      }

      // Safety validation: ensure required fields are non-empty
      if (!parsed.recipe_name || parsed.recipe_name.trim().length === 0) {
        scraperLogger.warn(`Recipe name is empty for ${url}, using fallback`);
        parsed.recipe_name = 'Untitled Recipe';
      }

      if (!parsed.instructions || parsed.instructions.length === 0) {
        scraperLogger.warn(`No instructions found for ${url}`);
        return {
          success: false,
          error: 'No instructions found',
          source: this.source,
          url,
        };
      }

      if (!parsed.ingredients || parsed.ingredients.length === 0) {
        scraperLogger.warn(`No ingredients found for ${url}`);
        return {
          success: false,
          error: 'No ingredients found',
          source: this.source,
          url,
        };
      }

      // Ensure all ingredients have non-empty names
      parsed.ingredients = parsed.ingredients.map(ing => ({
        ...ing,
        name: (ing.name && ing.name.trim()) || ing.original_text || 'Unknown Ingredient',
      }));

      // Add source metadata
      parsed.source = this.source;
      parsed.source_url = url;
      parsed.scraped_at = new Date().toISOString();

      // Validate and normalize
      const recipe = this.validateAndNormalize(parsed);
      if (!recipe) {
        return {
          success: false,
          error: 'Recipe validation failed',
          source: this.source,
          url,
        };
      }

      scraperLogger.info(`Successfully scraped recipe: ${recipe.recipe_name}`);
      return {
        success: true,
        recipe,
        source: this.source,
        url,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      scraperLogger.error(`Error scraping recipe from ${url}:`, errorMessage);
      return {
        success: false,
        error: errorMessage,
        source: this.source,
        url,
      };
    }
  }

  /**
   * Get recipe URLs to scrape (limited)
   * Must be implemented by subclasses for discovery
   */
  abstract getRecipeUrls(limit?: number): Promise<string[]>;

  /**
   * Get ALL recipe URLs (comprehensive, no limit)
   * Must be implemented by subclasses for comprehensive discovery
   * Should use sitemap parsing first, then fallback to pagination
   */
  abstract getAllRecipeUrls(): Promise<string[]>;

  /**
   * Get ALL recipe URLs with ratings from listing pages (for pre-filtering optimization)
   * Default implementation calls getAllRecipeUrls() and returns without ratings.
   * Scrapers can override this to extract ratings from listing/card elements,
   * which allows filtering out low-rated recipes BEFORE downloading full pages.
   *
   * Expected ~90% efficiency gain for user-rated sites when implemented.
   */
  async getAllRecipeUrlsWithRatings(): Promise<RecipeUrlWithRating[]> {
    // Default: just return URLs without ratings (no optimization)
    const urls = await this.getAllRecipeUrls();
    return urls.map(url => ({ url }));
  }

  /**
   * Parse ingredient name from ingredient text
   * Extracts the actual ingredient name by removing quantities, measurements, and descriptors
   * Examples:
   *   "1 ½\" piece ginger, peeled, finely grated" → "Ginger"
   *   "3 Tbsp. olive oil, plus more" → "Olive Oil"
   *   "2 cups all-purpose flour" → "All-purpose Flour"
   */
  protected parseIngredientName(ingredientText: string): string {
    if (!ingredientText || ingredientText.trim().length === 0) {
      return ingredientText;
    }

    // First, split on commas to get the main ingredient (before preparation notes)
    // e.g., "1 cup flour, sifted" → "1 cup flour"
    const mainPart = ingredientText.split(',')[0].trim();

    // Common measurement units and words to remove (with and without periods)
    const measurementUnits = [
      'tbsp',
      'tablespoon',
      'tablespoons',
      'tbsp.',
      'tsp',
      'teaspoon',
      'teaspoons',
      'tsp.',
      'cup',
      'cups',
      'c.',
      'c',
      'fl',
      'fl.',
      'oz',
      'ounce',
      'ounces',
      'oz.',
      'lb',
      'pound',
      'pounds',
      'lb.',
      'ml',
      'milliliter',
      'milliliters',
      'ml.',
      'l',
      'liter',
      'liters',
      'l.',
      'g',
      'gram',
      'grams',
      'g.',
      'kg',
      'kilogram',
      'kilograms',
      'kg.',
      'piece',
      'pieces',
      'pcs',
      'pc',
      'whole',
      'halves',
      'half',
      'clove',
      'cloves',
      'head',
      'heads',
      'bunch',
      'bunches',
      'can',
      'cans',
      'package',
      'packages',
      'pack',
      'packs',
      'bottle',
      'bottles',
      'jar',
      'jars',
      'box',
      'boxes',
      'dash',
      'pinch',
      'pinches',
      'sprinkle',
      'sprinkles',
      'slice',
      'slices',
      'strip',
      'strips',
      'chunk',
      'chunks',
      'plus',
      'more',
      'optional',
      'divided',
      'for',
      'garnish',
    ];

    // Handle parentheses - take content before parentheses as main ingredient
    // e.g., "matcha (green tea powder)" → "matcha"
    const beforeParentheses = mainPart.split('(')[0].trim();

    // Split into words and clean
    let words = beforeParentheses
      .split(/\s+/)
      .map(w =>
        w
          .trim()
          .toLowerCase()
          .replace(/[.,;:!?]+$/, ''),
      ) // Remove trailing punctuation
      .filter(w => w.length > 0);

    // Remove leading quantities (numbers, fractions including Unicode, measurements)
    while (words.length > 0) {
      const first = words[0];
      // Check if it's a number, fraction (including Unicode like ¾), or measurement unit
      if (
        /^\d+$/.test(first) || // Pure number
        /^\d+\/\d+$/.test(first) || // Fraction like "1/2"
        /^\d+\.\d+$/.test(first) || // Decimal like "1.5"
        /^[\d\s\/\.]+$/.test(first) || // Mixed like "1 ½" or "1.5"
        /^[\u00BC-\u00BE\u2150-\u215E]+$/.test(first) || // Unicode fractions (¼, ½, ¾, etc.)
        /^[\d\u00BC-\u00BE\u2150-\u215E]+$/.test(first) || // Number + Unicode fraction like "1¾"
        measurementUnits.includes(first) ||
        first.includes('"') || // Inches like 1 ½"
        first.includes("'") // Feet
      ) {
        words.shift();
      } else {
        break;
      }
    }

    // Remove measurement units that might be in the middle
    words = words.filter(w => !measurementUnits.includes(w));

    // Remove common descriptors that come before the ingredient
    // But be careful with compound ingredients like "black pepper" or "all-purpose flour"
    const descriptors = [
      'fresh',
      'freshly',
      'dried',
      'frozen',
      'canned',
      'whole',
      'chopped',
      'diced',
      'minced',
      'sliced',
      'grated',
      'peeled',
      'seeded',
      'stemmed',
      'boneless',
      'skinless',
      'large',
      'small',
      'medium',
      'extra',
      'fine',
      'coarse',
      'powdered',
      'raw',
      'cooked',
      'unsalted',
      'salted',
      'sweet',
      'sour',
      'hot',
      'mild',
      'cubed',
      'torn',
      'cut',
      'bite-size',
      'pieces',
    ];

    // Special handling: "ground" should only be removed if it's standalone
    // "ground black pepper" → keep "black pepper", but "ground beef" → keep "beef"
    // For now, we'll be conservative and only remove "ground" if it's clearly a descriptor

    // Remove descriptors from the beginning (but keep compound descriptors like "all-purpose")
    let startIdx = 0;
    while (startIdx < words.length) {
      const word = words[startIdx];
      // Special handling for "ground": remove it unless it's part of a compound like "ground black pepper"
      if (word === 'ground' && startIdx + 1 < words.length) {
        const nextWord = words[startIdx + 1];
        const colorWords = ['black', 'white', 'red', 'green', 'yellow', 'brown'];
        if (colorWords.includes(nextWord)) {
          // Skip "ground" but keep the color + ingredient (e.g., "black pepper")
          startIdx++;
          break;
        } else {
          // "ground" is a descriptor (e.g., "ground beef" → "beef")
          startIdx++;
          continue;
        }
      }
      if (descriptors.includes(word)) {
        startIdx++;
      } else {
        break;
      }
    }
    words = words.slice(startIdx);

    // Take up to 3 words as the ingredient name (usually 1-2 words)
    // This handles cases like "olive oil", "all-purpose flour", "red bell pepper"
    const nameWords = words.slice(0, 3);

    if (nameWords.length === 0) {
      // If we removed everything, fall back to original text (cleaned)
      return mainPart.trim();
    }

    // Capitalize first letter of each word for better readability
    const name = nameWords
      .map(w => {
        // Handle hyphenated words like "all-purpose"
        if (w.includes('-')) {
          return w
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('-');
        }
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(' ');

    // Final safety check: ensure we never return an empty string
    if (name.trim().length === 0) {
      // Fallback to original text (cleaned)
      return mainPart.trim() || ingredientText.trim();
    }

    return name;
  }

  /**
   * Parse rating from various formats
   */
  protected parseRating(rating: any): number | undefined {
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') {
      const parsed = parseFloat(rating);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  /**
   * Parse author from various formats
   */
  protected parseAuthor(author: any): string | undefined {
    if (!author) return undefined;
    if (typeof author === 'string') return author;
    if (Array.isArray(author) && author.length > 0) {
      const firstAuthor = author[0];
      return typeof firstAuthor === 'string' ? firstAuthor : firstAuthor.name;
    }
    if (author.name) return author.name;
    return undefined;
  }

  /**
   * Parse cooking temperature from JSON-LD or text
   * Extracts temperature from various formats: "350°F", "180°C", "350 F", etc.
   */
  protected parseTemperature(temperatureData: any): {
    temperature_celsius?: number;
    temperature_fahrenheit?: number;
    temperature_unit?: 'celsius' | 'fahrenheit';
  } {
    if (!temperatureData) return {};

    // Handle string formats like "350°F", "180°C", "350 F", "180 C"
    if (typeof temperatureData === 'string') {
      const tempStr = temperatureData.trim();

      // Match patterns like "350°F", "180°C", "350 F", "180 C"
      const fahrenheitMatch = tempStr.match(/(\d+)\s*°?\s*F/i);
      const celsiusMatch = tempStr.match(/(\d+)\s*°?\s*C/i);

      if (fahrenheitMatch) {
        const fahrenheit = parseInt(fahrenheitMatch[1], 10);
        const celsius = Math.round((fahrenheit - 32) * (5 / 9));
        return {
          temperature_fahrenheit: fahrenheit,
          temperature_celsius: celsius,
          temperature_unit: 'fahrenheit',
        };
      }

      if (celsiusMatch) {
        const celsius = parseInt(celsiusMatch[1], 10);
        const fahrenheit = Math.round(celsius * (9 / 5) + 32);
        return {
          temperature_celsius: celsius,
          temperature_fahrenheit: fahrenheit,
          temperature_unit: 'celsius',
        };
      }
    }

    // Handle object format from JSON-LD (e.g., { "@type": "Temperature", "value": 350, "unit": "F" })
    if (typeof temperatureData === 'object') {
      const value = temperatureData.value || temperatureData.temperature;
      const unit = (temperatureData.unit || temperatureData.unitText || '').toLowerCase();

      if (typeof value === 'number') {
        if (unit.includes('f') || unit.includes('fahrenheit')) {
          const celsius = Math.round((value - 32) * (5 / 9));
          return {
            temperature_fahrenheit: value,
            temperature_celsius: celsius,
            temperature_unit: 'fahrenheit',
          };
        } else if (unit.includes('c') || unit.includes('celsius')) {
          const fahrenheit = Math.round(value * (9 / 5) + 32);
          return {
            temperature_celsius: value,
            temperature_fahrenheit: fahrenheit,
            temperature_unit: 'celsius',
          };
        }
      }
    }

    // Handle number (assume Fahrenheit if no unit specified, as it's more common in recipes)
    if (typeof temperatureData === 'number') {
      const celsius = Math.round((temperatureData - 32) * (5 / 9));
      return {
        temperature_fahrenheit: temperatureData,
        temperature_celsius: celsius,
        temperature_unit: 'fahrenheit',
      };
    }

    return {};
  }

  /**
   * Parse instructions from JSON-LD or HTML
   * Handles all instruction formats including:
   * - Simple string arrays
   * - HowToStep objects with text, howToDirection, or itemListElement
   * - HowToSection objects containing multiple HowToStep objects
   * - Nested instruction structures
   *
   * Returns deduplicated array of instruction strings
   */
  protected parseInstructions(instructions: any): string[] {
    if (!instructions) return [];

    const result: string[] = [];
    const seen = new Set<string>(); // Track seen instructions to avoid duplicates

    // Handle array of instructions
    if (Array.isArray(instructions)) {
      for (const inst of instructions) {
        const parsed = this.extractInstructionText(inst);
        for (const text of parsed) {
          // Normalize text for comparison (trim, lowercase)
          const normalized = text.trim().toLowerCase();
          if (normalized.length > 0 && !seen.has(normalized)) {
            seen.add(normalized);
            result.push(text.trim()); // Keep original capitalization
          }
        }
      }
      return result;
    }

    // Handle single instruction object
    const parsed = this.extractInstructionText(instructions);
    for (const text of parsed) {
      const normalized = text.trim().toLowerCase();
      if (normalized.length > 0 && !seen.has(normalized)) {
        seen.add(normalized);
        result.push(text.trim());
      }
    }
    return result;
  }

  /**
   * Extract instruction text from a single instruction object
   * Handles HowToStep, HowToSection, and nested structures
   * Returns array of instruction strings (may contain duplicates - deduplication happens in parseInstructions)
   */
  private extractInstructionText(inst: any): string[] {
    if (!inst) return [];

    // Simple string
    if (typeof inst === 'string') {
      return inst.trim() ? [inst.trim()] : [];
    }

    // HowToStep or instruction object
    if (inst && typeof inst === 'object') {
      const texts: string[] = [];

      // Priority 1: Direct text property
      if (inst.text && typeof inst.text === 'string' && inst.text.trim().length > 0) {
        texts.push(inst.text.trim());
      }

      // Priority 2: howToDirection (common in structured data)
      if (
        inst.howToDirection &&
        typeof inst.howToDirection === 'string' &&
        inst.howToDirection.trim().length > 0
      ) {
        // Only add if different from text (avoid duplicates)
        if (!inst.text || inst.howToDirection.trim() !== inst.text.trim()) {
          texts.push(inst.howToDirection.trim());
        }
      }

      // Priority 3: itemListElement (nested steps within a step)
      // Extract these separately as they might be sub-steps
      if (inst.itemListElement && Array.isArray(inst.itemListElement)) {
        for (const item of inst.itemListElement) {
          const nested = this.extractInstructionText(item);
          texts.push(...nested);
        }
      }

      // Priority 4: name property (sometimes used for step titles)
      // Only use if we don't already have text from other sources
      if (
        texts.length === 0 &&
        inst.name &&
        typeof inst.name === 'string' &&
        inst.name.trim().length > 0
      ) {
        texts.push(inst.name.trim());
      }

      // Priority 5: Check for nested HowToStep or HowToSection
      // Only process if we haven't already extracted from text/howToDirection
      if (
        (inst['@type'] === 'HowToStep' || inst['@type'] === 'HowToSection') &&
        texts.length === 0
      ) {
        // If we already have text, don't re-extract from nested structure
        // This prevents duplication when both text and nested structure exist
        if (inst.itemListElement && Array.isArray(inst.itemListElement)) {
          for (const item of inst.itemListElement) {
            const nested = this.extractInstructionText(item);
            texts.push(...nested);
          }
        }
      }

      // Filter out empty strings and return
      return texts.filter(t => t.length > 0);
    }

    // Fallback: convert to string
    const str = String(inst).trim();
    return str ? [str] : [];
  }

  /**
   * Extract temperature from instruction strings
   * Searches through instructions for temperature patterns like "350°F", "180C", etc.
   * Returns structured temperature data (same format as parseTemperature)
   */
  protected extractTemperatureFromInstructions(instructions: any): {
    temperature_celsius?: number;
    temperature_fahrenheit?: number;
    temperature_unit?: 'celsius' | 'fahrenheit';
  } {
    if (!instructions) return {};

    // Use parseInstructions to extract all instruction text (handles all formats)
    const instructionTexts = this.parseInstructions(instructions);

    // Search for temperature patterns in instruction text
    const combinedText = instructionTexts.join(' ');
    const tempPatterns = [
      /(\d+)\s*°?\s*F\b/i, // Fahrenheit
      /(\d+)\s*°?\s*C\b/i, // Celsius
      /bake.*?(\d+)\s*°?\s*F/i, // "bake at 350°F"
      /bake.*?(\d+)\s*°?\s*C/i, // "bake at 180°C"
      /preheat.*?(\d+)\s*°?\s*F/i, // "preheat to 350°F"
      /preheat.*?(\d+)\s*°?\s*C/i, // "preheat to 180°C"
    ];

    for (const pattern of tempPatterns) {
      const match = combinedText.match(pattern);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = pattern.source.includes('C') ? 'C' : 'F';
        // Use parseTemperature to convert to structured format
        return this.parseTemperature(`${value}°${unit}`);
      }
    }

    return {};
  }
}
