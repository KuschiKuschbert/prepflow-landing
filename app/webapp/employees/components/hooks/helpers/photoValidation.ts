import { validatePhoto } from '@/lib/employees/photo-validation';

/**
 * Validate photo file.
 *
 * @param {File} file - Photo file to validate
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export function validatePhotoFile(file: File): { valid: boolean; error?: string } {
  return validatePhoto(file);
}

/**
 * Create photo preview from file.
 *
 * @param {File} file - Photo file
 * @param {Function} setPhotoPreview - Preview state setter
 */
export function createPhotoPreview(
  file: File,
  setPhotoPreview: (preview: string | null) => void,
): void {
  const reader = new FileReader();
  reader.onloadend = () => {
    const result = reader.result as string;
    setPhotoPreview(result);
  };
  reader.readAsDataURL(file);
}
