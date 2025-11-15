'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Edit, Trash2, Calculator, UtensilsCrossed } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Dish, DishWithDetails, DishCostData, RecipeIngredientWithDetails } from '../types';
import { convertToCOGSCalculations } from '../hooks/utils/recipeCalculationHelpers';
import { COGSTable } from '../../cogs/components/COGSTable';
import { COGSCalculation } from '../../cogs/types';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export interface DishSidePanelProps {
  isOpen: boolean;
  dish: Dish | null;
  onClose: () => void;
  onEdit: (dish: Dish) => void;
  onDelete: (dish: Dish) => void;
}

export function DishSidePanel({
  isOpen,
  dish,
  onClose,
  onEdit,
  onDelete,
}: DishSidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dishDetails, setDishDetails] = useState<DishWithDetails | null>(null);
  const [costData, setCostData] = useState<DishCostData | null>(null);
  const [loading, setLoading] = useState(true);
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
  const [recipeIngredientsMap, setRecipeIngredientsMap] = useState<
    Record<string, RecipeIngredientWithDetails[]>
  >({});
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  // Fetch dish details and recipe ingredients
  useEffect(() => {
    if (!isOpen || !dish) {
      setDishDetails(null);
      setCostData(null);
      setLoading(true);
      setRecipeIngredientsMap({});
      return;
    }

    Promise.all([
      fetch(`/api/dishes/${dish.id}`).then(r => r.json()),
      fetch(`/api/dishes/${dish.id}/cost`).then(r => r.json()),
    ]).then(async ([dishData, costResponse]) => {
      if (dishData.success) {
        setDishDetails(dishData.dish);
        // Fetch recipe ingredients for each recipe in the dish
        const recipes = dishData.dish.recipes || [];
        const ingredientsMap: Record<string, RecipeIngredientWithDetails[]> = {};
        for (const dishRecipe of recipes) {
          if (dishRecipe.recipe_id) {
            try {
              const response = await fetch(`/api/recipes/${dishRecipe.recipe_id}/ingredients`);
              const data = await response.json();
              if (data.success && data.ingredients) {
                ingredientsMap[dishRecipe.recipe_id] = data.ingredients;
              }
            } catch (err) {
              console.error(`Failed to fetch ingredients for recipe ${dishRecipe.recipe_id}:`, err);
            }
          }
        }
        setRecipeIngredientsMap(ingredientsMap);
      }
      if (costResponse.success) setCostData(costResponse.cost);
      setLoading(false);
    });
  }, [isOpen, dish?.id]);

  // Convert dish recipes and ingredients to COGS calculations
  const calculations: COGSCalculation[] = useMemo(() => {
    if (!dishDetails) return [];

    const allCalculations: COGSCalculation[] = [];

    // Process recipes
    const recipes = dishDetails.recipes || [];
    for (const dishRecipe of recipes) {
      const recipeId = dishRecipe.recipe_id;
      const recipeQuantity = typeof dishRecipe.quantity === 'number' ? dishRecipe.quantity : parseFloat(String(dishRecipe.quantity)) || 1;
      const recipeIngredients = recipeIngredientsMap[recipeId] || [];

      // Convert recipe ingredients to COGS calculations
      const recipeCOGS = convertToCOGSCalculations(recipeIngredients, recipeId);

      // Scale by recipe quantity and add to all calculations
      recipeCOGS.forEach(calc => {
        const scaledCalc: COGSCalculation = {
          recipeId: recipeId,
          ingredientId: calc.ingredientId || calc.ingredient_id || '',
          ingredientName: calc.ingredientName || calc.ingredient_name || '',
          quantity: calc.quantity * recipeQuantity,
          unit: calc.unit,
          costPerUnit: calc.cost_per_unit || 0,
          totalCost: (calc.total_cost || 0) * recipeQuantity,
          wasteAdjustedCost: calc.yieldAdjustedCost * recipeQuantity,
          yieldAdjustedCost: calc.yieldAdjustedCost * recipeQuantity,
          id: calc.id,
          ingredient_id: calc.ingredient_id,
          ingredient_name: calc.ingredient_name,
          cost_per_unit: calc.cost_per_unit,
          total_cost: (calc.total_cost || 0) * recipeQuantity,
          supplier_name: calc.supplier_name,
          category: calc.category,
        };
        allCalculations.push(scaledCalc);
      });
    }

    // Process standalone ingredients
    const ingredients = dishDetails.ingredients || [];
    for (const dishIngredient of ingredients) {
      const ingredient = dishIngredient.ingredients;
      if (!ingredient) continue;

      const quantity = typeof dishIngredient.quantity === 'number' ? dishIngredient.quantity : parseFloat(String(dishIngredient.quantity)) || 0;
      const costPerUnit =
        (ingredient as any).cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
      const totalCost = quantity * costPerUnit;

      // Apply waste and yield adjustments
      const wastePercent = (ingredient as any).trim_peel_waste_percentage || 0;
      const yieldPercent = (ingredient as any).yield_percentage || 100;

      let wasteAdjustedCost = totalCost;
      if (!(ingredient as any).cost_per_unit_incl_trim && wastePercent > 0) {
        wasteAdjustedCost = totalCost / (1 - wastePercent / 100);
      }

      const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

      allCalculations.push({
        recipeId: dish?.id || '',
        ingredientId: ingredient.id,
        ingredientName: ingredient.ingredient_name || 'Unknown',
        quantity: quantity,
        unit: dishIngredient.unit || 'g',
        costPerUnit: costPerUnit,
        totalCost: totalCost,
        wasteAdjustedCost: wasteAdjustedCost,
        yieldAdjustedCost: yieldAdjustedCost,
        id: dishIngredient.id,
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.ingredient_name || 'Unknown',
        cost_per_unit: costPerUnit,
        total_cost: totalCost,
        supplier_name: (ingredient as any).supplier_name,
        category: (ingredient as any).category,
      });
    }

    return allCalculations;
  }, [dishDetails, recipeIngredientsMap, dish?.id]);

  // Calculate totals
  const totalCOGS = useMemo(() => {
    return calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  }, [calculations]);

  const costPerPortion = useMemo(() => {
    return totalCOGS; // Dishes typically have 1 portion
  }, [totalCOGS]);

  const handleEditIngredient = (ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  };

  const handleSaveEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    console.log('Remove ingredient:', ingredientId);
  };

  const capitalizeDishName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Keyboard shortcuts and focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store current scroll position
    const scrollY = window.scrollY;

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
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          if (dish) {
            onEdit(dish);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onEdit, dish]);

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

  if (!isOpen || !dish || !mounted) return null;

  // TypeScript guard: dish is guaranteed to be non-null after the check above
  const currentDish = dish;

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
        aria-labelledby="dish-panel-title"
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-[#2a2a2a] p-6 flex-shrink-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h2
                  id="dish-panel-title"
                  className="text-xl font-bold text-white mb-2"
                >
                  {capitalizeDishName(currentDish.dish_name)}
                </h2>
                {currentDish.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{currentDish.description}</p>
                )}
              </div>

              <button
                onClick={onClose}
                className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                aria-label="Close dish panel"
              >
                <Icon icon={X} size="md" aria-hidden={true} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6" style={{ WebkitOverflowScrolling: 'touch' }}>
            {loading ? (
              <div className="space-y-4">
                <LoadingSkeleton variant="card" />
                <LoadingSkeleton variant="card" />
              </div>
            ) : (
              <>
                {/* Cost Information */}
                {costData && (
                  <div className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Icon icon={Calculator} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                      <h3 className="text-sm font-semibold text-white">Cost Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400">Selling Price</div>
                        <div className="text-lg font-semibold text-white">
                          ${costData.selling_price.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Total Cost</div>
                        <div className="text-lg font-semibold text-white">
                          ${costData.total_cost.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Gross Profit</div>
                        <div className="text-lg font-semibold text-green-400">
                          ${costData.gross_profit.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Profit Margin</div>
                        <div
                          className={`text-lg font-semibold ${
                            costData.gross_profit_margin >= 30 ? 'text-green-400' : 'text-yellow-400'
                          }`}
                        >
                          {costData.gross_profit_margin.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recipes */}
                {dishDetails?.recipes && dishDetails.recipes.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-white">Recipes</h3>
                    <div className="space-y-2">
                      {dishDetails.recipes.map((dr, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300"
                        >
                          <span className="font-medium text-white">
                            {dr.recipes?.name || 'Unknown Recipe'}
                          </span>
                          <span className="ml-2 text-gray-400">× {dr.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Standalone Ingredients */}
                {dishDetails?.ingredients && dishDetails.ingredients.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                      <Icon icon={UtensilsCrossed} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                      Standalone Ingredients
                    </h3>
                    <div className="space-y-2">
                      {dishDetails.ingredients.map((di, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300"
                        >
                          <span className="font-medium text-white">
                            {di.ingredients?.ingredient_name || 'Unknown Ingredient'}
                          </span>
                          <span className="ml-2 text-gray-400">
                            {di.quantity} {di.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* COGS Breakdown - Compact */}
                {calculations.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-white">COGS Breakdown</h3>
                    <div className="rounded-lg bg-[#1f1f1f] p-4">
                      <COGSTable
                        calculations={calculations}
                        editingIngredient={editingIngredient}
                        editQuantity={editQuantity}
                        onEditIngredient={handleEditIngredient}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onRemoveIngredient={handleRemoveIngredient}
                        onEditQuantityChange={setEditQuantity}
                        totalCOGS={totalCOGS}
                        costPerPortion={costPerPortion}
                        dishPortions={1}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions Footer */}
          <div className="border-t border-[#2a2a2a] p-6 flex-shrink-0 space-y-3">
            <button
              onClick={() => onEdit(currentDish)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
              title="Edit dish (Press E)"
            >
              <Icon icon={Edit} size="sm" className="text-white" aria-hidden={true} />
              <span>Edit Dish</span>
            </button>
            <button
              onClick={() => onDelete(currentDish)}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
              title="Delete dish"
            >
              <Icon icon={Trash2} size="sm" aria-hidden={true} />
              <span>Delete Dish</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Render panel in a portal to ensure it's fixed to viewport
  return typeof window !== 'undefined' ? createPortal(panelContent, document.body) : null;
}
