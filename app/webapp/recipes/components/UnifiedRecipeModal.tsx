'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { convertToCOGSCalculations } from '../hooks/utils/recipeCalculationHelpers';
import { COGSCalculation } from '../../cogs/types';
import { COGSCalculation as RecipeCOGSCalculation } from '../types';
import { UnifiedRecipeModalHeader } from './UnifiedRecipeModalHeader';
import { UnifiedRecipeModalPreviewTab } from './UnifiedRecipeModalPreviewTab';
import { UnifiedRecipeModalIngredientsTab } from './UnifiedRecipeModalIngredientsTab';
import { UnifiedRecipeModalCogsTab } from './UnifiedRecipeModalCogsTab';

type ModalTab = 'preview' | 'ingredients' | 'cogs';

interface UnifiedRecipeModalProps {
  isOpen: boolean;
  recipe: Recipe | null;
  recipeIngredients: RecipeIngredientWithDetails[];
  aiInstructions: string;
  generatingInstructions: boolean;
  previewYield: number;
  shareLoading: boolean;
  onClose: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onShareRecipe: () => void;
  onPrint: () => void;
  onDuplicateRecipe: () => void;
  onDeleteRecipe: () => void;
  onUpdatePreviewYield: (newYield: number) => void;
  onRefreshIngredients: () => Promise<void>;
  capitalizeRecipeName: (name: string) => string;
  formatQuantity: (
    quantity: number,
    unit: string,
  ) => {
    value: string;
    unit: string;
    original: string;
  };
}

export function UnifiedRecipeModal({
  isOpen,
  recipe,
  recipeIngredients,
  aiInstructions,
  generatingInstructions,
  previewYield,
  shareLoading,
  onClose,
  onEditRecipe,
  onShareRecipe,
  onPrint,
  onDuplicateRecipe,
  onDeleteRecipe,
  onUpdatePreviewYield,
  onRefreshIngredients,
  capitalizeRecipeName,
  formatQuantity,
}: UnifiedRecipeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState<ModalTab>('preview');
  const [dishPortions, setDishPortions] = useState<number>(1);

  // Convert recipe ingredients to COGS calculations
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
    if (dishPortions <= 0) return totalCOGS;
    return totalCOGS / dishPortions;
  }, [totalCOGS, dishPortions]);

  // Initialize dish portions when recipe changes
  useEffect(() => {
    if (recipe) {
      setDishPortions(recipe.yield || 1);
    }
  }, [recipe]);

  // Keyboard shortcuts and focus management
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    modalRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'e' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Press E to edit (only if not in an input field)
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          if (recipe) {
            onEditRecipe(recipe);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [isOpen, onClose, onEditRecipe, recipe]);

  if (!isOpen || !recipe) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
    >
      <div className="animate-in zoom-in-95 max-h-[90vh] w-full max-w-6xl rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl duration-200">
        <div
          ref={modalRef}
          className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-[var(--surface)]/95 focus:outline-none"
          tabIndex={-1}
        >
          <UnifiedRecipeModalHeader
            recipe={recipe}
            activeTab={activeTab}
            dishPortions={dishPortions}
            shareLoading={shareLoading}
            capitalizeRecipeName={capitalizeRecipeName}
            onEditRecipe={onEditRecipe}
            onShareRecipe={onShareRecipe}
            onPrint={onPrint}
            onDuplicateRecipe={onDuplicateRecipe}
            onClose={onClose}
            onSetActiveTab={setActiveTab}
            onDishPortionsChange={setDishPortions}
          />

          {/* Content */}
          <div className="tablet:p-5 desktop:p-6 flex-1 overflow-y-auto p-4">
            {activeTab === 'preview' && (
              <UnifiedRecipeModalPreviewTab
                recipe={recipe}
                recipeIngredients={recipeIngredients}
                aiInstructions={aiInstructions}
                generatingInstructions={generatingInstructions}
                previewYield={previewYield}
                formatQuantity={formatQuantity}
              />
            )}

            {activeTab === 'ingredients' && (
              <UnifiedRecipeModalIngredientsTab
                recipe={recipe}
                recipeIngredients={recipeIngredients}
                previewYield={previewYield}
                formatQuantity={formatQuantity}
                onEditRecipe={onEditRecipe}
              />
            )}

            {activeTab === 'cogs' && (
              <UnifiedRecipeModalCogsTab
                calculations={calculations}
                totalCOGS={totalCOGS}
                costPerPortion={costPerPortion}
                dishPortions={dishPortions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
