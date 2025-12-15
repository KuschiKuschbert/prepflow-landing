/**
 * Build image map from all image sources.
 */
import { normalizeImageUrl } from './normalizeImageUrl';
import type { PlatingMethod } from '../FoodImageDisplay';

export function buildImageMap(
  imageUrl: string | null | undefined,
  imageUrlModern: string | null | undefined,
  imageUrlAlternative: string | null | undefined,
  imageUrlMinimalist: string | null | undefined,
  platingMethodsImages?: Record<string, string | null>,
): Record<string, string | null> {
  const normalizedImageUrl = normalizeImageUrl(imageUrl);
  const normalizedImageUrlModern = normalizeImageUrl(imageUrlModern);
  const normalizedImageUrlAlternative = normalizeImageUrl(imageUrlAlternative);
  const normalizedImageUrlMinimalist = normalizeImageUrl(imageUrlMinimalist);
  const normalizedPlatingMethodsImages: Record<string, string | null> = {};
  if (platingMethodsImages) {
    for (const [method, url] of Object.entries(platingMethodsImages)) {
      normalizedPlatingMethodsImages[method] = normalizeImageUrl(url);
    }
  }
  return {
    classic: normalizedImageUrl,
    modern: normalizedImageUrlModern,
    rustic: normalizedImageUrlAlternative,
    minimalist: normalizedImageUrlMinimalist,
    ...normalizedPlatingMethodsImages,
  };
}
