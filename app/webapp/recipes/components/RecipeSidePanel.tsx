'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { RecipeIngredientsList } from './RecipeIngredientsList';
import { Icon } from '@/components/ui/Icon';
import { X, Edit, Trash2, ChefHat, Calculator } from 'lucide-react';
import { convertToCOGSCalculations } from '../hooks/utils/recipeCalculationHelpers';
import { COGSCalculation } from '../../cogs/types';
import { COGSCalculation as RecipeCOGSCalculation } from '../types';

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
}: RecipeSidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))',
    height: 'calc(100vh - var(--header-height-mobile) - var(--safe-area-inset-top))',
    right: 0,
  });

  // Update panel position based on screen size
  useEffect(() => {
    const updatePanelStyle = () => {
      const isDesktop = window.innerWidth >= 1024;
      setPanelStyle({
        position: 'fixed',
        top: isDesktop
          ? 'calc(var(--header-height-desktop) + var(--safe-area-inset-top))'
          : 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))',
        height: isDesktop
          ? 'calc(100vh - var(--header-height-desktop) - var(--safe-area-inset-top))'
          : 'calc(100vh - var(--header-height-mobile) - var(--safe-area-inset-top))',
        right: 0,
      });
    };

    updatePanelStyle();
    window.addEventListener('resize', updatePanelStyle);
    return () => window.removeEventListener('resize', updatePanelStyle);
  }, []);

  // Convert recipe ingredients to COGS calculations for summary
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
    if (!recipe || recipe.yield <= 0) return totalCOGS;
    return totalCOGS / recipe.yield;
  }, [totalCOGS, recipe]);

  // Keyboard shortcuts and focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store current scroll position
    const scrollY = window.scrollY;
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus panel without scrolling
    if (panelRef.current) {
      panelRef.current.focus({ preventScroll: true });
      // Restore scroll position immediately in case focus caused any scroll
      window.scrollTo(0, scrollY);
    }

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
      // Restore focus without scrolling
      if (previousActiveElement.current) {
        previousActiveElement.current.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose, onEditRecipe, recipe]);

  // Prevent body scroll when panel is open on mobile
  // Also prevent scroll restoration when panel opens
  useEffect(() => {
    if (isOpen) {
      // Store scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      // Prevent scroll restoration
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      // Restore scroll position if it changed
      requestAnimationFrame(() => {
        if (window.scrollY !== scrollY) {
          window.scrollTo(0, scrollY);
        }
      });
    } else {
      document.body.style.overflow = '';
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    }
    return () => {
      document.body.style.overflow = '';
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, [isOpen]);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !recipe || !mounted) return null;

  const panelContent = (
    <>
      {/* Backdrop - only on mobile */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        style={{
          top: 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <div
        ref={panelRef}
        className={`fixed right-0 z-[65] w-full max-w-md bg-[#1f1f1f] shadow-2xl transition-transform duration-300 ease-out lg:max-w-lg ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={panelStyle}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-panel-title"
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-[#2a2a2a] p-6 flex-shrink-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h2
                  id="recipe-panel-title"
                  className="text-xl font-bold text-white mb-2"
                >
                  {capitalizeRecipeName(recipe.name)}
                </h2>

                {/* Yield */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Yield:</span>
                  <span className="font-medium text-white">
                    {recipe.yield} {recipe.yield_unit}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                aria-label="Close recipe panel"
              >
                <Icon icon={X} size="md" aria-hidden={true} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Cost Summary */}
            {calculations.length > 0 && (
              <div className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Icon icon={Calculator} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                  <h3 className="text-sm font-semibold text-white">Cost Summary</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400">Total Cost</div>
                    <div className="text-lg font-semibold text-white">
                      ${totalCOGS.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Cost per Portion</div>
                    <div className="text-lg font-semibold text-[#29E7CD]">
                      ${costPerPortion.toFixed(2)}
                    </div>
                  </div>
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
                  <p className="text-sm text-gray-300 line-clamp-4 whitespace-pre-wrap">
                    {recipe.instructions}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions Footer */}
          <div className="border-t border-[#2a2a2a] p-6 flex-shrink-0 space-y-3">
            <button
              onClick={() => onEditRecipe(recipe)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
              title="Edit recipe (Press E)"
            >
              <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
              <span>Edit Recipe</span>
            </button>
            <button
              onClick={() => onDeleteRecipe(recipe)}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
              title="Delete recipe"
            >
              <Icon icon={Trash2} size="sm" aria-hidden={true} />
              <span>Delete Recipe</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Render panel in a portal to ensure it's fixed to viewport
  return typeof window !== 'undefined' ? createPortal(panelContent, document.body) : null;
}
