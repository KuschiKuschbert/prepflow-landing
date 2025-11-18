import { useState, useEffect } from 'react';

/**
 * Initialize photo path from employee photo URL.
 *
 * @param {string | null} employeePhotoUrl - Existing employee photo URL
 * @returns {[string | null, Function]} Photo path state and setter
 */
export function usePhotoPath(employeePhotoUrl?: string | null) {
  const [photoPath, setPhotoPath] = useState<string | null>(null);

  useEffect(() => {
    // Initialize photoPath when editing existing employee
    if (employeePhotoUrl && !photoPath) {
      // Extract filename from URL for deletion tracking
      const fileName = employeePhotoUrl.split('/').pop();
      if (fileName) {
        setPhotoPath(fileName);
      }
    }
  }, [employeePhotoUrl, photoPath]);

  return [photoPath, setPhotoPath] as const;
}
