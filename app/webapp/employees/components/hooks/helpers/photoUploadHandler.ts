import { logger } from '@/lib/logger';
import { deletePhoto, uploadPhoto } from './photoUpload';

interface PhotoUploadHandlerProps {
  file: File;
  employeeId: string;
  setPhotoUploading: (uploading: boolean) => void;
  setPhotoError: (error: string | null) => void;
  setPhotoPreview: (preview: string | null) => void;
  setPhotoPath: (path: string | null) => void;
  onPhotoUrlChange: (url: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

/**
 * Handle photo upload.
 *
 * @param {PhotoUploadHandlerProps} props - Upload handler props
 */
export async function handlePhotoUpload({
  file,
  employeeId,
  setPhotoUploading,
  setPhotoError,
  setPhotoPreview,
  setPhotoPath,
  onPhotoUrlChange,
  fileInputRef,
  showSuccess,
  showError,
}: PhotoUploadHandlerProps): Promise<void> {
  setPhotoUploading(true);
  try {
    const { url, path } = await uploadPhoto(file, employeeId || 'temp');
    setPhotoPath(path);
    onPhotoUrlChange(url);
    setPhotoError(null);
    showSuccess('Photo uploaded successfully');
  } catch (error: any) {
    logger.error('Error uploading photo:', error);
    const errorMessage = error.message || 'Failed to upload photo. Give it another go, chef.';
    setPhotoError(errorMessage);
    setPhotoPreview(null);
    showError(errorMessage);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  } finally {
    setPhotoUploading(false);
  }
}

/**
 * Handle photo removal.
 *
 * @param {string | null} photoPath - Photo path
 * @param {string | null} employeePhotoUrl - Employee photo URL
 * @param {Function} setPhotoPreview - Preview setter
 * @param {Function} setPhotoPath - Path setter
 * @param {Function} onPhotoUrlChange - URL change callback
 * @param {React.RefObject<HTMLInputElement | null>} fileInputRef - File input ref
 */
export async function handlePhotoRemoval(
  photoPath: string | null,
  employeePhotoUrl: string | null | undefined,
  setPhotoPreview: (preview: string | null) => void,
  setPhotoPath: (path: string | null) => void,
  onPhotoUrlChange: (url: string) => void,
  fileInputRef: React.RefObject<HTMLInputElement | null>,
): Promise<void> {
  if (photoPath || employeePhotoUrl) {
    try {
      const pathToDelete = photoPath || employeePhotoUrl;
      if (pathToDelete && !pathToDelete.startsWith('data:')) {
        const fileName = pathToDelete.split('/').pop() || pathToDelete;
        await deletePhoto(fileName);
      }
    } catch (error) {
      logger.error('Error deleting photo:', error);
    }
  }
  setPhotoPreview(null);
  setPhotoPath(null);
  onPhotoUrlChange('');
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
}
