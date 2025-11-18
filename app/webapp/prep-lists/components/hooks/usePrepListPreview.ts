import { useState, useEffect } from 'react';
import type {
  GeneratedPrepListData,
  SectionData,
  KitchenSection,
  RecipePrepDetails,
} from '../../types';
import { usePrepListHandlers } from './usePrepListHandlers';
import { aggregatePrepTechniques, addPrepNotesToIngredients } from '../../utils/prepTechniques';
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
  const [loadingPrepDetails, setLoadingPrepDetails] = useState(false);

  useEffect(() => {
    // Ensure all sections have prepInstructions array initialized
    const sectionsWithPrepInstructions = data.sections.map(section => ({
      ...section,
      prepInstructions: section.prepInstructions || [],
    }));
    setSections(sectionsWithPrepInstructions);

    // Load prep details asynchronously after prep list is displayed
    const loadPrepDetails = async () => {
      // Collect all recipe IDs that have instructions
      const recipeIds: string[] = [];
      for (const section of sectionsWithPrepInstructions) {
        for (const recipeItem of section.recipeGrouped) {
          if (recipeItem.instructions && recipeItem.instructions.trim().length > 0) {
            recipeIds.push(recipeItem.recipeId);
          }
        }
      }

      if (recipeIds.length === 0) {
        return; // No recipes with instructions to analyze
      }

      try {
        setLoadingPrepDetails(true);
        const response = await fetch('/api/prep-lists/analyze-prep-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipeIds,
            countryCode: 'AU', // TODO: Get from user context
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze prep details');
        }

        const result = await response.json();
        if (result.success && result.prepDetails) {
          // Update sections with prep details
          setSections(prevSections => {
            return prevSections.map(section => {
              const updatedRecipeGrouped = section.recipeGrouped.map(recipeItem => {
                const prepDetails = result.prepDetails[recipeItem.recipeId] as
                  | RecipePrepDetails
                  | undefined;
                if (prepDetails) {
                  return {
                    ...recipeItem,
                    prepDetails,
                  };
                }
                return recipeItem;
              });

              const updatedSection = {
                ...section,
                recipeGrouped: updatedRecipeGrouped,
              };

              // Aggregate prep techniques for the section
              const prepTechniques = aggregatePrepTechniques(updatedSection);
              if (
                prepTechniques.cutShapes.length > 0 ||
                prepTechniques.sauces.length > 0 ||
                prepTechniques.marinations.length > 0 ||
                prepTechniques.preCookingSteps.length > 0 ||
                prepTechniques.specialTechniques.length > 0
              ) {
                updatedSection.prepTechniques = prepTechniques;
              }

              // Add prep notes to ingredients
              addPrepNotesToIngredients(updatedSection);

              return updatedSection;
            });
          });
        }
      } catch (err) {
        logger.warn('Failed to load prep details:', err instanceof Error ? { error: err.message } : undefined);
        // Don't show error to user - prep list still works without prep details
      } finally {
        setLoadingPrepDetails(false);
      }
    };

    loadPrepDetails();
  }, [data]);

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
