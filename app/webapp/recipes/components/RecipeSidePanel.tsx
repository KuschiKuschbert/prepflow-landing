'use client';

import { FoodImageGenerator } from '@/components/ui/FoodImageGenerator';
import { Icon } from '@/components/ui/Icon';
import { ChefHat } from 'lucide-react';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { COGSTable } from '../../cogs/components/COGSTable';
import { COGSCalculation } from '../../cogs/types';
import { useSidePanelCommon } from '../hooks/useSidePanelCommon';
import { convertToPerPortion } from '../hooks/utils/convertToPerPortion';
import { calculateRecipePrice } from '../hooks/utils/pricingHelpers';
import { convertToCOGSCalculations } from '../hooks/utils/recipeCalculationHelpers';
import {
    Recipe,
    COGSCalculation as RecipeCOGSCalculation,
    RecipeIngredientWithDetails,
} from '../types';
import { RecipeIngredientsList } from './RecipeIngredientsList';
import { RecipeSidePanelActions } from './RecipeSidePanelActions';
import { RecipeSidePanelCostSummary } from './RecipeSidePanelCostSummary';
import { RecipeSidePanelHeader } from './RecipeSidePanelHeader';

interface RecipeSidePanelProps {
  isOpen: boolean;
  recipe: Recipe | null;
  recipeIngredients: RecipeIngredientWithDetails[];
  previewYield: number;
  onClose: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  capitalizeRecipeName: (name: string) => string;
  formatQuantity: (
    quantity: number,
    unit: string,
  ) => {
    value: string;
    unit: string;
    original: string;
  };
  onImagesGenerated?: (recipeId: string, primaryUrl: string | null, alternativeUrl: string | null) => void;
}

export function RecipeSidePanel({
  isOpen,
  recipe,
  recipeIngredients,
  previewYield,
  onClose,
  onEditRecipe,
  onDeleteRecipe,
  capitalizeRecipeName,
  formatQuantity,
  onImagesGenerated,
}: RecipeSidePanelProps) {
  // Use shared hook for common side panel functionality
  const { panelRef, mounted, panelStyle } = useSidePanelCommon({
    isOpen,
    onClose,
    onEdit: recipe ? () => onEditRecipe(recipe) : undefined,
  });

  // Convert recipe ingredients to COGS calculations for summary
  const calculations: COGSCalculation[] = useMemo(() => {
    if (!recipe || recipeIngredients.length === 0) return [];
    const recipeCOGS = convertToCOGSCalculations(recipeIngredients, recipe.id);
    return recipeCOGS.map(
      (calc: RecipeCOGSCalculation): COGSCalculation => ({
        recipeId: recipe.id,
        ingredientId: calc.ingredientId || calc.ingredient_id || '',
        ingredientName: calc.ingredientName || calc.ingredient_name || '',
        quantity: calc.quantity,
        unit: calc.unit,
        costPerUnit: calc.cost_per_unit || 0,
        totalCost: calc.total_cost || 0,
        wasteAdjustedCost: calc.yieldAdjustedCost,
        yieldAdjustedCost: calc.yieldAdjustedCost,
        id: calc.id,
        ingredient_id: calc.ingredient_id,
        ingredient_name: calc.ingredient_name,
        cost_per_unit: calc.cost_per_unit,
        total_cost: calc.total_cost,
        supplier_name: calc.supplier_name,
        category: calc.category,
      }),
    );
  }, [recipe, recipeIngredients]);

  const totalCOGS = useMemo(() => {
    return calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  }, [calculations]);

  const costPerPortion = useMemo(() => {
    if (!recipe || recipe.yield <= 0) return totalCOGS;
    return totalCOGS / recipe.yield;
  }, [totalCOGS, recipe]);

  // Convert calculations to per-portion for breakdown display
  const perPortionCalculations = useMemo(() => {
    if (!recipe || recipe.yield <= 0) return calculations;
    return convertToPerPortion(calculations, recipe.yield);
  }, [calculations, recipe]);

  // Calculate recipe price data for profit metrics
  const recipePrice = useMemo(() => {
    if (!recipe || recipeIngredients.length === 0) return null;
    return calculateRecipePrice(recipe, recipeIngredients);
  }, [recipe, recipeIngredients]);

  if (!isOpen || !recipe || !mounted) return null;

  const panelContent = (
    <>
      {/* Backdrop - only on mobile */}
      <div
        className="desktop:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{
          top: 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <div
        ref={panelRef}
        className={`desktop:max-w-lg fixed right-0 z-[65] w-full max-w-md bg-[#1f1f1f] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={panelStyle}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-panel-title"
      >
        <div className="flex h-full flex-col overflow-hidden">
          <RecipeSidePanelHeader
            recipe={recipe}
            capitalizeRecipeName={capitalizeRecipeName}
            onClose={onClose}
          />

          <div
            className="flex-1 space-y-6 overflow-x-hidden overflow-y-auto p-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Food Image Generation */}
            {recipe && (
              <FoodImageGenerator
                entityType="recipe"
                entityId={recipe.id}
                entityName={recipe.recipe_name}
                imageUrl={(recipe as any)?.image_url}
                imageUrlAlternative={(recipe as any)?.image_url_alternative}
                onImagesGenerated={(primaryUrl, alternativeUrl) => {
                  onImagesGenerated?.(recipe.id, primaryUrl, alternativeUrl);
                }}
                className="mb-6"
                compact={false}
              />
            )}

            <RecipeSidePanelCostSummary
              calculations={calculations}
              totalCOGS={totalCOGS}
              costPerPortion={costPerPortion}
              recipePrice={recipePrice}
            />

            {/* COGS Breakdown (per portion) */}
            {perPortionCalculations.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">
                  COGS Breakdown (per portion)
                </h3>
                <div className="rounded-lg bg-[#1f1f1f] p-4">
                  <COGSTable
                    calculations={perPortionCalculations}
                    editingIngredient={null}
                    editQuantity={0}
                    onEditIngredient={() => {}}
                    onSaveEdit={() => {}}
                    onCancelEdit={() => {}}
                    onRemoveIngredient={() => {}}
                    onEditQuantityChange={() => {}}
                    totalCOGS={costPerPortion}
                    costPerPortion={costPerPortion}
                    dishPortions={1}
                  />
                </div>
              </div>
            )}

            {/* Ingredients Summary */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Icon icon={ChefHat} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                <h3 className="text-sm font-semibold text-white">
                  Ingredients ({recipeIngredients.length})
                </h3>
                <span className="text-xs text-gray-500">
                  - Yield: {recipe.yield} {recipe.yield_unit || 'servings'}
                </span>
              </div>
              <RecipeIngredientsList
                recipeIngredients={recipeIngredients}
                selectedRecipe={recipe}
                previewYield={previewYield}
                formatQuantity={formatQuantity}
              />
            </div>

            {/* Instructions Preview */}
            {recipe.instructions && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">Instructions</h3>
                <div className="rounded-lg bg-[#0a0a0a] p-4">
                  <p className="line-clamp-4 text-sm whitespace-pre-wrap text-gray-300">
                    {recipe.instructions}
                  </p>
                </div>
              </div>
            )}
          </div>

          <RecipeSidePanelActions
            recipe={recipe}
            onEditRecipe={onEditRecipe}
            onDeleteRecipe={onDeleteRecipe}
          />
        </div>
      </div>
    </>
  );

  // Render panel in a portal to ensure it's fixed to viewport
  return typeof window !== 'undefined' ? createPortal(panelContent, document.body) : null;
}
