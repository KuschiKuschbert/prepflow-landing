import { useState, useEffect } from 'react';
import type { GeneratedPrepListData, SectionData, KitchenSection } from '../../types';
import { usePrepListHandlers } from './usePrepListHandlers';
import { loadPrepDetails } from './usePrepListPreview/prepDetailsLoading';
import { logger } from '@/lib/logger';

interface UsePrepListPreviewProps {
  data: GeneratedPrepListData;
  kitchenSections: KitchenSection[];
  ingredients: Array<{ id: string; name?: string; ingredient_name?: string; unit: string }>;
}

export function usePrepListPreview({
  data,
  kitchenSections,
  ingredients,
}: UsePrepListPreviewProps) {
  const [sections, setSections] = useState<SectionData[]>(
    data.sections.map(section => ({
      ...section,
      prepInstructions: section.prepInstructions || [],
    })),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // No loading state for mutations - optimistic updates handle UI updates
  const loadingPrepDetails = false;

  useEffect(() => {
    // Ensure all sections have prepInstructions array initialized
    const sectionsWithPrepInstructions = data.sections.map(section => ({
      ...section,
      prepInstructions: section.prepInstructions || [],
    }));
    setSections(sectionsWithPrepInstructions);

    // Load prep details asynchronously after prep list is displayed
    loadPrepDetails({
      sectionsWithPrepInstructions,
      setSections,
    }).catch(err => {
      logger.error('Failed to load prep details:', err);
    });
  }, [data, setSections]);

  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  const {
    handleQuantityChange,
    handleRemoveIngredient,
    handleAddIngredient,
    handleIngredientSelect,
    handleSectionChange,
  } = usePrepListHandlers({
    sections,
    setSections,
    kitchenSections,
    safeIngredients,
  });

  const prepareSaveData = () => {
    return sections
      .filter(section => section.aggregatedIngredients.length > 0)
      .map(section => ({
        sectionId: section.sectionId,
        name: `${data.menuName} - ${section.sectionName}`,
        items: section.aggregatedIngredients
          .filter(item => item.ingredientId && item.totalQuantity > 0)
          .map(item => ({
            ingredientId: item.ingredientId,
            quantity: item.totalQuantity.toString(),
            unit: item.unit,
            notes: '',
          })),
      }))
      .filter(prepList => prepList.items.length > 0);
  };

  return {
    sections,
    saving,
    error,
    loadingPrepDetails,
    setSaving,
    setError,
    handleQuantityChange,
    handleRemoveIngredient,
    handleAddIngredient,
    handleIngredientSelect,
    handleSectionChange,
    prepareSaveData,
  };
}
