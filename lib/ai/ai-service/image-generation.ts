/**
 * Food image generation service using Gemini API
 *
 * Generates photorealistic food images based on dish/recipe names and ingredients.
 * Provides two presentation alternatives (primary and alternative plating styles).
 */

import { getGeminiClient, isAIEnabled, getModelForTask, type TaskType } from '../gemini-client';
import { logger } from '@/lib/logger';
import type { AIRequestOptions, AIResponse } from '../types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export interface FoodImageGenerationOptions extends AIRequestOptions {
  alternative?: boolean; // Generate alternative plating style
}

export interface FoodImageResult {
  imageUrl: string; // Base64 data URL or external URL
  imageData?: string; // Base64 image data if returned directly
  mimeType?: string; // Image MIME type (image/jpeg, image/png)
}

/**
 * Build a detailed prompt for food image generation
 *
 * @param dishName - Name of the dish/recipe
 * @param ingredients - List of ingredient names
 * @param alternative - Whether to generate alternative plating style
 * @returns Formatted prompt for image generation
 */
export function buildFoodImagePrompt(
  dishName: string,
  ingredients: string[],
  alternative: boolean = false,
): string {
  // Sanitize dish name (remove special characters that might confuse the model)
  const sanitizedName = dishName.trim().replace(/[^\w\s-]/g, '');

  // Limit ingredients to key ones (first 8-10) to keep prompt focused
  const keyIngredients = ingredients.slice(0, 10).join(', ');
  const ingredientCount = ingredients.length;
  const moreIngredients = ingredientCount > 10 ? ` and ${ingredientCount - 10} more ingredients` : '';

  if (alternative) {
    // Alternative prompt: Top-down overhead view with different plating
    return `A top-down overhead view of ${sanitizedName} featuring ${keyIngredients}${moreIngredients}, beautifully arranged on a rustic wooden board or modern ceramic plate. Professional food photography, natural lighting, vibrant colors, restaurant menu quality, appetizing presentation, shallow depth of field, food styling, commercial photography style.`;
  } else {
    // Primary prompt: Side view with elegant plating
    return `A photorealistic, professional food photography image of ${sanitizedName}. The dish features ${keyIngredients}${moreIngredients}. It is beautifully plated on a white ceramic plate or elegant dish, with professional garnishing and food styling. Professional restaurant-quality photography, natural lighting, shallow depth of field, appetizing presentation, commercial food photography, high resolution, detailed textures.`;
  }
}

/**
 * Generate a food image using Gemini API
 *
 * NOTE: This implementation assumes Gemini API supports image generation.
 * The exact API method may need to be verified and adjusted based on
 * the actual Gemini 2.5 Flash Image API capabilities.
 *
 * @param prompt - Image generation prompt
 * @param options - Generation options
 * @returns Generated image result
 */
