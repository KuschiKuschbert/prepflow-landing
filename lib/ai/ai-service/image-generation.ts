/**
 * Food image generation service using Hugging Face Inference Providers
 *
 * Generates photorealistic food images based on dish/recipe names and ingredients.
 * Supports multiple plating methods: classic, modern, rustic, and minimalist.
 */

import {
  isAIEnabled,
  generateImageWithHuggingFace,
  getHuggingFaceImageModel,
} from '../huggingface-client';
import { logger } from '@/lib/logger';
import type { AIRequestOptions, AIResponse } from '../types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

/**
 * Predefined plating methods for food image generation
 */
export type PlatingMethod =
  | 'classic'
  | 'modern'
  | 'rustic'
  | 'minimalist'
  | 'landscape'
  | 'futuristic'
  | 'hide_and_seek'
  | 'super_bowl'
  | 'bathing'
  | 'deconstructed'
  | 'stacking'
  | 'brush_stroke'
  | 'free_form';

export interface FoodImageGenerationOptions extends AIRequestOptions {
  platingMethod?: PlatingMethod | string; // Plating method to use
  alternative?: boolean; // Deprecated: Use platingMethod instead
}

export interface FoodImageResult {
  imageUrl: string; // Base64 data URL or external URL
  imageData?: string; // Base64 image data if returned directly
  mimeType?: string; // Image MIME type (image/jpeg, image/png)
}

/**
 * Build a detailed prompt for food image generation based on plating method
 *
 * @param dishName - Name of the dish/recipe
 * @param ingredients - List of ingredient names
 * @param platingMethod - Plating method to use (classic, modern, rustic, minimalist, or custom description)
 * @param instructions - Optional recipe instructions/cooking method
 * @returns Formatted prompt for image generation
 */
