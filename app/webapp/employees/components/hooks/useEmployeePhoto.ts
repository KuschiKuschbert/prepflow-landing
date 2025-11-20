import { useState, useRef } from 'react';
import { validatePhoto } from '@/lib/employees/photo-validation';
import { useNotification } from '@/contexts/NotificationContext';
import { createPhotoPreview } from './helpers/photoValidation';
import { usePhotoPath } from './helpers/photoStateManagement';
import { handlePhotoUpload, handlePhotoRemoval } from './helpers/photoUploadHandler';

interface UseEmployeePhotoProps {
  employeePhotoUrl?: string | null;
  employeeId?: string;
  onPhotoUrlChange: (url: string) => void;
}

/**
 * Hook for managing employee photo upload and removal.
 *
 * @param {Object} props - Hook props
 * @param {string | null} [props.employeePhotoUrl] - Existing employee photo URL
 * @param {string} [props.employeeId] - Employee ID for upload
 * @param {Function} props.onPhotoUrlChange - Callback when photo URL changes
 * @returns {Object} Photo management state and handlers
 */
export function useEmployeePhoto({
  employeePhotoUrl,
  employeeId,
  onPhotoUrlChange,
}: UseEmployeePhotoProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(employeePhotoUrl || null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoPath, setPhotoPath] = usePhotoPath(employeePhotoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useNotification();

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setPhotoError(null);

    // Validate file
    const validation = validatePhoto(file);
    if (!validation.valid) {
      setPhotoError(validation.error || 'Invalid photo file');
      showError(validation.error || 'Invalid photo file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview immediately
    createPhotoPreview(file, setPhotoPreview);

    // Upload to Supabase Storage
    await handlePhotoUpload({
      file,
      employeeId: employeeId || 'temp',
      setPhotoUploading,
      setPhotoError,
      setPhotoPreview,
      setPhotoPath,
      onPhotoUrlChange,
      fileInputRef,
      showSuccess,
      showError,
    });
  };

  const handleRemovePhoto = async () => {
    await handlePhotoRemoval(
      photoPath,
      employeePhotoUrl,
      setPhotoPreview,
      setPhotoPath,
      onPhotoUrlChange,
      fileInputRef,
    );
  };

  return {
    photoPreview,
    photoUploading,
    photoError,
    photoPath,
    fileInputRef,
    handlePhotoChange,
    handleRemovePhoto,
  };
}
