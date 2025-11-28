/**
 * Hook for category auto-detection logic.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { autoDetectCategory } from '@/lib/ingredients/category-detection';
import { logger } from '@/lib/logger';

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

      // Only auto-detect if category is empty
      const currentCategory = formData.category;
      if (!currentCategory && ingredientName.trim().length > 2) {
        const brand = formData.brand;
        const storageLocation = formData.storage_location;

        detectionTimeoutRef.current = setTimeout(async () => {
          try {
            const { category } = await autoDetectCategory(
              ingredientName,
              brand,
              storageLocation,
              true, // use AI
            );

            if (category) {
              // Only update if category is still empty (user hasn't manually set it)
              setFormData(prev => {
                if (!prev.category) {
                  setAutoDetectedCategory(category);
                  return { ...prev, category };
                }
                return prev;
              });
            }
          } catch (error) {
            logger.error('Error auto-detecting category:', error);
          }
        }, 500); // 500ms debounce
      }
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
