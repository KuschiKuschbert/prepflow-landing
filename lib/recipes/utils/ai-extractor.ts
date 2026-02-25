/**
 * AI Recipe Extractor (Migrated from scripts)
 * Uses Hugging Face Inference API (FREE) for robust recipe extraction
 */
import { logger } from '@/lib/logger';
import axios from 'axios';
import { ScrapedRecipe } from '../types';
import { scraperLogger } from './logger';
import { extractRecipeTextFromHtml, parseAIResponse } from './ai-extractor/helpers';

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
      const { recipeText, recipeName, description } = extractRecipeTextFromHtml(html);

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

    const generatedText: string | null = Array.isArray(response.data)
      ? response.data[0]?.generated_text
      : response.data.generated_text || (typeof response.data === 'string' ? response.data : null);
    if (!generatedText) return null;

    return parseAIResponse(generatedText, recipeName, description, url);
  }
}

let aiExtractorInstance: AIExtractor | null = null;
export function getAIExtractor(config?: Partial<AIExtractorConfig>): AIExtractor {
  if (!aiExtractorInstance) aiExtractorInstance = new AIExtractor(config);
  return aiExtractorInstance;
}
