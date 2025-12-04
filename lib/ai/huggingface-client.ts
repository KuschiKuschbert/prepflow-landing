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

import { HfInference } from '@huggingface/inference';
import { logger } from '@/lib/logger';
import type { AIChatMessage } from './types';

// Router API base URL - only supports OpenAI-compatible chat completions for specific text models
const HUGGINGFACE_ROUTER_BASE = 'https://router.huggingface.co';
// Old inference API - deprecated (returns 410 Gone)
const HUGGINGFACE_INFERENCE_BASE = 'https://api-inference.huggingface.co/models';
const DEFAULT_IMAGE_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0';
// Router API supports Llama models (Apache 2.0 license, commercial use allowed)
const DEFAULT_TEXT_MODEL = 'meta-llama/Llama-3.2-3B-Instruct';
const DEFAULT_VISION_MODEL = 'Salesforce/blip-image-captioning-base';

// Inference Providers for image generation (fal-ai or replicate)
const DEFAULT_IMAGE_PROVIDER = 'fal-ai';
const FALLBACK_IMAGE_PROVIDER = 'replicate';

// Singleton HfInference client instance
let hfInferenceClient: HfInference | null = null;

/**
 * Get or create HfInference client instance
 */
function getHfInferenceClient(): HfInference | null {
  const apiKey = getHuggingFaceApiKey();
  if (!apiKey) {
    return null;
  }

  if (!hfInferenceClient) {
    hfInferenceClient = new HfInference(apiKey);
  }

  return hfInferenceClient;
}

/**
 * Check if AI is enabled (checks for Hugging Face API key)
 * API key is REQUIRED for all features (text generation via router API and image generation via Inference Providers)
 */
export function isAIEnabled(): boolean {
  // Hugging Face API key is required for all features
  return !!getHuggingFaceApiKey();
}

/**
 * Check if Hugging Face is available (always true - free tier)
 */
export function isHuggingFaceAvailable(): boolean {
  return true; // Hugging Face Inference API is always available (free tier)
}

/**
 * Get Hugging Face API key (required for router API)
 */
function getHuggingFaceApiKey(): string | null {
  return process.env.HUGGINGFACE_API_KEY || null;
}

/**
 * Get the image generation model to use
 */
export function getHuggingFaceImageModel(): string {
  return process.env.HUGGINGFACE_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
}

/**
 * Get the text generation model to use
 */
export function getHuggingFaceTextModel(): string {
  return process.env.HUGGINGFACE_TEXT_MODEL || DEFAULT_TEXT_MODEL;
}

/**
 * Get the vision/image analysis model to use
 */
