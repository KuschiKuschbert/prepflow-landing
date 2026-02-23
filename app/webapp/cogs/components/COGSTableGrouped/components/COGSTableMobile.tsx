'use client';

/**
 * Mobile card layout for COGS table.
 */

import { Icon } from '@/components/ui/Icon';
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react';
import { COGSTableMobileCard } from '../../COGSTableMobileCard';
import type { COGSCalculation } from '@/lib/types/cogs';
import type { RecipeGroup } from '@/lib/types/cogs';

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
                className="flex w-full items-center justify-between rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-3 transition-colors hover:bg-[var(--primary)]/10"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={ChefHat}
                      size="sm"
                      className="text-[var(--primary)]"
                      aria-hidden={true}
                    />
                    <span className="font-semibold text-[var(--foreground)]">
                      {group.recipeName} ({group.quantity}x)
                    </span>
                    <span className="text-sm text-[var(--foreground-muted)]">
                      ${(group.totalCost / dishPortions).toFixed(2)}
                    </span>
                  </div>
                  <div className="ml-6 text-xs text-[var(--foreground-subtle)]">
                    Recipe yield: {group.yield} {group.yieldUnit} (ingredients shown per portion)
                  </div>
                </div>
                <Icon
                  icon={isExpanded ? ChevronUp : ChevronDown}
                  size="sm"
                  className="text-[var(--primary)]"
                  aria-hidden={true}
                />
              </button>

              {/* Recipe Ingredients */}
              {isExpanded && (
                <div className="ml-4 space-y-2 border-l-2 border-[var(--primary)]/20 pl-4">
                  {group.calculations.map((calc, index) => (
                    <COGSTableMobileCard
                      key={calc.id || `${calc.recipeId}-${calc.ingredientId}-${index}`}
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
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-3">
              <h4 className="text-sm font-semibold text-[var(--foreground)]">
                Standalone Ingredients
              </h4>
            </div>
            {standaloneCalculations.map((calc, index) => (
              <COGSTableMobileCard
                key={`standalone-${calc.ingredientId || calc.id}-${index}`}
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
