'use client';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Package, ShoppingBag } from 'lucide-react';
import { IngredientManager } from '../../cogs/components/IngredientManager';
import { IngredientsList } from '../../cogs/components/IngredientsList';
import { COGSCalculation } from '../../cogs/types';
import { Ingredient } from '../../cogs/types';

interface RecipeIngredientsTabProps {
  activeTab: 'ingredients' | 'consumables';
  onTabChange: (tab: 'ingredients' | 'consumables') => void;
  ingredientCalculations: COGSCalculation[];
  consumableCalculations: COGSCalculation[];
  ingredients: Ingredient[];
  consumables: Ingredient[];
  dataLoading: boolean;
  loadingIngredients: boolean;
  dataError: string | null;
  showAddIngredient: boolean;
  ingredientSearch: string;
  showSuggestions: boolean;
  filteredIngredients: Ingredient[];
  selectedIngredient: Ingredient | null;
  highlightedIndex: number;
  newIngredient: { quantity: number; unit: string };
  consumableSearch: string;
  showConsumableSuggestions: boolean;
  filteredConsumables: Ingredient[];
  selectedConsumable: Ingredient | null;
  consumableHighlightedIndex: number;
  newConsumable: { quantity: number; unit: string };
  onToggleAddIngredient: () => void;
  onSearchChange: (value: string) => void;
  onIngredientSelect: (ingredient: Ingredient) => void;
  onKeyDown: (e: React.KeyboardEvent, filtered: Ingredient[]) => void;
  onQuantityChange: (quantity: number) => void;
  onUnitChange: (unit: string) => void;
  onAddIngredient: (e: React.FormEvent) => void;
  onConsumableSearchChange: (value: string) => void;
  onConsumableSelect: (ingredient: Ingredient) => void;
  onConsumableKeyDown: (e: React.KeyboardEvent, filtered: Ingredient[]) => void;
  onConsumableQuantityChange: (quantity: number) => void;
  onConsumableUnitChange: (unit: string) => void;
  onAddConsumable: (e: React.FormEvent) => void;
  onUpdateCalculation: (ingredientId: string, newQuantity: number) => void;
  onRemoveCalculation: (ingredientId: string) => void;
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
}

export function RecipeIngredientsTab({
  activeTab,
  onTabChange,
  ingredientCalculations,
  consumableCalculations,
  ingredients,
  consumables,
  dataLoading,
  loadingIngredients,
  dataError,
  showAddIngredient,
  ingredientSearch,
  showSuggestions,
  filteredIngredients,
  selectedIngredient,
  highlightedIndex,
  newIngredient,
  consumableSearch,
  showConsumableSuggestions,
  filteredConsumables,
  selectedConsumable,
  consumableHighlightedIndex,
  newConsumable,
  onToggleAddIngredient,
  onSearchChange,
  onIngredientSelect,
  onKeyDown,
  onQuantityChange,
  onUnitChange,
  onAddIngredient,
  onConsumableSearchChange,
  onConsumableSelect,
  onConsumableKeyDown,
  onConsumableQuantityChange,
  onConsumableUnitChange,
  onAddConsumable,
  onUpdateCalculation,
  onRemoveCalculation,
  setCalculations,
}: RecipeIngredientsTabProps) {
  const currentCalculations = activeTab === 'ingredients' ? ingredientCalculations : consumableCalculations;
  const emptyMessage = activeTab === 'ingredients' ? 'No ingredients added yet' : 'No consumables added yet';
  return (
    <div className="flex flex-1 flex-col overflow-hidden border-t border-[#2a2a2a] pt-6">
      <div className="mb-4 flex gap-2 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-2">
        {(['ingredients', 'consumables'] as const).map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon icon={tab === 'ingredients' ? Package : ShoppingBag} size="sm" aria-hidden={true} />
              {tab === 'ingredients' ? 'Ingredients' : 'Consumables'}
            </button>
          );
        })}
      </div>
      <h3 className="mb-4 text-lg font-semibold text-white">
        {activeTab === 'ingredients' ? 'Ingredients' : 'Consumables'}
      </h3>
      {dataError && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {dataError}
        </div>
      )}
      {dataLoading || loadingIngredients ? (
        <div className="space-y-3">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      ) : (
        <>
          <div className="mb-4 flex-1 overflow-y-auto">
            {currentCalculations.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 text-gray-400">
                <p>{emptyMessage}</p>
              </div>
            ) : (
              <IngredientsList
                calculations={currentCalculations}
                onUpdateCalculation={onUpdateCalculation}
                onRemoveCalculation={onRemoveCalculation}
              />
            )}
          </div>
          <div className="border-t border-[#2a2a2a] pt-4">
            {activeTab === 'ingredients' ? (
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
            ) : (
              <IngredientManager
                showAddIngredient={showAddIngredient}
                ingredients={consumables}
                ingredientSearch={consumableSearch}
                showSuggestions={showConsumableSuggestions}
                filteredIngredients={filteredConsumables}
                selectedIngredient={selectedConsumable}
                highlightedIndex={consumableHighlightedIndex}
                newIngredient={newConsumable}
                onToggleAddIngredient={onToggleAddIngredient}
                onSearchChange={onConsumableSearchChange}
                onIngredientSelect={onConsumableSelect}
                onKeyDown={e => onConsumableKeyDown(e, filteredConsumables)}
                onQuantityChange={onConsumableQuantityChange}
                onUnitChange={onConsumableUnitChange}
                onAddIngredient={onAddConsumable}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

