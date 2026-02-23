import { Icon } from '@/components/ui/Icon';
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';
import { COGSTableRow } from '../../COGSTableRow';
import type { RecipeGroup } from '@/lib/types/cogs';

interface COGSRecipeGroupRowProps {
  group: RecipeGroup;
  isExpanded: boolean;
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

export function COGSRecipeGroupRow({
  group,
  isExpanded,
  dishPortions,
  editingIngredient,
  editQuantity,
  onToggleRecipe,
  onEditIngredient,
  onSaveEdit,
  onCancelEdit,
  onRemoveIngredient,
  onEditQuantityChange,
}: COGSRecipeGroupRowProps) {
  return (
    <React.Fragment>
      {/* Recipe Header Row */}
      <tr className="bg-[var(--primary)]/5 transition-colors hover:bg-[var(--primary)]/10">
        <td colSpan={4} className="px-6 py-3">
          <button
            onClick={() => onToggleRecipe(group.recipeId)}
            className="flex w-full items-center justify-between text-left"
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
                  Total: ${(group.totalCost / dishPortions).toFixed(2)}
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
        </td>
      </tr>

      {/* Recipe Ingredients */}
      {isExpanded &&
        group.calculations.map((calc, index) => (
          <COGSTableRow
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
    </React.Fragment>
  );
}