export function getHuggingFaceVisionModel(): string {
  return process.env.HUGGINGFACE_VISION_MODEL || DEFAULT_VISION_MODEL;
}

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

    // Handle both Blob and base64 string responses
    let dataUrl: string;
    let mimeType: string;

    /**
     * Validate base64 string format
     */
    const isValidBase64 = (str: string): boolean => {
      if (!str || str.length === 0) return false;
      // Base64 regex: allows A-Z, a-z, 0-9, +, /, = (padding)
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      return base64Regex.test(str);
    };

    if (typeof imageResult === 'string') {
      // Already a base64 string or data URL
      if (imageResult.startsWith('data:')) {
        // Already a data URL - validate format
        const match = imageResult.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          const [, extractedMimeType, base64Data] = match;
          if (!isValidBase64(base64Data)) {
            const errorMsg = 'Invalid base64 data in data URL';
            logger.error('[Hugging Face] Invalid base64 data in data URL', {
              dataUrlLength: imageResult.length,
              base64Length: base64Data.length,
              provider: usedProvider,
              model,
            });
            throw new Error(errorMsg);
          }
          mimeType = extractedMimeType;
          dataUrl = imageResult;
        } else {
          // Malformed data URL - throw error instead of using invalid URL
          const errorMsg = 'Malformed data URL format received from image generation provider';
          logger.error('[Hugging Face] Malformed data URL format', {
            dataUrlPrefix: imageResult.substring(0, 50),
            dataUrlLength: imageResult.length,
            provider: usedProvider,
            model,
          });
          throw new Error(errorMsg);
        }
      } else {
        // Assume it's base64 without data URL prefix - validate first
        if (!isValidBase64(imageResult)) {
          const errorMsg = 'Invalid base64 string provided for image generation';
          logger.error('[Hugging Face] Invalid base64 string', {
            stringLength: imageResult.length,
            stringPreview: imageResult.substring(0, 50),
            provider: usedProvider,
            model,
          });
          throw new Error(errorMsg);
        }
        mimeType = 'image/png';
        dataUrl = `data:${mimeType};base64,${imageResult}`;
      }
    } else if (imageResult && typeof imageResult === 'object' && 'arrayBuffer' in imageResult) {
      // It's a Blob
      const blob = imageResult as Blob;
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      if (!base64 || base64.length === 0) {
        const errorMsg = 'Failed to convert Blob to base64';
        logger.error('[Hugging Face] Failed to convert Blob to base64', {
          blobType: blob.type,
          blobSize: blob.size,
          provider: usedProvider,
          model,
        });
        throw new Error(errorMsg);
      }
      mimeType = blob.type || 'image/png';
      dataUrl = `data:${mimeType};base64,${base64}`;
    } else {
      const errorMsg = `Unexpected image result type: ${typeof imageResult}. Expected Blob or string.`;
      logger.error('[Hugging Face] Unexpected image result type', {
        type: typeof imageResult,
        hasArrayBuffer:
          imageResult && typeof imageResult === 'object' && 'arrayBuffer' in imageResult,
        provider: usedProvider,
        model,
      });
      throw new Error(errorMsg);
    }

    logger.dev('[Hugging Face] Image generated successfully:', {
      dataUrlLength: dataUrl.length,
      mimeType,
      provider: usedProvider,
    });

    return { imageUrl: dataUrl, mimeType };
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

/**
 * Generate text using Hugging Face Router API (Llama model)
 *
 * Uses OpenAI-compatible format via router API
 * Router API supports specific models like Llama-3.2-3B-Instruct
 *
 * @param messages - Chat messages (system/user/assistant)
 * @param options - Generation options
 * @returns Generated text response
 */
export async function generateTextWithHuggingFace(
  messages: AIChatMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {},
): Promise<{
  content: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
} | null> {
  const model = options.model || getHuggingFaceTextModel();
  const apiKey = getHuggingFaceApiKey();

  if (!apiKey) {
    logger.error('[Hugging Face] API key is required for router API');
    return null;
  }

  try {
    logger.dev('[Hugging Face] Generating text:', {
      model,
      messageCount: messages.length,
      hasApiKey: !!apiKey,
      endpoint: `${HUGGINGFACE_ROUTER_BASE}/v1/chat/completions`,
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    // Router API uses OpenAI-compatible format with /v1/chat/completions endpoint
    const response = await fetch(`${HUGGINGFACE_ROUTER_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: any = null;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // Not JSON, use as text
      }

      logger.error('[Hugging Face] Text generation failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText.substring(0, 500),
        errorJson,
      });

      // Handle rate limiting and model loading
      if (response.status === 503) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 10000;
        logger.warn(`[Hugging Face] Model loading, waiting ${waitTime}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return generateTextWithHuggingFace(messages, options); // Retry once
      }

      return null;
    }

    const result = await response.json();

    // OpenAI-compatible format returns { choices: [{ message: { content: "..." } }] }
    let content = '';
    if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
      content = result.choices[0].message?.content || '';
    } else if (result.content) {
      content = result.content;
    }

    // Extract usage if available
    const usage = result.usage
      ? {
          promptTokens: result.usage.prompt_tokens || 0,
          completionTokens: result.usage.completion_tokens || 0,
          totalTokens: result.usage.total_tokens || 0,
        }
      : undefined;

    logger.dev('[Hugging Face] Text generated successfully:', {
      contentLength: content.length,
      hasUsage: !!usage,
    });

    return { content, usage };
  } catch (error) {
    logger.error('[Hugging Face] Text generation error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}

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
