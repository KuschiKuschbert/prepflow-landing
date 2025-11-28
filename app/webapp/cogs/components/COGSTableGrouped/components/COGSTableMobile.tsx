/**
 * Mobile card layout for COGS table.
 */

import { Icon } from '@/components/ui/Icon';
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react';
import { COGSTableMobileCard } from '../../COGSTableMobileCard';
import type { COGSCalculation } from '../../../types';
import type { RecipeGroup } from '../types';

interface COGSTableMobileProps {
  recipeGroups: RecipeGroup[];
  standaloneCalculations: COGSCalculation[];
  expandedRecipes: Set<string>;
  dishPortions: number;
  editingIngredient: string | null;
  editQuantity: number;
  onToggleRecipe: (recipeId: string) => void;
  onEditIngredient: (ingredientId: string, currentQuantity: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemoveIngredient: (ingredientId: string) => void | Promise<void>;
  onEditQuantityChange: (quantity: number) => void;
}

export function COGSTableMobile({
  recipeGroups,
  standaloneCalculations,
  expandedRecipes,
  dishPortions,
  editingIngredient,
  editQuantity,
  onToggleRecipe,
  onEditIngredient,
  onSaveEdit,
  onCancelEdit,
  onRemoveIngredient,
  onEditQuantityChange,
}: COGSTableMobileProps) {
  return (
    <div className="large-desktop:hidden block">
      <div className="space-y-3">
        {/* Recipe Groups */}
        {recipeGroups.map(group => {
          const isExpanded = expandedRecipes.has(group.recipeId);
          return (
            <div key={group.recipeId} className="space-y-2">
              {/* Recipe Header */}
              <button
                onClick={() => onToggleRecipe(group.recipeId)}
                className="flex w-full items-center justify-between rounded-lg border border-[#29E7CD]/20 bg-[#29E7CD]/5 p-3 transition-colors hover:bg-[#29E7CD]/10"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Icon icon={ChefHat} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                    <span className="font-semibold text-white">
                      {group.recipeName} ({group.quantity}x)
                    </span>
                    <span className="text-sm text-gray-400">
                      ${(group.totalCost / dishPortions).toFixed(2)}
                    </span>
                  </div>
                  <div className="ml-6 text-xs text-gray-500">
                    Recipe yield: {group.yield} {group.yieldUnit} (ingredients shown per portion)
                  </div>
                </div>
                <Icon
                  icon={isExpanded ? ChevronUp : ChevronDown}
                  size="sm"
                  className="text-[#29E7CD]"
                  aria-hidden={true}
                />
              </button>

              {/* Recipe Ingredients */}
              {isExpanded && (
                <div className="ml-4 space-y-2 border-l-2 border-[#29E7CD]/20 pl-4">
                  {group.calculations.map((calc, index) => (
                    <COGSTableMobileCard
                      key={`${calc.recipeId}-${calc.ingredientId || calc.id || index}`}
                      calc={calc}
                      index={index}
                      editingIngredient={editingIngredient}
                      editQuantity={editQuantity}
                      onEditIngredient={onEditIngredient}
                      onSaveEdit={onSaveEdit}
                      onCancelEdit={onCancelEdit}
                      onRemoveIngredient={onRemoveIngredient}
                      onEditQuantityChange={onEditQuantityChange}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Standalone Ingredients */}
        {standaloneCalculations.length > 0 && (
          <div className="space-y-2">
            <div className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
              <h4 className="text-sm font-semibold text-white">Standalone Ingredients</h4>
            </div>
            {standaloneCalculations.map((calc, index) => (
              <COGSTableMobileCard
                key={`standalone-${calc.ingredientId || calc.id || index}`}
                calc={calc}
                index={index}
                editingIngredient={editingIngredient}
                editQuantity={editQuantity}
                onEditIngredient={onEditIngredient}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                onRemoveIngredient={onRemoveIngredient}
                onEditQuantityChange={onEditQuantityChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