export async function generateFoodImage(
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

  const client = getGeminiClient();
  if (!client) {
    return {
      content: {
        imageUrl: '',
      },
      error: 'AI client not available',
    };
  }

  const taskType: TaskType = 'vision'; // Using vision task type for image-related operations
  const model = options.model || getModelForTask(taskType);
  const temperature = options.temperature ?? 0.7;
  const maxOutputTokens = options.maxTokens ?? 1000;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Get the model instance
      const geminiModel = client.getGenerativeModel({
        model,
        generationConfig: {
          temperature,
          maxOutputTokens,
        },
      });

      // TODO: Verify the exact Gemini API method for image generation
      // The Gemini API may use a different method than generateContent for image generation
      // Possible methods to check:
      // - generateImages() - if available
      // - generateContent() with image generation parameters
      // - A separate image generation endpoint

      // For now, we'll attempt to use generateContent with a prompt that requests image generation
      // This may need to be adjusted based on actual API capabilities
      const imageGenerationPrompt = `Generate a photorealistic food image based on this description: ${prompt}. Return the image as a base64-encoded data URL.`;

      const result = await geminiModel.generateContent(imageGenerationPrompt);
      const response = await result.response;
      const content = response.text();

      // Parse the response - Gemini might return:
      // 1. A base64 data URL directly in the text
      // 2. A JSON object with image data
      // 3. A URL to the generated image

      let imageUrl = '';
      let imageData: string | undefined;
      let mimeType = 'image/jpeg';

      // Log the raw response for debugging (truncated to avoid huge logs)
      logger.dev('[Image Generation] Raw API response:', {
        responseLength: content.length,
        responsePreview: content.substring(0, 500),
      });

      // Try to extract base64 data URL from response
      // More strict regex: must have complete data URL format
      const base64Match = content.match(/data:image\/([^;]+);base64,([A-Za-z0-9+/=]+)/);
      if (base64Match && base64Match[2].length > 100) {
        // Validate base64 string is substantial (at least 100 chars)
        mimeType = `image/${base64Match[1]}`;
        imageData = base64Match[2];
        imageUrl = `data:${mimeType};base64,${imageData}`;

        // Validate the data URL is complete
        if (imageUrl.length < 200) {
          logger.warn('[Image Generation] Data URL seems too short, might be truncated:', {
            urlLength: imageUrl.length,
            urlPreview: imageUrl.substring(0, 100),
          });
        }
      } else {
        // Try to parse as JSON
        try {
          const jsonResponse = JSON.parse(content);
          if (jsonResponse.imageUrl) {
            imageUrl = jsonResponse.imageUrl;
          } else if (jsonResponse.imageData) {
            imageData = jsonResponse.imageData;
            // Validate base64 data
            if (typeof imageData === 'string' && imageData.length > 100) {
              imageUrl = `data:${mimeType};base64,${imageData}`;
            } else {
              logger.warn('[Image Generation] Invalid imageData in JSON response:', {
                dataLength: imageData?.length || 0,
              });
            }
          }
        } catch {
          // If not JSON, treat as URL or error
          if (content.startsWith('http://') || content.startsWith('https://')) {
            imageUrl = content.trim();
          } else {
            logger.warn('[Image Generation] Unexpected response format:', {
              contentLength: content.length,
              contentPreview: content.substring(0, 500),
              hasDataUrl: content.includes('data:image'),
            });
            return {
              content: {
                imageUrl: '',
              },
              error: `Unexpected response format from image generation API. Gemini may not support image generation via generateContent. Response: ${content.substring(0, 200)}`,
            };
          }
        }
      }

      // Final validation
      if (!imageUrl || imageUrl.length < 50) {
        logger.error('[Image Generation] Invalid or empty image URL generated:', {
          imageUrlLength: imageUrl?.length || 0,
          imageUrlPreview: imageUrl?.substring(0, 100),
        });
        return {
          content: {
            imageUrl: '',
          },
          error: 'No valid image data found in API response. Gemini generateContent API may not support image generation.',
        };
      }

      // Validate data URL format if it's a data URL
      if (imageUrl.startsWith('data:')) {
        const dataUrlParts = imageUrl.split(',');
        if (dataUrlParts.length !== 2 || dataUrlParts[1].length < 100) {
          logger.error('[Image Generation] Invalid data URL format:', {
            partsCount: dataUrlParts.length,
            dataLength: dataUrlParts[1]?.length || 0,
          });
          return {
            content: {
              imageUrl: '',
            },
            error: 'Invalid data URL format generated',
          };
        }
      }

      // Extract token usage from response
      const usageMetadata = result.response.usageMetadata;
      const usage = usageMetadata
        ? {
            promptTokens: usageMetadata.promptTokenCount || 0,
            completionTokens: usageMetadata.candidatesTokenCount || 0,
            totalTokens: usageMetadata.totalTokenCount || 0,
          }
        : undefined;

      return {
        content: {
          imageUrl,
          imageData,
          mimeType,
        },
        usage,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.error(`[Image Generation] Attempt ${attempt + 1} failed:`, lastError);

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

/**
 * Generate food images (primary and alternative) in parallel
 *
 * @param dishName - Name of the dish/recipe
 * @param ingredients - List of ingredient names
 * @param options - Generation options
 * @returns Object with primary and alternative image results
 */
export async function generateFoodImages(
  dishName: string,
  ingredients: string[],
  options: FoodImageGenerationOptions = {},
): Promise<{
  primary: AIResponse<FoodImageResult>;
  alternative: AIResponse<FoodImageResult>;
}> {
  // Build prompts for both images
  const primaryPrompt = buildFoodImagePrompt(dishName, ingredients, false);
  const alternativePrompt = buildFoodImagePrompt(dishName, ingredients, true);

  // Generate both images in parallel
  const [primaryResult, alternativeResult] = await Promise.all([
    generateFoodImage(primaryPrompt, { ...options, alternative: false }),
    generateFoodImage(alternativePrompt, { ...options, alternative: true }),
  ]);

  return {
    primary: primaryResult,
    alternative: alternativeResult,
  };
}
