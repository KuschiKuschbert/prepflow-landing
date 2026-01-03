/**
 * AI Recipe Extractor
 * Uses Hugging Face Inference API (FREE) for robust recipe extraction
 * Falls back to AI when traditional parsing methods fail
 *
 * Legal & Ethical:
 * - Only extracts publicly available recipe data
 * - Respects robots.txt (checked before AI extraction)
 * - Includes source attribution
 * - No personal data collection
 */

import { logger } from '@/lib/logger';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RecipeIngredient, ScrapedRecipe } from '../parsers/types';
import { scraperLogger } from './logger';

interface AIExtractorConfig {
  apiKey?: string; // Optional: for higher rate limits (free tier works without key)
  model?: string; // Hugging Face model ID (using free, lightweight models)
  timeout?: number;
  enabled?: boolean; // Feature flag
}

const DEFAULT_CONFIG: Required<AIExtractorConfig> = {
  // FREE: No API key needed for many models on Hugging Face (rate limited)
  // With API key: Higher rate limits, access to more models
  apiKey: process.env.HUGGINGFACE_API_KEY || '',
  // Using lightweight, free model optimized for instruction following
  // Alternatives tested: 'google/flan-t5-base' (free, fast), 'microsoft/phi-2' (better quality, may need key)
  model: 'google/flan-t5-base', // FREE: Works without API key, good for structured extraction
  timeout: 30000,
  // Enable only if explicitly enabled OR if API key is provided
  // FREE tier models are unreliable without API key (rate limits, availability)
  // Recommended: Get free API key from https://huggingface.co/settings/tokens
  enabled: process.env.ENABLE_AI_EXTRACTION === 'true' || !!process.env.HUGGINGFACE_API_KEY,
};

/**
 * AI Recipe Extractor using Hugging Face Inference API (FREE)
 *
 * Cost: FREE (uses direct REST API, no API key needed for many models)
 * Legal: Respects robots.txt, includes attribution, no personal data
 *
 * Uses direct REST API for maximum compatibility with free tier
 */
export class AIExtractor {
  private config: Required<AIExtractorConfig>;
  private apiUrl: string;

  constructor(config: Partial<AIExtractorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    // Use direct REST API endpoint (works without API key for many models)
    this.apiUrl = `https://api-inference.huggingface.co/models/${this.config.model}`;

    if (this.config.enabled) {
      scraperLogger.info('[AI Extractor] Initialized (FREE tier - direct REST API)');
    }
  }

  /**
   * Check if AI extraction is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Extract recipe data from HTML using AI (FREE)
   *
   * Uses Hugging Face Inference API (direct REST) with free models
   * Extracts structured recipe data when traditional parsing fails
   * FREE: Works without API key for many models (rate limited)
   */
  async extractRecipe(html: string, url: string): Promise<Partial<ScrapedRecipe> | null> {
    if (!this.config.enabled) {
      scraperLogger.debug('[AI Extractor] AI extraction is disabled');
      return null;
    }

    try {
      scraperLogger.info(`[AI Extractor] Attempting FREE AI extraction for ${url}`);

      // Step 1: Extract clean, structured text from HTML
      const { recipeText, recipeName, description } = this.extractRecipeText(html);

      if (!recipeText || recipeText.length < 50) {
        scraperLogger.warn('[AI Extractor] Insufficient text extracted from HTML');
        return null;
      }

      // Step 2: Use AI to extract structured data
      const recipeData = await this.extractStructuredData(recipeText, recipeName, description, url);

      if (!recipeData) {
        scraperLogger.warn('[AI Extractor] Failed to extract recipe data from AI');
        return null;
      }

      scraperLogger.info('[AI Extractor] Successfully extracted recipe data using FREE AI');
      return recipeData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Don't log as error if it's just a rate limit or model loading (expected with free tier)
      if (errorMessage.includes('503') || errorMessage.includes('loading')) {
        scraperLogger.debug(`[AI Extractor] Model temporarily unavailable: ${errorMessage}`);
      } else {
        logger.error('[AI Extractor] Error during AI extraction:', {
          error: errorMessage,
          url,
        });
        scraperLogger.error('[AI Extractor] Error:', errorMessage);
      }
      return null;
    }
  }

