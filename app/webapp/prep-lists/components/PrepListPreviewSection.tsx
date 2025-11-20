/**
 * Section component for PrepListPreview.
 */

import { Icon } from '@/components/ui/Icon';
import { Loader2 } from 'lucide-react';
import { PrepListAggregatedView } from './PrepListAggregatedView';
import { PrepListRecipeGroupedView } from './PrepListRecipeGroupedView';
import { PrepInstructionsView } from './PrepInstructionsView';
import { PrepTechniquesView } from './PrepTechniquesView';
import type { GeneratedPrepListData } from '../types';

interface PrepListPreviewSectionProps {
  section: GeneratedPrepListData['sections'][0];
  sectionIndex: number;
  viewMode: 'aggregated' | 'recipe-grouped';
  kitchenSections: Array<{ id: string; name: string }>;
  safeIngredients: Array<{ id: string; name?: string; ingredient_name?: string; unit: string }>;
  loadingPrepDetails: boolean;
  handleSectionChange: (index: number, sectionId: string | null) => void;
  handleAddIngredient: (index: number, ingredientId?: string) => void;
  handleQuantityChange: (sectionIndex: number, ingredientIndex: number, quantity: number) => void;
  handleRemoveIngredient: (sectionIndex: number, ingredientIndex: number) => void;
  handleIngredientSelect: (
    sectionIndex: number,
    ingredientIndex: number,
    ingredientId: string,
  ) => void;
}

/**
 * Section component for PrepListPreview.
 *
 * @param {PrepListPreviewSectionProps} props - Component props
 * @returns {JSX.Element | null} Section component or null if empty
 */
export function PrepListPreviewSection({
  section,
  sectionIndex,
  viewMode,
  kitchenSections,
  safeIngredients,
  loadingPrepDetails,
  handleSectionChange,
  handleAddIngredient,
  handleQuantityChange,
  handleRemoveIngredient,
  handleIngredientSelect,
}: PrepListPreviewSectionProps) {
  const hasPrepInstructions = section.prepInstructions && section.prepInstructions.length > 0;
  const hasPrepTechniques =
    section.prepTechniques &&
    (section.prepTechniques.cutShapes.length > 0 ||
      section.prepTechniques.sauces.length > 0 ||
      section.prepTechniques.marinations.length > 0 ||
      section.prepTechniques.preCookingSteps.length > 0 ||
      section.prepTechniques.specialTechniques.length > 0);
  const hasContent =
    section.aggregatedIngredients.length > 0 ||
    section.recipeGrouped.length > 0 ||
    hasPrepInstructions ||
    hasPrepTechniques;

  if (
    (viewMode === 'aggregated' &&
      section.aggregatedIngredients.length === 0 &&
      !hasPrepInstructions &&
      !hasPrepTechniques) ||
    (viewMode === 'recipe-grouped' &&
      section.recipeGrouped.length === 0 &&
      !hasPrepInstructions &&
      !hasPrepTechniques)
  ) {
    return null;
  }

  return (
    <div key={sectionIndex} className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">{section.sectionName}</h3>
          {section.sectionId === null && (
            <select
              value=""
              onChange={e => handleSectionChange(sectionIndex, e.target.value || null)}
              className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-1 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            >
              <option value="">Assign to section...</option>
              {kitchenSections.map(ks => (
                <option key={ks.id} value={ks.id}>
                  {ks.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {viewMode === 'aggregated' && (
          <div className="flex items-center gap-2">
            <select
              onChange={e => {
                if (e.target.value) {
                  handleAddIngredient(sectionIndex, e.target.value);
                  e.target.value = '';
                }
              }}
              className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              defaultValue=""
            >
              <option value="">Add ingredient...</option>
              {safeIngredients.map(ing => {
                const ingName = ing.name || ing.ingredient_name || '';
                return (
                  <option key={ing.id} value={ing.id}>
                    {ingName} ({ing.unit})
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {viewMode === 'aggregated' && (
        <PrepListAggregatedView
          section={section}
          sectionIndex={sectionIndex}
          safeIngredients={safeIngredients}
          handleQuantityChange={handleQuantityChange}
          handleRemoveIngredient={handleRemoveIngredient}
          handleIngredientSelect={handleIngredientSelect}
        />
      )}

      {viewMode === 'recipe-grouped' && <PrepListRecipeGroupedView section={section} />}

      {/* Prep Instructions - shown in both views */}
      {section.prepInstructions && section.prepInstructions.length > 0 && (
        <PrepInstructionsView prepInstructions={section.prepInstructions} />
      )}

      {/* Prep Techniques - shown in both views */}
      {loadingPrepDetails && !section.prepTechniques && (
        <div className="mt-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Analyzing prep techniques...</span>
          </div>
        </div>
      )}
      {section.prepTechniques && <PrepTechniquesView prepTechniques={section.prepTechniques} />}
    </div>
  );
}
