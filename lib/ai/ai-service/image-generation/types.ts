import type { AIRequestOptions } from '../../types';

/**
 * Predefined plating methods for food image generation
 */
export type PlatingMethod = 'classic' | 'stacking' | 'landscape' | 'deconstructed';

export interface FoodImageGenerationOptions extends AIRequestOptions {
  platingMethod?: PlatingMethod | string; // Plating method to use
  alternative?: boolean; // Deprecated: Use platingMethod instead
}

export interface FoodImageResult {
  imageUrl: string; // Base64 data URL or external URL
  imageData?: string; // Base64 image data if returned directly
  mimeType?: string; // Image MIME type (image/jpeg, image/png)
}
