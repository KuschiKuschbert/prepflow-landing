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
  const recipeIds = sectionsWithPrepInstructions
    .flatMap(section => section.recipeGrouped)
    .filter(item => item.instructions?.trim().length > 0)
    .map(item => item.recipeId);
  if (recipeIds.length === 0) return;

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

          const updatedSection = { ...section, recipeGrouped: updatedRecipeGrouped };
          const prepTechniques = aggregatePrepTechniques(updatedSection);
          const hasPrepTechniques =
            prepTechniques.cutShapes.length > 0 ||
            prepTechniques.sauces.length > 0 ||
            prepTechniques.marinations.length > 0 ||
            prepTechniques.preCookingSteps.length > 0 ||
            prepTechniques.specialTechniques.length > 0;
          if (hasPrepTechniques) updatedSection.prepTechniques = prepTechniques;
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
  } finally {
    setLoadingPrepDetails(false);
  }
}
