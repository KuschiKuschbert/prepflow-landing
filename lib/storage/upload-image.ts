/**
 * Storage Upload Utility
 * Uploads base64 image data URLs to Supabase Storage
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

const DEFAULT_BUCKET = 'recipe-images';

/**
 * Converts a base64 data URL to a Buffer
 *
 * @param {string} dataUrl - Base64 data URL (e.g., "data:image/png;base64,...")
 * @returns {Buffer} Image buffer
 */
function dataUrlToBuffer(dataUrl: string): Buffer {
  // Remove data URL prefix (e.g., "data:image/png;base64,")
  const base64Data = dataUrl.split(',')[1];
  if (!base64Data) {
    throw new Error('Invalid data URL format');
  }
  return Buffer.from(base64Data, 'base64');
}

/**
 * Extracts content type from data URL
 *
 * @param {string} dataUrl - Base64 data URL
 * @returns {string} MIME type (e.g., "image/png")
 */
function getContentTypeFromDataUrl(dataUrl: string): string {
  const match = dataUrl.match(/data:([^;]+)/);
  return match ? match[1] : 'image/png';
}

/**
 * Uploads a base64 image data URL to Supabase Storage
 *
 * @param {string} dataUrl - Base64 data URL of the image
 * @param {string} fileName - File name (without extension, will be auto-generated)
 * @param {string} [bucket] - Storage bucket name (default: 'recipe-images')
 * @returns {Promise<string>} Public URL of the uploaded image
 * @throws {Error} If upload fails
 */
export async function uploadImageToStorage(
  dataUrl: string,
  fileName: string,
  bucket: string = DEFAULT_BUCKET,
): Promise<string> {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    // Convert data URL to buffer
    const buffer = dataUrlToBuffer(dataUrl);
    const contentType = getContentTypeFromDataUrl(dataUrl);

    // Generate unique filename with extension
    const extension = contentType.split('/')[1] || 'png';
    const uniqueFileName = `${fileName}-${Date.now()}.${extension}`;
    const filePath = uniqueFileName;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      logger.error('[Storage Upload] Upload error:', {
        error: uploadError.message,
        bucket,
        filePath,
      });

      // Check if bucket exists, if not, provide helpful error
      if (uploadError.message.includes('Bucket not found')) {
        throw new Error(
          `Storage bucket '${bucket}' not found. Please create it in Supabase Dashboard > Storage.`,
        );
      }

      throw uploadError;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);

    logger.dev('[Storage Upload] Successfully uploaded image:', {
      bucket,
      filePath,
      publicUrl,
    });

    return publicUrl;
  } catch (err) {
    logger.error('[Storage Upload] Failed to upload image:', {
      error: err instanceof Error ? err.message : String(err),
      fileName,
      bucket,
    });
    throw err;
  }
}

/**
 * Uploads multiple images to Supabase Storage
 *
 * @param {Array<{ dataUrl: string; fileName: string }>} images - Array of image data URLs and file names
 * @param {string} [bucket] - Storage bucket name (default: 'recipe-images')
 * @returns {Promise<string[]>} Array of public URLs
 */
export async function uploadImagesToStorage(
  images: Array<{ dataUrl: string; fileName: string }>,
  bucket: string = DEFAULT_BUCKET,
): Promise<string[]> {
  const uploadPromises = images.map(({ dataUrl, fileName }) =>
    uploadImageToStorage(dataUrl, fileName, bucket),
  );
  return Promise.all(uploadPromises);
}
