/**
 * Prep details loading logic for prep list preview.
 */

import { logger } from '@/lib/logger';
import { aggregatePrepTechniques, addPrepNotesToIngredients } from '../../../utils/prepTechniques';
import type { SectionData, RecipePrepDetails } from '../../../types';

interface PrepDetailsLoadingProps {
  sectionsWithPrepInstructions: SectionData[];
  setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
  setLoadingPrepDetails: (loading: boolean) => void;
}

/**
 * Load prep details for recipes in prep list.
 *
 * @param {PrepDetailsLoadingProps} props - Prep details loading props
 */
export async function loadPrepDetails({
  sectionsWithPrepInstructions,
  setSections,
  setLoadingPrepDetails,
}: PrepDetailsLoadingProps): Promise<void> {
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
    logger.warn(
      'Failed to load prep details:',
      err instanceof Error ? { error: err.message } : undefined,
    );
    // Don't show error to user - prep list still works without prep details
  } finally {
    setLoadingPrepDetails(false);
  }
}
