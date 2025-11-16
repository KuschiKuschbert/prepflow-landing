'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { RecipeIngredientsList } from './RecipeIngredientsList';
import { Icon } from '@/components/ui/Icon';
import { X, Edit, Share2, Printer, Loader2, Copy, Trash2, ChefHat, Calculator, FileText } from 'lucide-react';
import { COGSTable } from '../../cogs/components/COGSTable';
import { COGSTableSummary } from '../../cogs/components/COGSTableSummary';
import { PricingTool } from '../../cogs/components/PricingTool';
import { usePricing } from '../../cogs/hooks/usePricing';
import { convertToCOGSCalculations } from '../hooks/utils/recipeCalculationHelpers';
import { COGSCalculation } from '../../cogs/types';
import { COGSCalculation as RecipeCOGSCalculation } from '../types';

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
    return recipeCOGS.map((calc: RecipeCOGSCalculation): COGSCalculation => ({
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
    }));
  }, [recipe, recipeIngredients]);

  const totalCOGS = useMemo(() => {
    return calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  }, [calculations]);

  const costPerPortion = useMemo(() => {
    if (dishPortions <= 0) return totalCOGS;
    return totalCOGS / dishPortions;
  }, [totalCOGS, dishPortions]);

  const {
    targetGrossProfit,
    pricingStrategy,
    pricingCalculation,
    allStrategyPrices,
    setTargetGrossProfit,
    setPricingStrategy,
  } = usePricing(costPerPortion);

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
  }, [isOpen, onClose]);

  if (!isOpen || !recipe) return null;

  const tabs = [
    { id: 'preview' as ModalTab, label: 'Preview', icon: FileText },
    { id: 'ingredients' as ModalTab, label: 'Ingredients', icon: ChefHat },
    { id: 'cogs' as ModalTab, label: 'COGS', icon: Calculator },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
    >
      <div
        ref={modalRef}
        className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-[#1f1f1f] shadow-2xl animate-in zoom-in-95 duration-200 focus:outline-none flex flex-col"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="border-b border-[#2a2a2a] p-4 tablet:p-5 desktop:p-6 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2
                id="recipe-modal-title"
                className="text-xl tablet:text-xl desktop:text-2xl font-bold text-white"
              >
                {capitalizeRecipeName(recipe.name)}
              </h2>

              {/* Yield and Portions */}
              <div className="mt-2 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Yield:</span>
                  <span className="font-medium text-white">
                    {recipe.yield} {recipe.yield_unit}
                  </span>
                </div>

                {activeTab === 'cogs' && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Portions:</span>
                    <input
                      type="number"
                      value={dishPortions}
                      onChange={e => setDishPortions(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] text-center text-sm font-medium text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      min="1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEditRecipe(recipe)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
                title="Edit recipe (Press E)"
              >
                <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
                <span className="hidden tablet:inline">Edit</span>
                <span className="hidden text-xs opacity-70 tablet:inline">(E)</span>
              </button>
              <button
                onClick={onDuplicateRecipe}
                className="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
                title="Duplicate recipe"
              >
                <Icon icon={Copy} size="sm" aria-hidden={true} />
                <span className="hidden tablet:inline">Duplicate</span>
              </button>
              <button
                onClick={onShareRecipe}
                disabled={shareLoading}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-[#10B981]/80 hover:to-[#059669]/80 disabled:cursor-not-allowed disabled:opacity-50"
                title="Share recipe"
              >
                {shareLoading ? (
                  <>
                    <Icon icon={Loader2} size="sm" className="animate-spin text-white" aria-hidden={true} />
                    <span className="hidden tablet:inline">Sharing...</span>
                  </>
                ) : (
                  <>
                    <Icon icon={Share2} size="sm" className="text-white" aria-hidden={true} />
                    <span className="hidden tablet:inline">Share</span>
                  </>
                )}
              </button>
              <button
                onClick={onPrint}
                className="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
                title="Print recipe"
              >
                <Icon icon={Printer} size="sm" aria-hidden={true} />
                <span className="hidden tablet:inline">Print</span>
              </button>
              <button
                onClick={onClose}
                className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                aria-label="Close recipe modal"
              >
                <Icon icon={X} size="md" aria-hidden={true} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#2a2a2a]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[#29E7CD] text-[#29E7CD]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon icon={tab.icon} size="sm" aria-hidden={true} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 tablet:p-5 desktop:p-6">
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Ingredients Summary */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Icon icon={ChefHat} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                  Ingredients
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    ({recipeIngredients.length} item{recipeIngredients.length !== 1 ? 's' : ''})
                  </span>
                </h3>
                <RecipeIngredientsList
                  recipeIngredients={recipeIngredients}
                  selectedRecipe={recipe}
                  previewYield={previewYield}
                  formatQuantity={formatQuantity}
                />
              </div>

              {/* AI Instructions */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                  AI-Generated Cooking Method
                </h3>
                <div className="rounded-lg bg-[#0a0a0a] p-4">
                  {generatingInstructions ? (
                    <div className="flex items-center justify-center py-8">
                      <Icon icon={Loader2} size="lg" className="animate-spin text-[#29E7CD]" aria-hidden={true} />
                      <span className="ml-3 text-gray-400">Generating cooking instructions...</span>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-gray-300">{aiInstructions}</div>
                  )}
                </div>
              </div>

              {/* Manual Instructions */}
              {recipe.instructions ? (
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                    Manual Instructions
                  </h3>
                  <div className="rounded-lg bg-[#0a0a0a] p-4">
                    <p className="whitespace-pre-wrap text-gray-300">{recipe.instructions}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
                    Manual Instructions
                  </h3>
                  <div className="rounded-lg bg-[#0a0a0a] p-8 text-center text-gray-500">
                    No instructions added yet. Use the Edit button to add instructions.
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Recipe Ingredients</h3>
                <button
                  onClick={() => onEditRecipe(recipe)}
                  className="rounded-lg bg-[#29E7CD] px-4 py-2 text-sm font-medium text-white hover:bg-[#29E7CD]/80"
                >
                  Add/Edit Ingredients
                </button>
              </div>
              <RecipeIngredientsList
                recipeIngredients={recipeIngredients}
                selectedRecipe={recipe}
                previewYield={previewYield}
                formatQuantity={formatQuantity}
              />
            </div>
          )}

          {activeTab === 'cogs' && (
            <div className="space-y-6">
              {calculations.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  No ingredients found. Add ingredients to see COGS breakdown.
                </div>
              ) : (
                <>
                  <COGSTable
                    calculations={calculations}
                    editingIngredient={null}
                    editQuantity={0}
                    onEditIngredient={() => {}}
                    onSaveEdit={() => {}}
                    onCancelEdit={() => {}}
                    onRemoveIngredient={() => {}}
                    onEditQuantityChange={() => {}}
                    totalCOGS={totalCOGS}
                    costPerPortion={costPerPortion}
                    dishPortions={dishPortions}
                  />
                  <COGSTableSummary
                    totalCOGS={totalCOGS}
                    costPerPortion={costPerPortion}
                    dishPortions={dishPortions}
                  />
                  {costPerPortion > 0 && (
                    <PricingTool
                      costPerPortion={costPerPortion}
                      targetGrossProfit={targetGrossProfit}
                      pricingStrategy={pricingStrategy}
                      pricingCalculation={pricingCalculation}
                      allStrategyPrices={allStrategyPrices}
                      onTargetGrossProfitChange={setTargetGrossProfit}
                      onPricingStrategyChange={setPricingStrategy}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
