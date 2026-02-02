'use client';

import { FoodImageGenerator } from '@/components/ui/FoodImageGenerator';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { UtensilsCrossed } from 'lucide-react';
import { COGSTable } from '../../cogs/components/COGSTable';
import { COGSTableGrouped } from '../../cogs/components/COGSTableGrouped';
import { COGSCalculation } from '@/lib/types/recipes';
import { DishCostData, DishWithDetails } from '@/lib/types/recipes';
import { DishSidePanelCostInfo } from './DishSidePanelCostInfo';

interface DishSidePanelContentProps {
  loading: boolean;
  dishDetails: DishWithDetails | null;
  costData: DishCostData | null;
  calculations: COGSCalculation[];
  editingIngredient: string | null;
  editQuantity: number;
  onEditIngredient: (id: string, currentQuantity: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemoveIngredient: (id: string) => void;
  onEditQuantityChange: (quantity: number) => void;
  totalCOGS: number;
  costPerPortion: number;
  dishId?: string;
  dishName?: string;
}

export function DishSidePanelContent({
  loading,
  dishDetails,
  costData,
  calculations,
  editingIngredient,
  editQuantity,
  onEditIngredient,
  onSaveEdit,
  onCancelEdit,
  onRemoveIngredient,
  onEditQuantityChange,
  totalCOGS,
  costPerPortion,
  dishId,
  dishName,
}: DishSidePanelContentProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  return (
    <>
      {/* Food Image Generation */}
      {dishId && dishName && (
        <FoodImageGenerator
          entityType="dish"
          entityId={dishId}
          entityName={dishName}
          imageUrl={dishDetails?.image_url}
          imageUrlAlternative={dishDetails?.image_url_alternative}
          imageUrlModern={dishDetails?.image_url_modern}
          imageUrlMinimalist={dishDetails?.image_url_minimalist}
          className="mb-6"
          compact={false}
        />
      )}

      {costData && <DishSidePanelCostInfo costData={costData} />}

      {dishDetails?.recipes && dishDetails.recipes.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Recipes</h3>
          <div className="space-y-2">
            {dishDetails.recipes.map((dr, index) => {
              const recipeYield = dr.recipes?.yield || 1;
              const recipeYieldUnit = dr.recipes?.yield_unit || 'servings';
              return (
                <div
                  key={index}
                  className="rounded-lg bg-[var(--muted)]/30 p-3 text-sm text-[var(--foreground-secondary)]"
                >
                  <span className="font-medium text-[var(--foreground)]">
                    {dr.recipes?.recipe_name || 'Unknown Recipe'}
                  </span>
                  <span className="ml-2 text-[var(--foreground-muted)]">× {dr.quantity}</span>
                  <span className="ml-2 text-xs text-[var(--foreground-subtle)]">
                    (yield: {recipeYield} {recipeYieldUnit})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {dishDetails?.ingredients && dishDetails.ingredients.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
            <Icon
              icon={UtensilsCrossed}
              size="sm"
              className="text-[var(--primary)]"
              aria-hidden={true}
            />
            Standalone Ingredients
          </h3>
          <div className="space-y-2">
            {dishDetails.ingredients.map((di, index) => (
              <div
                key={index}
                className="rounded-lg bg-[var(--muted)]/30 p-3 text-sm text-[var(--foreground-secondary)]"
              >
                <span className="font-medium text-[var(--foreground)]">
                  {di.ingredients?.ingredient_name || 'Unknown Ingredient'}
                </span>
                <span className="ml-2 text-[var(--foreground-muted)]">
                  {di.quantity} {di.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {calculations.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">COGS Breakdown</h3>
          <div className="rounded-lg bg-[var(--surface)] p-4">
            {dishDetails ? (
              <COGSTableGrouped
                calculations={calculations}
                dishDetails={dishDetails}
                editingIngredient={editingIngredient}
                editQuantity={editQuantity}
                onEditIngredient={id => onEditIngredient(id, 0)}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                onRemoveIngredient={onRemoveIngredient}
                onEditQuantityChange={onEditQuantityChange}
                totalCOGS={totalCOGS}
                costPerPortion={costPerPortion}
                dishPortions={1}
              />
            ) : (
              <COGSTable
                calculations={calculations}
                editingIngredient={editingIngredient}
                editQuantity={editQuantity}
                onEditIngredient={id => onEditIngredient(id, 0)}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                onRemoveIngredient={onRemoveIngredient}
                onEditQuantityChange={onEditQuantityChange}
                totalCOGS={totalCOGS}
                costPerPortion={costPerPortion}
                dishPortions={1}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
