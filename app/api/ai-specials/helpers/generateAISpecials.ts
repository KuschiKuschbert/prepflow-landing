import { generateAIVisionResponse } from '@/lib/ai/ai-service';
import { buildAISpecialsPrompt, parseAISpecialsResponse } from '@/lib/ai/prompts/ai-specials';
import { logger } from '@/lib/logger';
import { processImageWithAI } from './processImageWithAI';

/**
 * Generates AI specials suggestions from image analysis.
 *
 * @param {string} imageData - Image data (data URL or public URL).
 * @param {string} [prompt] - Optional prompt.
 * @param {string} [countryCode] - Country code (default: 'AU').
 * @returns {Promise<{ ingredients: string[]; suggestions: string[]; confidence: number; notes?: string; processing_time?: number }>} AI response.
 */
async function detectIngredients(imageData: string, countryCode: string): Promise<string[]> {
  try {
    const prompt = `Analyze this image and list all visible ingredients. Return only a JSON array of ingredient names: ["ingredient1", "ingredient2", ...]`;
    const response = await generateAIVisionResponse(imageData, prompt, countryCode, {
      temperature: 0.3,
      maxTokens: 200,
      useCache: false,
    });

    if (!response.content || response.error) return [];

    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    logger.debug('Failed to detect ingredients, continuing without recipe context', {
      error: e instanceof Error ? e.message : String(e),
    });
    return [];
  }
}

/**
 * Generates AI specials suggestions from image analysis.
 */
export async function generateAISpecials(
  imageData: string,
  prompt?: string,
  countryCode: string = 'AU',
): Promise<{
  ingredients: string[];
  suggestions: string[];
  confidence: number;
  notes?: string;
  processing_time?: number;
}> {
  try {
    // Pass 1: Ingredient detection
    const detectedIngredients = await detectIngredients(imageData, countryCode);

    // Pass 2: Vision analysis with context
    const aiPrompt = await buildAISpecialsPrompt(prompt, detectedIngredients);
    const visionResponse = await generateAIVisionResponse(imageData, aiPrompt, countryCode, {
      temperature: 0.7,
      maxTokens: 1500,
      useCache: true,
      cacheTTL: 60 * 60 * 1000,
    });

    if (visionResponse.content && !visionResponse.error) {
      const parsed = parseAISpecialsResponse(visionResponse.content);
      return { ...parsed, processing_time: 0 };
    }

    // Fallback if AI fails or returns empty
    return await processImageWithAI(imageData, prompt);
  } catch (aiError) {
    logger.warn('[AI Specials API] AI Vision API failed, using fallback:', {
      error: aiError instanceof Error ? aiError.message : String(aiError),
    });
    return await processImageWithAI(imageData, prompt);
  }
}
