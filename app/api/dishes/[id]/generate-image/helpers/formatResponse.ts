/**
 * Response formatting helpers
 */

/**
 * Format successful image generation response
 *
 * @param {Record<string, string | null>} generatedImages - Generated image URLs by method
 * @param {Record<string, string>} updateData - Database update data
 * @returns {Object} Formatted response object
 */
export function formatImageResponse(
  generatedImages: Record<string, string | null>,
  updateData: Record<string, string>,
): Record<string, unknown> {
  return {
    success: true,
    // Return all generated methods dynamically
    ...generatedImages,
    // Legacy field mappings for backward compatibility
    classic: generatedImages.classic || updateData.image_url || null,
    modern: generatedImages.modern || updateData.image_url_modern || null,
    rustic: generatedImages.rustic || updateData.image_url_alternative || null,
    minimalist: generatedImages.minimalist || updateData.image_url_minimalist || null,
    // Legacy aliases for backward compatibility
    imageUrl: updateData.image_url || null,
    imageUrlAlternative: updateData.image_url_alternative || null,
  };
}
