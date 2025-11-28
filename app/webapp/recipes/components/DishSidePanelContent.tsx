'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { UtensilsCrossed } from 'lucide-react';
import { COGSTable } from '../../cogs/components/COGSTable';
import { COGSTableGrouped } from '../../cogs/components/COGSTableGrouped';
import { COGSCalculation } from '../../cogs/types';
import { DishCostData, DishWithDetails } from '../types';
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
      {costData && <DishSidePanelCostInfo costData={costData} />}

      {dishDetails?.recipes && dishDetails.recipes.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Recipes</h3>
          <div className="space-y-2">
            {dishDetails.recipes.map((dr, index) => {
              const recipeYield = dr.recipes?.yield || 1;
              const recipeYieldUnit = dr.recipes?.yield_unit || 'servings';
              return (
                <div key={index} className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300">
                  <span className="font-medium text-white">
                    {dr.recipes?.recipe_name || (dr.recipes as any)?.name || 'Unknown Recipe'}
                  </span>
                  <span className="ml-2 text-gray-400">× {dr.quantity}</span>
                  <span className="ml-2 text-xs text-gray-500">
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
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Icon icon={UtensilsCrossed} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            Standalone Ingredients
          </h3>
          <div className="space-y-2">
            {dishDetails.ingredients.map((di, index) => (
              <div key={index} className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300">
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

      {calculations.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">COGS Breakdown</h3>
          <div className="rounded-lg bg-[#1f1f1f] p-4">
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
