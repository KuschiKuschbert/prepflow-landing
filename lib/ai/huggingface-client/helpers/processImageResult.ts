import { logger } from '@/lib/logger';
import { isValidBase64 } from './validateBase64';

/**
 * Process image result from Hugging Face API (Blob or string) into data URL.
 *
 * @param imageResult - Image result (Blob or string)
 * @param usedProvider - Provider that was used
 * @param model - Model that was used
 * @returns {Promise<{ imageUrl: string; mimeType: string }>} Processed image data
 */
export async function processImageResult(
  imageResult: Blob | string,
  usedProvider: string,
  model: string,
): Promise<{ imageUrl: string; mimeType: string }> {
  let dataUrl: string;
  let mimeType: string;

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

  return { imageUrl: dataUrl, mimeType };
}
