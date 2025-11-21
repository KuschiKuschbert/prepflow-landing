/**
 * Ingredient Popover Component
 * Displays ingredients in a popover positioned near the clicked row
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { AllergenBadge } from '@/components/ui/AllergenBadge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { logger } from '@/lib/logger';

interface IngredientData {
  id: string;
  ingredient_name: string;
  brand?: string;
  quantity?: number;
  unit?: string;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
}

interface RecipeSource {
  source_type: 'recipe';
  source_id: string;
  source_name: string;
  quantity?: number;
  unit?: string;
}

interface IngredientPopoverProps {
  isOpen: boolean;
  menuItemId: string;
  menuItemName: string;
  menuItemType: 'dish' | 'recipe';
  mousePosition: { x: number; y: number } | null;
  onClose: () => void;
}

export function IngredientPopover({
  isOpen,
  menuItemId,
  menuItemName,
  menuItemType,
  mousePosition,
  onClose,
}: IngredientPopoverProps) {
  const [ingredients, setIngredients] = useState<IngredientData[]>([]);
  const [recipeSources, setRecipeSources] = useState<RecipeSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ left: number; top: number } | null>(
    null,
  );
  const popoverRef = useRef<HTMLDivElement>(null);
  const previousOpenRef = useRef(false);

  // Fetch ingredients when popover opens
  useEffect(() => {
    if (!isOpen || previousOpenRef.current === isOpen) {
      previousOpenRef.current = isOpen;
      return;
    }
    previousOpenRef.current = isOpen;

    if (!isOpen) {
      return;
    }

    const fetchIngredients = async () => {
      setLoading(true);
      setError(null);
      setIngredients([]);
      setRecipeSources([]);

      try {
        if (menuItemType === 'dish') {
          // Fetch dish with all ingredients and recipes
          const dishResponse = await fetch(`/api/dishes/${menuItemId}`);
          const dishData = await dishResponse.json();

          if (!dishResponse.ok) {
            throw new Error(dishData.error || 'Failed to fetch dish');
          }

          if (dishData.success && dishData.dish) {
            const dish = dishData.dish;
            const allIngredients: IngredientData[] = [];
            const recipes: RecipeSource[] = [];

            // Extract recipes
            if (dish.recipes && Array.isArray(dish.recipes)) {
              dish.recipes.forEach((dr: any) => {
                if (dr.recipe_id && dr.recipes) {
                  recipes.push({
                    source_type: 'recipe',
                    source_id: dr.recipe_id,
                    source_name: dr.recipes.recipe_name || 'Unknown Recipe',
                    quantity: dr.quantity,
                    unit: dr.unit,
                  });
                }
              });
            }

            // Extract direct dish ingredients
            if (dish.ingredients && Array.isArray(dish.ingredients)) {
              dish.ingredients.forEach((di: any) => {
                const ingredient = di.ingredients;
                if (ingredient) {
                  // Defensive checks for missing fields
                  const ingredientData: IngredientData = {
                    id: ingredient.id || di.ingredient_id,
                    ingredient_name: ingredient.ingredient_name || 'Unknown',
                    brand: ingredient.brand || undefined,
                    quantity: di.quantity,
                    unit: di.unit,
                    allergens: Array.isArray(ingredient.allergens) ? ingredient.allergens : [],
                    allergen_source: ingredient.allergen_source || undefined,
                  };

                  // Log warning if expected fields are missing (but still add ingredient)
                  if (!ingredient.ingredient_name) {
                    logger.warn('[IngredientPopover] Dish ingredient missing ingredient_name', {
                      dishId: menuItemId,
                      ingredientId: ingredient.id || di.ingredient_id,
                    });
                  }

                  allIngredients.push(ingredientData);
                } else {
                  logger.warn('[IngredientPopover] Dish ingredient has null ingredient relation', {
                    dishId: menuItemId,
                    ingredientId: di.ingredient_id,
                  });
                }
              });
            } else {
              logger.dev('[IngredientPopover] Dish has no ingredients array or it is empty', {
                dishId: menuItemId,
                dishName: dish.dish_name,
                hasIngredients: !!dish.ingredients,
                ingredientsType: typeof dish.ingredients,
                ingredientsLength: Array.isArray(dish.ingredients)
                  ? dish.ingredients.length
                  : 'not array',
              });
            }

            // Fetch ingredients from recipes
            for (const recipe of recipes) {
              try {
                const recipeResponse = await fetch(`/api/recipes/${recipe.source_id}/ingredients`);
                const recipeData = await recipeResponse.json();
                if (recipeData.items && Array.isArray(recipeData.items)) {
                  recipeData.items.forEach((ri: any) => {
                    const ingredient = ri.ingredients;
                    if (ingredient) {
                      // Check if ingredient already exists
                      const existingIndex = allIngredients.findIndex(
                        ing => ing.id === ingredient.id,
                      );
                      if (existingIndex === -1) {
                        // Defensive checks for missing fields
                        const ingredientData: IngredientData = {
                          id: ingredient.id,
                          ingredient_name: ingredient.ingredient_name || 'Unknown',
                          brand: ingredient.brand || undefined,
                          quantity: ri.quantity,
                          unit: ri.unit,
                          allergens: Array.isArray(ingredient.allergens)
                            ? ingredient.allergens
                            : [],
                          allergen_source: ingredient.allergen_source || undefined,
                        };

                        // Log warning if expected fields are missing (but still add ingredient)
                        if (!ingredient.ingredient_name) {
                          logger.warn(
                            '[IngredientPopover] Recipe ingredient missing ingredient_name',
                            {
                              recipeId: recipe.source_id,
                              ingredientId: ingredient.id,
                            },
                          );
                        }

                        allIngredients.push(ingredientData);
                      }
                    }
                  });
                }
              } catch (err) {
                logger.error(`[IngredientPopover] Error fetching recipe ingredients:`, err);
              }
            }

            setIngredients(allIngredients);
            setRecipeSources(recipes);
          }
        } else {
          // Fetch recipe ingredients
          const response = await fetch(`/api/recipes/${menuItemId}/ingredients`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch recipe ingredients');
          }

          if (data.items && Array.isArray(data.items)) {
            const recipeIngredients: IngredientData[] = data.items.map((item: any) => {
              const ingredient = item.ingredients;

              // Defensive checks for missing fields
              const ingredientData: IngredientData = {
                id: item.ingredient_id || ingredient?.id,
                ingredient_name: ingredient?.ingredient_name || 'Unknown',
                brand: ingredient?.brand || undefined,
                quantity: item.quantity,
                unit: item.unit,
                allergens: Array.isArray(ingredient?.allergens) ? ingredient.allergens : [],
                allergen_source: ingredient?.allergen_source || undefined,
              };

              // Log warning if expected fields are missing (but still add ingredient)
              if (!ingredient?.ingredient_name) {
                logger.warn('[IngredientPopover] Recipe ingredient missing ingredient_name', {
                  recipeId: menuItemId,
                  ingredientId: ingredient?.id || item.ingredient_id,
                });
              }

              return ingredientData;
            });

            logger.dev('[IngredientPopover] Fetched recipe ingredients', {
              recipeId: menuItemId,
              count: recipeIngredients.length,
              hasIngredients: recipeIngredients.length > 0,
            });

            setIngredients(recipeIngredients);
          } else {
            logger.warn('[IngredientPopover] Recipe ingredients API returned no items', {
              recipeId: menuItemId,
              responseData: data,
            });
          }
        }
      } catch (err) {
        logger.error('[IngredientPopover] Error fetching ingredients:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ingredients');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [isOpen, menuItemId, menuItemType]);

  // Calculate popover position near mouse cursor
  useEffect(() => {
    if (!isOpen || !mousePosition) {
      setPopoverPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!mousePosition) return;

      const popoverWidth = 400;
      const maxHeight = 500;
      const offset = 12; // Distance from cursor

      // Position popover to the right and below cursor
      let left = mousePosition.x + offset;
      let top = mousePosition.y + offset;

      // Keep popover within viewport bounds
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust horizontal position - prefer right, but flip left if needed
      if (left + popoverWidth > viewportWidth - 16) {
        left = mousePosition.x - popoverWidth - offset;
        // If still doesn't fit, align to viewport edge
        if (left < 16) {
          left = 16;
        }
      } else if (left < 16) {
        left = 16;
      }

      // Adjust vertical position - prefer below, but flip above if needed
      if (top + maxHeight > viewportHeight - 16) {
        top = mousePosition.y - maxHeight - offset;
        // If still doesn't fit, align to viewport edge
        if (top < 16) {
          top = 16;
        }
      } else if (top < 16) {
        top = 16;
      }

      setPopoverPosition({ left, top });
    };

    updatePosition();

    // Update position on mouse move
    const handleMouseMove = () => {
      updatePosition();
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isOpen, mousePosition]);

  // Close popover on scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      onClose();
    };

    // Listen to scroll events on window and scrollable containers
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('wheel', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isOpen, onClose]);

  // Handle Escape key and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mousePosition || !popoverPosition) return null;

  const popoverContent = (
    <div
      ref={popoverRef}
      className="fixed z-[75] flex max-h-[500px] w-[400px] flex-col rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl"
      style={{
        left: `${popoverPosition.left}px`,
        top: `${popoverPosition.top}px`,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popover-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2a2a2a] p-4">
        <div className="min-w-0 flex-1">
          <h3 id="popover-title" className="truncate text-sm font-semibold text-white">
            {menuItemName}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">
            {menuItemType === 'dish' ? 'Dish' : 'Recipe'} ingredients
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          aria-label="Close"
        >
          <Icon icon={X} size="sm" aria-hidden={true} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="space-y-2">
            <LoadingSkeleton variant="list" />
          </div>
        ) : error ? (
          <div className="py-4 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : ingredients.length === 0 && recipeSources.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-400">No ingredients found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recipe Sources (for dishes) */}
            {recipeSources.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase">
                  Recipes
                </h4>
                <div className="space-y-1.5">
                  {recipeSources.map(recipe => (
                    <div
                      key={recipe.source_id}
                      className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate text-xs font-medium text-white">
                          {recipe.source_name}
                        </span>
                        {recipe.quantity && recipe.unit && (
                          <span className="ml-2 text-xs whitespace-nowrap text-gray-400">
                            {recipe.quantity} {recipe.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {ingredients.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase">
                  Ingredients
                </h4>
                <div className="space-y-1.5">
                  {ingredients.map(ingredient => (
                    <div
                      key={ingredient.id}
                      className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex items-center gap-1.5">
                            <span className="truncate text-xs font-medium text-white">
                              {ingredient.ingredient_name}
                            </span>
                            {ingredient.brand && (
                              <span className="truncate text-xs text-gray-400">
                                ({ingredient.brand})
                              </span>
                            )}
                          </div>
                          {ingredient.allergens && ingredient.allergens.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {ingredient.allergens.map(allergen => (
                                <AllergenBadge
                                  key={allergen}
                                  allergenCode={allergen}
                                  source={ingredient.allergen_source?.ai ? 'ai' : 'manual'}
                                  size="sm"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        {ingredient.quantity && ingredient.unit && (
                          <div className="flex-shrink-0 text-xs whitespace-nowrap text-gray-400">
                            {ingredient.quantity} {ingredient.unit}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (typeof window !== 'undefined') {
    return createPortal(popoverContent, document.body);
  }
  return null;
}