export function buildFoodImagePrompt(
  dishName: string,
  ingredients: string[],
  platingMethod: PlatingMethod | string = 'classic',
  instructions?: string | null,
): string {
  // Sanitize dish name (remove special characters that might confuse the model)
  const sanitizedName = dishName.trim().replace(/[^\w\s-]/g, '');

  // Limit ingredients to key ones (first 8-10) to keep prompt focused
  const keyIngredients = ingredients.slice(0, 10).join(', ');
  const ingredientCount = ingredients.length;
  const moreIngredients =
    ingredientCount > 10 ? ` and ${ingredientCount - 10} more ingredients` : '';

  // Extract cooking method from instructions if available
  let cookingMethodText = '';
  if (instructions && instructions.trim().length > 0) {
    // Extract key cooking techniques from instructions (first 200 chars to keep it concise)
    const instructionPreview = instructions.trim().substring(0, 200);
    // Look for common cooking methods
    const cookingMethods = [
      'grilled',
      'roasted',
      'braised',
      'sautéed',
      'fried',
      'steamed',
      'baked',
      'seared',
      'poached',
      'simmered',
      'boiled',
      'stir-fried',
      'pan-fried',
      'deep-fried',
      'slow-cooked',
      'marinated',
      'smoked',
      'charred',
    ];
    const foundMethods = cookingMethods.filter(method =>
      instructionPreview.toLowerCase().includes(method.toLowerCase()),
    );

    if (foundMethods.length > 0) {
      cookingMethodText = ` The dish is prepared using ${foundMethods.join(' and ')} techniques.`;
    } else {
      // Use a general description from instructions
      cookingMethodText = ` Prepared according to recipe instructions: ${instructionPreview}...`;
    }
  }

  // Base prompt components
  const basePrompt = `A photorealistic, professional food photography image of ${sanitizedName}. The dish features ${keyIngredients}${moreIngredients}.${cookingMethodText}`;
  const qualitySuffix =
    'Professional restaurant-quality photography, natural lighting, shallow depth of field, appetizing presentation, commercial food photography, high resolution, detailed textures.';

  // Generate prompt based on plating method
  switch (platingMethod) {
    case 'classic':
      // Classic: Clock method plating with balanced, symmetrical presentation
      return `${basePrompt} It is beautifully plated on a white ceramic plate using the traditional clock method: the main protein is positioned at the center or between 3 and 9 o'clock, starches (rice, potatoes, or pasta) are placed at 10 o'clock, and vegetables are arranged at 2 o'clock. The presentation is balanced, symmetrical, and organized with professional garnishing and food styling. Traditional fine dining style with clean, formal presentation that emphasizes harmony and structure. ${qualitySuffix}`;

    case 'modern':
      // Modern: Contemporary plating with geometric arrangements
      return `${basePrompt} It is artfully arranged on a modern ceramic plate or contemporary dishware with geometric patterns, minimalist garnishing, and sophisticated food styling. Contemporary restaurant presentation, clean lines, artistic composition. ${qualitySuffix}`;

    case 'rustic':
      // Rustic: Top-down overhead view with artisanal presentation
      return `A top-down overhead view of ${sanitizedName} featuring ${keyIngredients}${moreIngredients}.${cookingMethodText} Beautifully arranged on a rustic wooden board or artisanal ceramic plate. Natural, artisanal presentation with organic garnishing. Professional food photography, natural lighting, vibrant colors, restaurant menu quality, appetizing presentation, shallow depth of field, food styling, commercial photography style.`;

    case 'minimalist':
      // Minimalist: Clean, simple plating with negative space
      return `${basePrompt} It is elegantly plated on a simple white or neutral-colored plate with clean lines, minimal garnishing, and generous negative space. Minimalist presentation, sophisticated simplicity, refined food styling. ${qualitySuffix}`;

    case 'landscape':
      // Landscape: Horizontal arrangement mimicking natural landscapes with visual flow
      return `${basePrompt} It is arranged horizontally across the plate in a landscape plating style, creating visual flow that mimics natural scenes like gardens, rivers, or terrains. Ingredients are positioned to guide the eye from left to right across the plate. Sauces and purees flow like rivers or winding paths, creating depth and movement. Edible flowers, microgreens, and herbs are arranged like foliage to enhance the garden-like appearance. The main components are placed slightly off-center with garnishes radiating outward, creating a harmonious and organic presentation that evokes natural landscapes. ${qualitySuffix}`;

    case 'futuristic':
      // Futuristic: Modern, geometric arrangements with precise placement
      return `${basePrompt} It is arranged with modern, geometric precision using negative space and architectural elements. Futuristic plating technique with precise placement, clean lines, and contemporary aesthetic. ${qualitySuffix}`;

    case 'hide_and_seek':
      // Hide and seek: Layered presentation with partially hidden ingredients
      return `${basePrompt} It is presented with layered components where some ingredients are partially hidden, creating depth and intrigue. Hide and seek plating technique with strategic layering and visual discovery. ${qualitySuffix}`;

    case 'super_bowl':
      // Super bowl: Deep bowl presentation with layered arrangement
      return `${basePrompt} It is beautifully arranged in a deep bowl with ingredients layered or arranged in concentric circles. Super bowl technique with vertical depth and visual interest. ${qualitySuffix}`;

    case 'bathing':
      // Bathing: Ingredients arranged in or around sauce/broth
      return `${basePrompt} It is arranged with ingredients positioned in or around a sauce or broth, creating a "bathing" effect with visual appeal. Bathing plating technique with sauce integration. ${qualitySuffix}`;

    case 'deconstructed':
      // Deconstructed: Modern gastronomy style with components separated and arranged individually
      return `${basePrompt} It is presented using the deconstructed plating technique, where all components of the dish are separated and arranged individually on the plate, allowing each element to be seen and experienced distinctly. This modern gastronomy and molecular gastronomy style showcases creativity and technique, with each ingredient placed in its own section or area of the plate. The arrangement is artistic and cohesive, yet each component remains distinct, inviting diners to experience individual flavors and textures before combining them. The presentation emphasizes the individual qualities of each element while maintaining visual harmony across the plate. Modern, minimalist plate presentation that highlights the separation and artistry of each component. ${qualitySuffix}`;

    case 'stacking':
      // Stacking: Vertical tower presentation with layered ingredients creating height
      return `${basePrompt} It is presented using the stacking method, building a vertical tower with ingredients carefully layered on top of each other. The base layer typically consists of starches or vegetables, followed by the main protein, and topped with additional components or garnishes. This creates significant height and visual sophistication, with each layer visible and contributing to the overall composition. Sauces and glazes are drizzled vertically down the sides of the stack, enhancing the vertical presentation. The tower-like structure adds depth, helps retain heat, and ensures balanced flavors in each bite. Presented on a minimalist white or neutral plate to emphasize the vertical structure. ${qualitySuffix}`;

    case 'brush_stroke':
      // Brush stroke: Artistic presentation mimicking brush strokes
      return `${basePrompt} It is artistically arranged with sauces and purees applied like brush strokes, creating an abstract, painterly effect. The brush stroke plating technique with artistic sauce application. ${qualitySuffix}`;

    case 'free_form':
      // Free form: Organic, asymmetrical arrangement
      return `${basePrompt} It is arranged organically with asymmetrical placement following natural shapes and flows, creating a dynamic, less structured presentation. Free form plating technique with organic composition. ${qualitySuffix}`;

    default:
      // Custom plating method: Use the provided description
      if (typeof platingMethod === 'string' && platingMethod.trim().length > 0) {
        return `${basePrompt} ${platingMethod}. ${qualitySuffix}`;
      }
      // Fallback to classic if invalid
      return `${basePrompt} It is beautifully plated on a white ceramic plate or elegant dish, with professional garnishing and food styling. ${qualitySuffix}`;
  }
}

