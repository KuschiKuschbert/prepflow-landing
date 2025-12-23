import {
  isAIEnabled,
  generateImageWithHuggingFace,
  getHuggingFaceImageModel,
} from '../../../huggingface-client';
import { logger } from '@/lib/logger';
import type { AIResponse, FoodImageResult } from '../types';
import type { FoodImageGenerationOptions } from '../types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

/**
 * Generate image with retry logic and error handling.
 *
 * @param {string} prompt - Image generation prompt
 * @param {FoodImageGenerationOptions} options - Generation options
 * @returns {Promise<AIResponse<FoodImageResult>>} Generated image result
 */
export async function generateImageWithRetry(
  prompt: string,
  options: FoodImageGenerationOptions = {},
): Promise<AIResponse<FoodImageResult>> {
  if (!isAIEnabled()) {
    return {
      content: {
        imageUrl: '',
      },
      error: 'AI is not enabled or API key is missing',
    };
  }

  const model = options.model || getHuggingFaceImageModel();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      logger.dev('[Image Generation] Generating image with Hugging Face:', {
        model,
        prompt: prompt.substring(0, 100),
        attempt: attempt + 1,
      });

      const result = await generateImageWithHuggingFace(prompt, {
        model,
        negativePrompt: 'blurry, low quality, distorted, ugly, unappetizing, bad lighting',
        numInferenceSteps: 30,
        guidanceScale: 7.5,
      });

      if (!result) {
        throw new Error('Hugging Face image generation returned null');
      }

      // Extract base64 data from data URL
      const imageData = result.imageUrl.split(',')[1];

      logger.dev('[Image Generation] Image generated successfully:', {
        dataUrlLength: result.imageUrl.length,
        mimeType: result.mimeType,
        hasImageData: !!imageData,
      });

      return {
        content: {
          imageUrl: result.imageUrl,
          imageData,
          mimeType: result.mimeType,
        },
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.error(`[Image Generation] Attempt ${attempt + 1} failed:`, {
        error: lastError.message,
        stack: lastError.stack,
        model,
      });

      // Wait before retry (exponential backoff)
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
      }
    }
  }

  return {
    content: {
      imageUrl: '',
    },
    error: lastError?.message || 'Failed to generate image after retries',
  };
}

