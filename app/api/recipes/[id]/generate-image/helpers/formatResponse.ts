/**
 * Format response for recipe image generation
 */

import type { ImageUpdateData } from './saveImages';

export function formatImageResponse(
  updateData: ImageUpdateData,
): Record<string, string | null | boolean> {
  const response: Record<string, string | null | boolean> = {
    success: true,
    classic: updateData.image_url || null,
    modern: updateData.image_url_modern || null,
    rustic: updateData.image_url_alternative || null,
    minimalist: updateData.image_url_minimalist || null,
    // Legacy aliases for backward compatibility
    imageUrl: updateData.image_url || null,
    imageUrlAlternative: updateData.image_url_alternative || null,
  };

  // Add additional plating method images to response
  if (updateData.plating_methods_images) {
    for (const [method, url] of Object.entries(updateData.plating_methods_images)) {
      response[method] = url;
    }
  }

  return response;
}
