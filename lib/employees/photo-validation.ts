/**
 * Photo validation utilities for employee photos
 */

export const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export interface PhotoValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate photo file type
 *
 * @param {File} file - File to validate
 * @returns {PhotoValidationResult} Validation result
 */
export function validatePhotoType(file: File): PhotoValidationResult {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_PHOTO_TYPES.join(', ')}`,
    };
  }

  // Also check file extension as a secondary check
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_PHOTO_EXTENSIONS.includes(fileExtension)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_PHOTO_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validate photo file size
 *
 * @param {File} file - File to validate
 * @returns {PhotoValidationResult} Validation result
 */
export function validatePhotoSize(file: File): PhotoValidationResult {
  if (file.size > MAX_PHOTO_SIZE) {
    const maxSizeMB = MAX_PHOTO_SIZE / 1024 / 1024;
    return {
      valid: false,
      error: `File size exceeds maximum of ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate photo file (type and size)
 *
 * @param {File} file - File to validate
 * @returns {PhotoValidationResult} Validation result
 */
export function validatePhoto(file: File): PhotoValidationResult {
  // Validate type first
  const typeValidation = validatePhotoType(file);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  // Validate size
  const sizeValidation = validatePhotoSize(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  return { valid: true };
}

/**
 * Format file size for display
 *
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

