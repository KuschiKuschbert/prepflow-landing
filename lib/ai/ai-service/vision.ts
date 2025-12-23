import {
  isAIEnabled,
  analyzeImageWithHuggingFace,
  getHuggingFaceVisionModel,
} from '../huggingface-client';
import { buildKitchenContext } from '../prompts/kitchen-context';
import type { AIRequestOptions, AIResponse } from '../types';
import { parseAIError } from '../utils/errorParser';
import { processAIResponse } from '../utils/responseProcessor';
import { logger } from '@/lib/logger';

/**
 * Generate AI response from vision (image analysis).
 *
 * @param {string} imageUrl - URL of image to analyze (data URL, base64, or public URL)
 * @param {string} prompt - Analysis prompt
 * @param {string} countryCode - Country code for context
 * @param {AIRequestOptions} options - Request options
 * @returns {Promise<AIResponse<string>>} AI response
 */
export async function generateAIVisionResponse(
  imageUrl: string,
  prompt: string,
  countryCode: string,
  options: AIRequestOptions = {},
): Promise<AIResponse<string>> {
  if (!isAIEnabled()) {
    return {
      content: '',
      error: 'AI is not enabled or API key is missing',
    };
  }

  const kitchenContext = buildKitchenContext(countryCode);
  const fullPrompt = `${prompt}\n\n${kitchenContext}\n\nAnalyze the image and provide recommendations specific to the user's location and regulations.`;

  const model = options.model || getHuggingFaceVisionModel();

  try {
    const result = await analyzeImageWithHuggingFace(imageUrl, fullPrompt, {
      model,
    });

    if (!result) {
      return {
        content: '',
        error: 'Hugging Face vision analysis returned null',
      };
    }

    // Hugging Face vision models don't provide token usage in the same way
    // We'll estimate or leave undefined
    const usage = undefined;

    return processAIResponse(
      result.content,
      usage,
      model,
      'vision',
      undefined,
      countryCode,
      options,
    );
  } catch (error) {
    logger.error('[vision.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    const aiError = parseAIError(error as Error);
    return { content: '', error: aiError.message };
  }
}
