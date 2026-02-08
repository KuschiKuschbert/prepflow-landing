/**
 * AI Recipe Extractor (Migrated from scripts)
 * Uses Hugging Face Inference API (FREE) for robust recipe extraction
 */

import { logger } from '@/lib/logger';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { RecipeIngredient, ScrapedRecipe } from '../types';
import { scraperLogger } from './logger';

interface AIExtractorConfig {
  apiKey?: string;
  model?: string;
  timeout?: number;
  enabled?: boolean;
}

const DEFAULT_CONFIG: Required<AIExtractorConfig> = {
  apiKey: process.env.HUGGINGFACE_API_KEY || '',
  model: 'google/flan-t5-base',
  timeout: 30000,
  enabled: process.env.ENABLE_AI_EXTRACTION === 'true' || !!process.env.HUGGINGFACE_API_KEY,
};

export class AIExtractor {
  private config: Required<AIExtractorConfig>;
  private apiUrl: string;

  constructor(config: Partial<AIExtractorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.apiUrl = `https://api-inference.huggingface.co/models/${this.config.model}`;

    if (this.config.enabled) {
      scraperLogger.info('[AI Extractor] Initialized (FREE tier)');
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  async extractRecipe(html: string, url: string): Promise<Partial<ScrapedRecipe> | null> {
    if (!this.config.enabled) return null;

    try {
      scraperLogger.info(`[AI Extractor] Attempting FREE AI extraction for ${url}`);
      const { recipeText, recipeName, description } = this.extractRecipeText(html);

      if (!recipeText || recipeText.length < 50) {
        scraperLogger.warn('[AI Extractor] Insufficient text extracted from HTML');
        return null;
      }

      const recipeData = await this.extractStructuredData(recipeText, recipeName, description, url);
      return recipeData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('503') || errorMessage.includes('loading')) {
        scraperLogger.debug(`[AI Extractor] Model temporarily unavailable: ${errorMessage}`);
      } else {
        logger.error('[AI Extractor] Error during AI extraction:', { error: errorMessage, url });
        scraperLogger.error('[AI Extractor] Error:', errorMessage);
      }
      return null;
    }
  }

  private extractRecipeText(html: string): {
    recipeText: string;
    recipeName: string;
    description: string;
  } {
    const $ = cheerio.load(html);
    const recipeName =
      $('h1').first().text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      $('title').text().trim() ||
      '';
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('.recipe-description, .recipe-summary').first().text().trim() ||
      '';

    const ingredients: string[] = [];
    const ingredientSelectors = [
      'li[itemprop="recipeIngredient"]',
      '.ingredient',
      '.ingredients-item',
      'ul.ingredients li',
      '[class*="ingredient"] li',
    ];
    for (const s of ingredientSelectors) {
      const found = $(s)
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(t => t.length > 0 && t.length < 200);
      if (found.length > 0) {
        ingredients.push(...found);
        break;
      }
    }

    const instructions: string[] = [];
    const instructionSelectors = [
      'li[itemprop="recipeInstructions"]',
      '.instruction',
      '.step',
      '.direction',
      'ol.instructions li',
      '[class*="step"] li',
    ];
    for (const s of instructionSelectors) {
      const found = $(s)
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(t => t.length > 0 && t.length < 500);
      if (found.length > 0) {
        instructions.push(...found);
        break;
      }
    }

    const recipeText = [
      `Recipe Name: ${recipeName}`,
      description ? `Description: ${description}` : '',
      ingredients.length > 0
        ? `Ingredients:\n${ingredients.map((ing, i) => `${i + 1}. ${ing}`).join('\n')}`
        : '',
      instructions.length > 0
        ? `Instructions:\n${instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    return { recipeText, recipeName, description };
  }

  private async extractStructuredData(
    recipeText: string,
    recipeName: string,
    description: string,
    url: string,
  ): Promise<Partial<ScrapedRecipe> | null> {
    const prompt = `Extract recipe information from this text and return ONLY valid JSON:
{
  "recipe_name": "recipe name",
  "description": "description",
  "ingredients": ["1 cup sugar"],
  "instructions": ["step 1"],
  "yield": 4,
  "prep_time_minutes": 15,
  "cook_time_minutes": 30,
  "rating": 4.5
}
Text: ${recipeText.substring(0, 3000)}
JSON:`;

    const response = await axios.post(
      this.apiUrl,
      {
        inputs: prompt,
        parameters: { max_new_tokens: 1500, temperature: 0.1, return_full_text: false },
      },
      {
        headers: {
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
          'Content-Type': 'application/json',
        },
        timeout: this.config.timeout,
      },
    );

    let generatedText: string | null = Array.isArray(response.data)
      ? response.data[0]?.generated_text
      : response.data.generated_text || (typeof response.data === 'string' ? response.data : null);
    if (!generatedText) return null;

    return this.parseAIResponse(generatedText, recipeName, description, url);
  }

  private parseAIResponse(
    aiResponse: string,
    fallbackName: string,
    fallbackDescription: string,
    url: string,
  ): Partial<ScrapedRecipe> | null {
    try {
      const cleaned = aiResponse
        .trim()
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '');
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = JSON.parse(jsonMatch[0]);
      const ingredients: RecipeIngredient[] = (parsed.ingredients || []).map((ing: string) => ({
        name: ing.replace(/^\d+\s*/, '').trim() || ing,
        original_text: ing,
      }));

      return {
        id: url,
        source_url: url,
        scraped_at: new Date().toISOString(),
        recipe_name: parsed.recipe_name || fallbackName || 'Untitled Recipe',
        description: parsed.description || fallbackDescription || '',
        ingredients,
        instructions: Array.isArray(parsed.instructions) ? parsed.instructions : undefined,
        yield: typeof parsed.yield === 'number' ? parsed.yield : undefined,
        prep_time_minutes:
          typeof parsed.prep_time_minutes === 'number' ? parsed.prep_time_minutes : undefined,
        cook_time_minutes:
          typeof parsed.cook_time_minutes === 'number' ? parsed.cook_time_minutes : undefined,
        rating: typeof parsed.rating === 'number' ? parsed.rating : undefined,
      };
    } catch {
      return null;
    }
  }
}

let aiExtractorInstance: AIExtractor | null = null;
export function getAIExtractor(config?: Partial<AIExtractorConfig>): AIExtractor {
  if (!aiExtractorInstance) aiExtractorInstance = new AIExtractor(config);
  return aiExtractorInstance;
}
