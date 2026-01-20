/**
 * Hook for category auto-detection logic.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { executeCategoryDetection } from './detection-executor';

interface FormData {
  ingredient_name?: string;
  brand?: string;
  storage_location?: string;
  category?: string;
}

export function useCategoryDetection(formData: FormData) {
  const [autoDetectedCategory, setAutoDetectedCategory] = useState<string | null>(null);
  const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryDetection = useCallback(
    (
      ingredientName: string,
      setFormData: React.Dispatch<React.SetStateAction<Partial<FormData>>>,
    ) => {
      // Clear existing timeout
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }

      // Early exit if condition not met
      const currentCategory = formData.category;
      if (currentCategory || ingredientName.trim().length <= 2) {
        return;
      }

      const { brand, storage_location } = formData;

      detectionTimeoutRef.current = setTimeout(() => {
        executeCategoryDetection(
          ingredientName,
          brand,
          storage_location,
          setFormData,
          setAutoDetectedCategory,
        );
      }, 500); // 500ms debounce
    },
    [formData.category, formData.brand, formData.storage_location],
  );

  const clearAutoDetectedCategory = useCallback(() => {
    setAutoDetectedCategory(null);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
    };
  }, []);

  return {
    autoDetectedCategory,
    handleCategoryDetection,
    clearAutoDetectedCategory,
    setAutoDetectedCategory,
  };
}
