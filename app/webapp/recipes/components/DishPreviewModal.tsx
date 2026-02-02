'use client';

import { FoodImageGenerator } from '@/components/ui/FoodImageGenerator';
import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';
import { COGSTable } from '../../cogs/components/COGSTable';
import { COGSTableGrouped } from '../../cogs/components/COGSTableGrouped';
import { useDishCOGSCalculations } from '../hooks/useDishCOGSCalculations';
import { useDishPreviewModalData } from '../hooks/useDishPreviewModalData';
import { Dish } from '@/lib/types/recipes';
import { DishPreviewModalActions } from './DishPreviewModalActions';
import { DishPreviewModalCostInfo } from './DishPreviewModalCostInfo';
import { DishPreviewModalHeader } from './DishPreviewModalHeader';
import { DishPreviewModalIngredientsList } from './DishPreviewModalIngredientsList';
import { DishPreviewModalRecipesList } from './DishPreviewModalRecipesList';

interface DishPreviewModalProps {
  dish: Dish;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DishPreviewModal({
  dish,
  onClose,
  onEdit,
  onDelete,
}: DishPreviewModalProps) {
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  // Fetch dish details and recipe ingredients using hook
  const { dishDetails, costData, loading, recipeIngredientsMap } = useDishPreviewModalData(dish);

  // Convert dish recipes and ingredients to COGS calculations using hook
  const { calculations, totalCOGS, costPerPortion } = useDishCOGSCalculations(
    dishDetails,
    recipeIngredientsMap,
    dish,
  );

  // Debug: Log if recipe ingredients are missing
  useEffect(() => {
    if (dishDetails && !loading) {
      const recipes = dishDetails.recipes || [];
      const missingRecipes = recipes.filter(r => r.recipe_id && !recipeIngredientsMap[r.recipe_id]);
      if (missingRecipes.length > 0) {
        logger.warn('[DishPreviewModal] Missing recipe ingredients', {
          dishId: dish.id,
          missingRecipeIds: missingRecipes.map(r => r.recipe_id),
          recipeIngredientsMapKeys: Object.keys(recipeIngredientsMap),
        });
      }
      logger.dev('[DishPreviewModal] Calculations summary', {
        dishId: dish.id,
        totalCalculations: calculations.length,
        recipeCalculations: calculations.filter(c => c.recipeId !== dish.id).length,
        standaloneCalculations: calculations.filter(c => c.recipeId === dish.id).length,
        recipeIngredientsMapKeys: Object.keys(recipeIngredientsMap),
      });
    }
  }, [dishDetails, recipeIngredientsMap, calculations, loading, dish.id]);

  const handleEditIngredient = (ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  };

  const handleSaveEdit = () => {
    // In a full implementation, this would update the ingredient quantity via API
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    // In a full implementation, this would remove the ingredient from the dish via API
    logger.dev('Remove ingredient:', ingredientId);
  };

  const capitalizeDishName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Keyboard shortcuts and focus management
  useEffect(() => {
    if (!loading) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'e' && !e.ctrlKey && !e.metaKey && !e.altKey) {
          // Press E to edit (only if not in an input field)
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            onEdit();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [loading, onClose, onEdit]);

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
      aria-labelledby="dish-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-4xl rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div className="max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-[var(--surface)]/95">
          <DishPreviewModalHeader
            dish={dish}
            capitalizeDishName={capitalizeDishName}
            onClose={onClose}
            onEdit={onEdit}
          />

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="py-12 text-center text-[var(--foreground-muted)]">Loading...</div>
            ) : (
              <>
                {/* Food Image Generation */}
                <FoodImageGenerator
                  entityType="dish"
                  entityId={dish.id}
                  entityName={dish.dish_name}
                  imageUrl={dishDetails?.image_url || dish.image_url}
                  imageUrlAlternative={
                    dishDetails?.image_url_alternative || dish.image_url_alternative
                  }
                  imageUrlModern={dishDetails?.image_url_modern || dish.image_url_modern}
                  imageUrlMinimalist={
                    dishDetails?.image_url_minimalist || dish.image_url_minimalist
                  }
                  className="mb-6"
                  compact={false}
                />

                {costData && <DishPreviewModalCostInfo costData={costData} />}

                {dishDetails && <DishPreviewModalRecipesList dishDetails={dishDetails} />}

                {/* COGS Breakdown */}
                {calculations.length > 0 && (
                  <div className="tablet:p-6 mb-6 rounded-lg bg-[var(--surface)] p-4 shadow">
                    <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
                      COGS Breakdown
                    </h3>
                    {dishDetails ? (
                      <COGSTableGrouped
                        calculations={calculations}
                        dishDetails={dishDetails}
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
                    ) : (
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
                    )}
                  </div>
                )}

                {dishDetails && <DishPreviewModalIngredientsList dishDetails={dishDetails} />}

                <DishPreviewModalActions onEdit={onEdit} onDelete={onDelete} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
