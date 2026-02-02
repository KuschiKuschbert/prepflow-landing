/**
 * Hook for fetching prep lists data (kitchen sections, ingredients).
 */

import { useState, useEffect } from 'react';
import { getCachedData, cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { KitchenSection, Ingredient } from '@/lib/types/prep-lists';

interface UsePrepListsDataProps {
  showForm: boolean;
  showGenerateModal: boolean;
  showPreview: boolean;
  userId: string;
}

/**
 * Hook for fetching prep lists data.
 *
 * @param {UsePrepListsDataProps} props - Hook dependencies
 * @returns {Object} Data state
 */
export function usePrepListsData({
  showForm,
  showGenerateModal,
  showPreview,
  userId,
}: UsePrepListsDataProps) {
  const [kitchenSections, setKitchenSections] = useState<KitchenSection[]>(
    () => getCachedData('kitchen_sections') || [],
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    () => getCachedData('prep_lists_ingredients') || [],
  );

  // Fetch kitchen sections on mount (needed for display)
  useEffect(() => {
    const fetchKitchenSections = async () => {
      // Check cache first
      const cached = getCachedData('kitchen_sections');
      if (cached && Array.isArray(cached) && cached.length > 0) {
        setKitchenSections(cached);
        return; // Use cached data, skip API call
      }

      try {
        const response = await fetch(`/api/kitchen-sections?userId=${userId}`);
        const result = await response.json();

        if (result.success) {
          setKitchenSections(result.data);
          cacheData('kitchen_sections', result.data);
        }
      } catch (err) {
        logger.error('Failed to fetch kitchen sections:', err);
      }
    };

    fetchKitchenSections();
  }, [userId]);

  // Lazy load ingredients when form, generate modal, or preview is opened
  useEffect(() => {
    if (!showForm && !showGenerateModal && !showPreview) return; // Don't fetch until needed

    const fetchIngredients = async () => {
      // Check cache first
      const cached = getCachedData('prep_lists_ingredients');
      if (cached && Array.isArray(cached) && cached.length > 0) {
        setIngredients(cached);
        return; // Use cached data, skip API call
      }

      try {
        // Only fetch first 50 ingredients for form dropdown
        const response = await fetch(`/api/ingredients?page=1&pageSize=50`);
        const result = await response.json();

        if (result.success) {
          const items = result.data?.items || result.data || [];
          const ingredientsArray = Array.isArray(items) ? items : [];
          setIngredients(ingredientsArray);
          cacheData('prep_lists_ingredients', ingredientsArray);
        }
      } catch (err) {
        logger.error('Failed to fetch ingredients:', err);
      }
    };

    fetchIngredients();
  }, [showForm, showGenerateModal, showPreview]);

  return {
    kitchenSections,
    ingredients,
  };
}
