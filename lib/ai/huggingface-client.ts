/**
 * Hugging Face Inference Providers API client for AI services
 *
 * IMPORTANT API CHANGES:
 * - Old Inference API (api-inference.huggingface.co) is deprecated (returns 410 Gone)
 * - Router API (router.huggingface.co) supports OpenAI-compatible chat completions
 * - Inference Providers API supports image generation via third-party providers (fal-ai, replicate)
 *
 * Current Implementation:
 * - Text Generation: Uses router API with Llama-3.2-3B-Instruct (Apache 2.0 license, commercial use allowed)
 * - Image Generation: Uses Inference Providers API with fal-ai/replicate providers (same HUGGINGFACE_API_KEY)
 * - Vision: Not available (requires Inference Endpoints - paid service)
 *
 * API key is REQUIRED:
 * - HUGGINGFACE_API_KEY for all features (text generation and image generation)
 */

import { logger } from '@/lib/logger';
import { isAIEnabled as checkAIEnabled } from './huggingface-client/helpers/getClient';
import {
  getHuggingFaceImageModel,
  getHuggingFaceTextModel,
  getHuggingFaceVisionModel,
} from './huggingface-client/helpers/getModels';

/**
 * Check if AI is enabled (checks for Hugging Face API key)
 * API key is REQUIRED for all features (text generation via router API and image generation via Inference Providers)
 */
export function isAIEnabled(): boolean {
  return checkAIEnabled();
}

/**
 * Check if Hugging Face is available (always true - free tier)
 */
export function isHuggingFaceAvailable(): boolean {
  return true; // Hugging Face Inference API is always available (free tier)
}

export { getHuggingFaceImageModel, getHuggingFaceTextModel, getHuggingFaceVisionModel };
export { generateImageWithHuggingFace } from './huggingface-client/helpers/generateImage';
export { generateTextWithHuggingFace } from './huggingface-client/helpers/generateText';

/**
 * Analyze image using Hugging Face API
 *
 * NOTE: Vision/image analysis is not supported by the free router API.
 * The old inference API is deprecated (returns 410 Gone).
 * Vision analysis requires Hugging Face Inference Endpoints (paid service).
 *
 * @param imageUrl - Image URL (data URL, base64, or public URL)
 * @param prompt - Analysis prompt/question
 * @param options - Analysis options
 * @returns Analysis result text (null if not available)
 */
export async function analyzeImageWithHuggingFace(
  imageUrl: string,
  prompt: string,
  options: {
    model?: string;
  } = {},
): Promise<{ content: string } | null> {
  logger.warn('[Hugging Face] Vision/image analysis is not available:', {
    reason:
      'Router API does not support vision models. Old inference API is deprecated (410 Gone).',
    solution: 'Vision analysis requires Hugging Face Inference Endpoints (paid service).',
    model: options.model || getHuggingFaceVisionModel(),
  });

  // Return null to indicate vision analysis is not available
  // The calling code should handle this gracefully
  return null;
}
