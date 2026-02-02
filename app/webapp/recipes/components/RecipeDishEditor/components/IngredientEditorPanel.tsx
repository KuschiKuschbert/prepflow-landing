'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { IngredientsList } from '../../../../cogs/components/IngredientsList';
import { IngredientManager } from '../../../../cogs/components/IngredientManager';
import { COGSCalculation } from '@/lib/types/recipes';
import { Ingredient } from '@/lib/types/recipes';
import { Save } from 'lucide-react';

interface IngredientEditorPanelProps {
  selectedItem: { name: string; type: 'recipe' | 'dish' } | null;
  loadingIngredients: boolean;
  calculations: COGSCalculation[];
  ingredientCalculations: COGSCalculation[];
  consumableCalculations: COGSCalculation[];
  totalCOGS: number;
  costPerPortion: number;
  ingredients: Ingredient[];
  ingredientSearch: string;
  showSuggestions: boolean;
  filteredIngredients: Ingredient[];
  selectedIngredient: Ingredient | null;
  highlightedIndex: number;
  newIngredient: { ingredient_id?: string; quantity: number; unit: string };
  dataError: string | null;
  showAddIngredient: boolean;
  saving: boolean;
  capitalizeName: (name: string) => string;
  onToggleAddIngredient: () => void;
  onSearchChange: (value: string) => void;
  onIngredientSelect: (ingredient: Ingredient) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, filtered: Ingredient[]) => void;
  onQuantityChange: (quantity: number) => void;
  onUnitChange: (unit: string) => void;
  onAddIngredient: (e: React.FormEvent) => Promise<void>;
  onUpdateCalculation: (ingredientId: string, newQuantity: number) => void;
  onRemoveCalculation: (ingredientId: string) => void;
  onSave: () => void;
}

/**
 * Component for the ingredient editor panel
 */
export function IngredientEditorPanel({
  selectedItem,
  loadingIngredients,
  calculations,
  ingredientCalculations: _ingredientCalculations,
  consumableCalculations: _consumableCalculations,
  totalCOGS: _totalCOGS,
  costPerPortion: _costPerPortion,
  ingredients,
  ingredientSearch,
  showSuggestions,
  filteredIngredients,
  selectedIngredient,
  highlightedIndex,
  newIngredient,
  dataError,
  showAddIngredient,
  saving,
  capitalizeName,
  onToggleAddIngredient,
  onSearchChange,
  onIngredientSelect,
  onKeyDown,
  onQuantityChange,
  onUnitChange,
  onAddIngredient,
  onUpdateCalculation,
  onRemoveCalculation,
  onSave,
}: IngredientEditorPanelProps) {
  if (loadingIngredients && calculations.length === 0) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="text" width="w-48" height="h-6" />
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  return (
    <div
      className={`flex h-full flex-col transition-opacity duration-200 ${loadingIngredients ? 'opacity-60' : 'opacity-100'}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            {capitalizeName(selectedItem!.name)}
          </h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            {selectedItem!.type === 'recipe' ? 'Recipe' : 'Dish'} Ingredients & Consumables
          </p>
        </div>
      </div>

      <div className="mb-6 flex-1 overflow-y-auto">
        {calculations.length > 0 ? (
          <IngredientsList
            calculations={calculations}
            onUpdateCalculation={onUpdateCalculation}
            onRemoveCalculation={onRemoveCalculation}
          />
        ) : (
          <div className="flex h-32 items-center justify-center text-[var(--foreground-muted)]">
            <p>No ingredients or consumables added yet</p>
          </div>
        )}
      </div>
      <div className="border-t border-[var(--border)] pt-4">
        {dataError && (
          <div className="mb-4 rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-3 text-sm text-[var(--color-error)]">
            {dataError}
          </div>
        )}
        <IngredientManager
          showAddIngredient={showAddIngredient}
          ingredients={ingredients}
          ingredientSearch={ingredientSearch}
          showSuggestions={showSuggestions}
          filteredIngredients={filteredIngredients}
          selectedIngredient={selectedIngredient}
          highlightedIndex={highlightedIndex}
          newIngredient={newIngredient}
          onToggleAddIngredient={onToggleAddIngredient}
          onSearchChange={onSearchChange}
          onIngredientSelect={onIngredientSelect}
          onKeyDown={e => onKeyDown(e, filteredIngredients)}
          onQuantityChange={onQuantityChange}
          onUnitChange={onUnitChange}
          onAddIngredient={onAddIngredient}
        />
      </div>
      <div className="mt-4 border-t border-[var(--border)] pt-4">
        <button
          onClick={onSave}
          disabled={saving || calculations.length === 0 || !selectedItem}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-300 hover:shadow-[var(--primary)]/25 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={
            saving
              ? 'Saving changes...'
              : calculations.length === 0
                ? 'Add at least one ingredient to save'
                : !selectedItem
                  ? 'Please select a recipe or dish'
                  : 'Save changes'
          }
        >
          <Icon icon={Save} size="sm" className="text-[var(--foreground)]" aria-hidden={true} />
          <span>
            {saving
              ? 'Saving...'
              : calculations.length === 0
                ? 'Add Ingredients to Save'
                : 'Save Changes'}
          </span>
        </button>
      </div>
    </div>
  );
}
