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
export async function generateAISpecials(
  imageData: string,
  prompt?: string,
  countryCode?: string,
): Promise<{
  ingredients: string[];
  suggestions: string[];
  confidence: number;
  notes?: string;
  processing_time?: number;
}> {
  try {
    // First, do a quick ingredient detection pass to get recipe database context
    let detectedIngredients: string[] = [];
    try {
      const ingredientDetectionPrompt = `Analyze this image and list all visible ingredients. Return only a JSON array of ingredient names: ["ingredient1", "ingredient2", ...]`;
      const ingredientResponse = await generateAIVisionResponse(
        imageData,
        ingredientDetectionPrompt,
        countryCode || 'AU',
        {
          temperature: 0.3,
          maxTokens: 200,
          useCache: false, // Don't cache ingredient detection
        },
      );

      if (ingredientResponse.content && !ingredientResponse.error) {
        try {
          const jsonMatch = ingredientResponse.content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            detectedIngredients = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          // Ignore parsing errors, continue without recipe context
          logger.debug(
            'Failed to parse ingredient detection response, continuing without recipe context',
            {
              error: e instanceof Error ? e.message : String(e),
            },
          );
        }
      }
    } catch (error) {
      // If ingredient detection fails, continue without recipe context
      logger.debug(
        'Ingredient detection failed, continuing without recipe database context:',
        error,
      );
    }

    // Build prompt with recipe database context
    const aiPrompt = await buildAISpecialsPrompt(prompt, detectedIngredients);
    const visionResponse = await generateAIVisionResponse(
      imageData,
      aiPrompt,
      countryCode || 'AU',
      {
        temperature: 0.7,
        maxTokens: 1500,
        useCache: true,
        cacheTTL: 60 * 60 * 1000, // 1 hour cache
      },
    );

    if (visionResponse.content && !visionResponse.error) {
      const parsed = parseAISpecialsResponse(visionResponse.content);
      return {
        ...parsed,
        processing_time: 0, // Will be calculated if needed
      };
    } else {
      // Fallback to mock
      return await processImageWithAI(imageData, prompt);
    }
  } catch (aiError) {
    logger.warn('[AI Specials API] AI Vision API failed, using fallback:', {
      error: aiError instanceof Error ? aiError.message : String(aiError),
      context: { endpoint: '/api/ai-specials', operation: 'POST' },
    });
    // Fallback to mock
    return await processImageWithAI(imageData, prompt);
  }
}