  /**
   * Extract recipe text from HTML using cheerio (same as our scrapers)
   * More reliable than regex-based extraction
   */
  private extractRecipeText(html: string): {
    recipeText: string;
    recipeName: string;
    description: string;
  } {
    const $ = cheerio.load(html);

    // Extract recipe name
    const recipeName =
      $('h1').first().text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      $('title').text().trim() ||
      '';

    // Extract description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('.recipe-description, .recipe-summary').first().text().trim() ||
      '';

    // Extract ingredients (prioritize structured lists)
    const ingredients: string[] = [];
    const ingredientSelectors = [
      'li[itemprop="recipeIngredient"]',
      '.ingredient, .ingredients-item',
      'ul.ingredients li, ol.ingredients li',
      '[class*="ingredient"] li',
    ];

    for (const selector of ingredientSelectors) {
      const found = $(selector)
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0 && text.length < 200);
      if (found.length > 0) {
        ingredients.push(...found);
        break;
      }
    }

    // Extract instructions
    const instructions: string[] = [];
    const instructionSelectors = [
      'li[itemprop="recipeInstructions"]',
      '.instruction, .step, .direction',
      'ol.instructions li, ul.instructions li',
      '[class*="instruction"] li, [class*="step"] li',
    ];

    for (const selector of instructionSelectors) {
      const found = $(selector)
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 0 && text.length < 500);
      if (found.length > 0) {
        instructions.push(...found);
        break;
      }
    }

    // Build structured text for AI
    const recipeText = [
      `Recipe Name: ${recipeName}`,
      description ? `Description: ${description}` : '',
      ingredients.length > 0 ? `Ingredients:\n${ingredients.map((ing, i) => `${i + 1}. ${ing}`).join('\n')}` : '',
      instructions.length > 0
        ? `Instructions:\n${instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    return { recipeText, recipeName, description };
  }

  /**
   * Extract structured recipe data using FREE Hugging Face Inference API (Direct REST)
   *
   * Uses direct REST API endpoint (works without API key for many models)
   * FREE: No API key needed, but rate limited
   * With API key: Higher rate limits
   */
  private async extractStructuredData(
    recipeText: string,
    recipeName: string,
    description: string,
    url: string,
  ): Promise<Partial<ScrapedRecipe> | null> {
    try {
      // Create prompt for structured extraction
      const prompt = this.createExtractionPrompt(recipeText);

      // Use direct REST API (works without API key for many models)
      // FREE: No API key needed, but rate limited
      const response = await axios.post(
        this.apiUrl,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 1500, // Enough for full recipe
            temperature: 0.1, // Low temperature for structured output
            return_full_text: false,
          },
        },
        {
          headers: {
            ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
            'Content-Type': 'application/json',
          },
          timeout: this.config.timeout,
        },
      );

      // Parse response (structure depends on model)
      // For text generation models, response is usually: { generated_text: "..." }
      // For some models: [{ generated_text: "..." }]
      let generatedText: string | null = null;

      if (Array.isArray(response.data)) {
        generatedText = response.data[0]?.generated_text || null;
      } else if (response.data.generated_text) {
        generatedText = response.data.generated_text;
      } else if (typeof response.data === 'string') {
        generatedText = response.data;
      }

      if (!generatedText) {
        scraperLogger.warn('[AI Extractor] No generated text in response');
        return null;
      }

      // Parse the AI response
      const recipeData = this.parseAIResponse(generatedText, recipeName, description, url);

      return recipeData;
    } catch (error: any) {
      // Handle common free-tier errors gracefully
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 503) {
          scraperLogger.debug('[AI Extractor] Model is loading (free tier - wait and retry)');
        } else if (status === 429) {
          scraperLogger.debug('[AI Extractor] Rate limit (free tier) - will retry later');
        } else if (status === 401) {
          scraperLogger.debug('[AI Extractor] Model requires API key (not free)');
        } else {
          scraperLogger.debug(`[AI Extractor] API error: ${status || error.message}`);
        }
      } else if (error?.message?.includes('loading')) {
        scraperLogger.debug('[AI Extractor] Model still loading');
      } else {
        scraperLogger.warn('[AI Extractor] Error:', error?.message || String(error));
      }
      return null;
    }
  }

  /**
   * Create extraction prompt for AI model
   * Optimized for instruction-following models
   */
  private createExtractionPrompt(recipeText: string): string {
    // Limit text to avoid token limits (free tier has limits)
    const limitedText = recipeText.substring(0, 3000);

    return `Extract recipe information from this text and return ONLY valid JSON, no other text:

{
  "recipe_name": "recipe name here",
  "description": "description or empty string",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "yield": 4,
  "prep_time_minutes": 15,
  "cook_time_minutes": 30,
  "temperature_celsius": 180,
  "temperature_fahrenheit": 350,
  "temperature_unit": "celsius",
  "rating": 4.5
}

Recipe text:
${limitedText}

JSON:`;
  }

  /**
   * Parse AI response into ScrapedRecipe format
   * Handles various response formats from instruction-following models
   */
  private parseAIResponse(
    aiResponse: string,
    fallbackName: string,
    fallbackDescription: string,
    url: string,
  ): Partial<ScrapedRecipe> | null {
    try {
      // Clean the response - remove markdown code blocks, extra text
      let cleaned = aiResponse.trim();

      // Remove markdown code blocks if present
      cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      // Extract JSON from response (might have extra text before/after)
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        scraperLogger.warn('[AI Extractor] No JSON found in AI response');
        return null;
      }

      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      // Validate and extract ingredients
      const ingredients: RecipeIngredient[] = [];
      if (Array.isArray(parsed.ingredients)) {
        parsed.ingredients.forEach((ing: any) => {
          if (typeof ing === 'string' && ing.trim().length > 0) {
            const originalText = ing.trim();
            const name = this.extractIngredientName(originalText);
            ingredients.push({
              name: name || originalText,
              original_text: originalText,
            });
          }
        });
      }

      // Validate and extract instructions
      const instructions: string[] = [];
      if (Array.isArray(parsed.instructions)) {
        parsed.instructions.forEach((inst: any) => {
          if (typeof inst === 'string' && inst.trim().length > 0) {
            instructions.push(inst.trim());
          }
        });
      }

      // Extract temperature (handle both formats)
      let temperature_celsius: number | undefined;
      let temperature_fahrenheit: number | undefined;
      let temperature_unit: 'celsius' | 'fahrenheit' | undefined;

      if (typeof parsed.temperature_celsius === 'number') {
        const tempC = parsed.temperature_celsius;
        temperature_celsius = tempC;
        temperature_fahrenheit = Math.round(tempC * (9 / 5) + 32);
        temperature_unit = 'celsius';
      } else if (typeof parsed.temperature_fahrenheit === 'number') {
        const tempF = parsed.temperature_fahrenheit;
        temperature_fahrenheit = tempF;
        temperature_celsius = Math.round((tempF - 32) * (5 / 9));
        temperature_unit = 'fahrenheit';
      }

      // Build recipe object
      const recipe: Partial<ScrapedRecipe> = {
        id: url,
        source_url: url,
        scraped_at: new Date().toISOString(),
        recipe_name: parsed.recipe_name || fallbackName || 'Untitled Recipe',
        description: parsed.description || fallbackDescription || '',
        ingredients: ingredients.length > 0 ? ingredients : undefined,
        instructions: instructions.length > 0 ? instructions : undefined,
        yield: typeof parsed.yield === 'number' ? parsed.yield : undefined,
        yield_unit: 'servings',
        prep_time_minutes:
          typeof parsed.prep_time_minutes === 'number' ? parsed.prep_time_minutes : undefined,
        cook_time_minutes:
          typeof parsed.cook_time_minutes === 'number' ? parsed.cook_time_minutes : undefined,
        rating: typeof parsed.rating === 'number' ? parsed.rating : undefined,
      };

      // Add temperature fields only if they exist
      if (temperature_celsius !== undefined) {
        recipe.temperature_celsius = temperature_celsius;
      }
      if (temperature_fahrenheit !== undefined) {
        recipe.temperature_fahrenheit = temperature_fahrenheit;
      }
      if (temperature_unit !== undefined) {
        recipe.temperature_unit = temperature_unit;
      }

      // Validate we have minimum required fields
      if (!recipe.recipe_name || ingredients.length === 0 || instructions.length === 0) {
        scraperLogger.warn('[AI Extractor] Missing required fields in extracted recipe');
        return null;
      }

      return recipe;
    } catch (error) {
      scraperLogger.error('[AI Extractor] Error parsing AI response:', error);
      return null;
    }
  }

  /**
   * Extract ingredient name from ingredient text (same logic as scrapers)
   */
  private extractIngredientName(text: string): string {
    const cleaned = text
      .replace(/^\d+\s*/, '')
      .replace(/^\d+\/\d+\s*/, '')
      .replace(/\s*(cup|cups|tbsp|tsp|oz|lb|g|kg|ml|l|tablespoon|teaspoon|ounce|pound|gram|kilogram|milliliter|liter)s?\s*/gi, '')
      .replace(/\s*(and|or|plus)\s*/gi, ' ')
      .trim();
    return cleaned.length > 2 ? cleaned : text;
  }
}

/**
 * Get AI extractor instance (singleton pattern)
 */
let aiExtractorInstance: AIExtractor | null = null;

export function getAIExtractor(config?: Partial<AIExtractorConfig>): AIExtractor {
  if (!aiExtractorInstance) {
    aiExtractorInstance = new AIExtractor(config);
  }
  return aiExtractorInstance;
}