/**
 * Generate a food image using Hugging Face Inference Providers
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

/**
 * Generate food images with multiple plating methods in parallel
 *
 * Generates 4 images with different plating styles:
 * - classic: Traditional elegant plating (primary)
 * - modern: Contemporary minimalist plating
 * - rustic: Rustic/artisanal plating (alternative)
 * - minimalist: Clean, simple plating
 *
 * @param dishName - Name of the dish/recipe
 * @param ingredients - List of ingredient names
 * @param options - Generation options
 * @param instructions - Optional recipe instructions/cooking method
 * @returns Object with all 4 plating method image results
 */
export async function generateFoodImages(
  dishName: string,
  ingredients: string[],
  options: FoodImageGenerationOptions = {},
  instructions?: string | null,
): Promise<{
  classic: AIResponse<FoodImageResult>;
  modern: AIResponse<FoodImageResult>;
  rustic: AIResponse<FoodImageResult>;
  minimalist: AIResponse<FoodImageResult>;
  // Legacy aliases for backward compatibility
  primary: AIResponse<FoodImageResult>;
  alternative: AIResponse<FoodImageResult>;
}> {
  // Build prompts for all 4 plating methods
  const classicPrompt = buildFoodImagePrompt(dishName, ingredients, 'classic', instructions);
  const modernPrompt = buildFoodImagePrompt(dishName, ingredients, 'modern', instructions);
  const rusticPrompt = buildFoodImagePrompt(dishName, ingredients, 'rustic', instructions);
  const minimalistPrompt = buildFoodImagePrompt(dishName, ingredients, 'minimalist', instructions);

  // Generate all 4 images in parallel
  const [classicResult, modernResult, rusticResult, minimalistResult] = await Promise.all([
    generateFoodImage(classicPrompt, { ...options, platingMethod: 'classic' }),
    generateFoodImage(modernPrompt, { ...options, platingMethod: 'modern' }),
    generateFoodImage(rusticPrompt, { ...options, platingMethod: 'rustic' }),
    generateFoodImage(minimalistPrompt, { ...options, platingMethod: 'minimalist' }),
  ]);

  return {
    classic: classicResult,
    modern: modernResult,
    rustic: rusticResult,
    minimalist: minimalistResult,
    // Legacy aliases for backward compatibility
    primary: classicResult,
    alternative: rusticResult,
  };
}

/**
 * Generate food images for specific plating methods
 *
 * @param dishName - Name of the dish/recipe
 * @param ingredients - List of ingredient names
 * @param platingMethods - Array of plating methods to generate
 * @param options - Generation options
 * @param instructions - Optional recipe instructions/cooking method
 * @returns Object with image results for each requested plating method
 */
export async function generateFoodImagesForMethods(
  dishName: string,
  ingredients: string[],
  platingMethods: PlatingMethod[],
  options: FoodImageGenerationOptions = {},
  instructions?: string | null,
): Promise<Record<string, AIResponse<FoodImageResult>>> {
  logger.dev('[Image Generation] Generating images for plating methods:', {
    dishName,
    platingMethods,
    ingredientCount: ingredients.length,
    hasInstructions: !!instructions,
  });

  // Build prompts for all requested plating methods
  const prompts = platingMethods.map(method => {
    const prompt = buildFoodImagePrompt(dishName, ingredients, method, instructions);
    logger.dev(`[Image Generation] Built prompt for ${method}:`, {
      method,
      promptLength: prompt.length,
      promptPreview: prompt.substring(0, 150),
    });
    return {
      method,
      prompt,
    };
  });

  // Generate all images in parallel
  const results = await Promise.all(
    prompts.map(({ method, prompt }) =>
      generateFoodImage(prompt, { ...options, platingMethod: method }).then(result => ({
        method,
        result,
      })),
    ),
  );

  // Convert array to object keyed by method name
  const resultObject: Record<string, AIResponse<FoodImageResult>> = {};
  for (const { method, result } of results) {
    resultObject[method] = result;
  }

  return resultObject;
}
