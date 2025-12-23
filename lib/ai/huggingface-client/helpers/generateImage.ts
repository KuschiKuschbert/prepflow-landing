import { logger } from '@/lib/logger';
import { getHfInferenceClient } from './getClient';
import { getHuggingFaceImageModel } from './getModels';
import { DEFAULT_IMAGE_PROVIDER, FALLBACK_IMAGE_PROVIDER } from '../constants';
import { processImageResult } from './processImageResult';

/**
 * Generate an image using Hugging Face Inference Providers API
 *
 * Uses Inference Providers API with fal-ai or replicate providers for image generation.
 * Uses the same HUGGINGFACE_API_KEY as text generation.
 *
 * @param prompt - Image generation prompt
 * @param options - Generation options
 * @returns Generated image as base64 data URL (null if not available)
 */
export async function generateImageWithHuggingFace(
  prompt: string,
  options: {
    model?: string;
    negativePrompt?: string;
    numInferenceSteps?: number;
    guidanceScale?: number;
  } = {},
): Promise<{ imageUrl: string; mimeType: string } | null> {
  const client = getHfInferenceClient();

  if (!client) {
    const errorMsg =
      'Hugging Face API key is required for image generation. Please set HUGGINGFACE_API_KEY environment variable.';
    logger.error('[Hugging Face]', errorMsg);
    throw new Error(errorMsg);
  }

  const model = options.model || getHuggingFaceImageModel();
  const provider = DEFAULT_IMAGE_PROVIDER;

  try {
    logger.dev('[Hugging Face] Generating image:', {
      model,
      provider,
      prompt: prompt.substring(0, 100),
      numInferenceSteps: options.numInferenceSteps || 20,
      guidanceScale: options.guidanceScale || 7.5,
    });

    // Try primary provider first
    let imageResult: Blob | string | null = null;
    let usedProvider = provider;
    let lastError: Error | null = null;

    try {
      imageResult = await client.textToImage({
        model,
        inputs: prompt,
        provider: provider as 'fal-ai' | 'replicate',
        parameters: {
          negative_prompt: options.negativePrompt || 'blurry, low quality, distorted, ugly',
          num_inference_steps: options.numInferenceSteps || 20,
          guidance_scale: options.guidanceScale || 7.5,
        },
      });
    } catch (primaryError) {
      lastError = primaryError instanceof Error ? primaryError : new Error(String(primaryError));
      logger.warn('[Hugging Face] Primary provider failed, trying fallback:', {
        provider,
        fallback: FALLBACK_IMAGE_PROVIDER,
        error: lastError.message,
      });

      // Try fallback provider
      try {
        imageResult = await client.textToImage({
          model,
          inputs: prompt,
          provider: FALLBACK_IMAGE_PROVIDER as 'fal-ai' | 'replicate',
          parameters: {
            negative_prompt: options.negativePrompt || 'blurry, low quality, distorted, ugly',
            num_inference_steps: options.numInferenceSteps || 20,
            guidance_scale: options.guidanceScale || 7.5,
          },
        });
        usedProvider = FALLBACK_IMAGE_PROVIDER;
      } catch (fallbackError) {
        const fallbackErrorMsg =
          fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        const errorDetails = {
          primary: provider,
          fallback: FALLBACK_IMAGE_PROVIDER,
          primaryError: lastError.message,
          fallbackError: fallbackErrorMsg,
          model,
        };
        logger.error('[Hugging Face] Both providers failed:', errorDetails);
        throw new Error(
          `Image generation failed with both providers. Primary (${provider}): ${lastError.message}. Fallback (${FALLBACK_IMAGE_PROVIDER}): ${fallbackErrorMsg}`,
        );
      }
    }

    if (!imageResult) {
      const errorMsg = 'Image generation returned null result from provider';
      logger.error('[Hugging Face] Image generation returned null result from provider', {
        provider: usedProvider,
        model,
      });
      throw new Error(errorMsg);
    }

    const { imageUrl, mimeType } = await processImageResult(imageResult, usedProvider, model);

    logger.dev('[Hugging Face] Image generated successfully:', {
      dataUrlLength: imageUrl.length,
      mimeType,
      provider: usedProvider,
    });

    return { imageUrl, mimeType };
  } catch (error) {
    logger.error('[Hugging Face] Image generation failed:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      model,
      provider,
    });
    return null;
  }
}
