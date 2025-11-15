'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Recipe, Dish } from '../types';
import { COGSCalculation } from '../../cogs/types';
import { useCOGSDataFetching } from '../../cogs/hooks/useCOGSDataFetching';
import { useCOGSCalculationLogic } from '../../cogs/hooks/useCOGSCalculationLogic';
import { useIngredientConversion } from '../../cogs/hooks/useIngredientConversion';
import { createCalculation } from '../../cogs/hooks/utils/createCalculation';
import { IngredientsList } from '../../cogs/components/IngredientsList';
import { IngredientManager } from '../../cogs/components/IngredientManager';
import { useIngredientAddition } from '../../cogs/hooks/useIngredientAddition';
import { useIngredientSearch } from '../../cogs/hooks/useIngredientSearch';
import { useNotification } from '@/contexts/NotificationContext';
import { Icon } from '@/components/ui/Icon';
import { ArrowLeft, Save, BookOpen, UtensilsCrossed } from 'lucide-react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface RecipeDishEditorProps {
  item?: Recipe | Dish | null;
  itemType?: 'recipe' | 'dish';
  onClose: () => void;
  onSave: () => void;
}

interface RecipeDishItem {
  id: string;
  name: string;
  type: 'recipe' | 'dish';
  ingredientCount?: number;
}

export function RecipeDishEditor({ item, itemType, onClose, onSave }: RecipeDishEditorProps) {
  // Handle case where no initial item is provided
  const hasInitialItem = Boolean(item && item.id && item.id !== '');
  const { showError, showSuccess } = useNotification();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [selectedItem, setSelectedItem] = useState<RecipeDishItem | null>(null);
  const [calculations, setCalculations] = useState<COGSCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [saving, setSaving] = useState(false);

  // Data fetching
  const { ingredients, recipes, loading: dataLoading, error: dataError, setError, fetchData } = useCOGSDataFetching();

  // Calculation logic
  const { calculateCOGS, updateCalculation } = useCOGSCalculationLogic({
    ingredients,
    setCalculations,
  });

  // Ingredient conversion - use ref to avoid dependency issues
  const { convertIngredientQuantity } = useIngredientConversion();
  const convertIngredientQuantityRef = useRef(convertIngredientQuantity);
  const showErrorRef = useRef(showError);

  // Update refs when functions change
  useEffect(() => {
    convertIngredientQuantityRef.current = convertIngredientQuantity;
    showErrorRef.current = showError;
  }, [convertIngredientQuantity, showError]);

  // Ingredient search
  const {
    ingredientSearch,
    showSuggestions,
    selectedIngredient,
    newIngredient,
    filteredIngredients,
    highlightedIndex,
    handleIngredientSelect,
    handleSearchChange,
    handleKeyDown,
    resetForm,
    setNewIngredient,
    setShowSuggestions,
  } = useIngredientSearch(ingredients);

  const [showAddIngredient, setShowAddIngredient] = useState(false);

  // Wrapper for updateCalculation to match useIngredientAddition signature
  const updateCalculationWrapper = useCallback(
    (ingredientId: string, quantity: number) => {
      updateCalculation(ingredientId, quantity, ingredients, setCalculations);
    },
    [ingredients, updateCalculation],
  );

  // Ingredient addition
  const { handleAddIngredient } = useIngredientAddition({
    calculations,
    ingredients,
    selectedRecipe: selectedItem?.type === 'recipe' ? selectedItem.id : null,
    addCalculation: (calc: COGSCalculation) => {
      setCalculations(prev => [...prev, calc]);
    },
    updateCalculation: updateCalculationWrapper,
    resetForm,
    setSaveError: setError,
  });

  const handleAddIngredientWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddIngredient(newIngredient, e);
  };

  // Set initial selected item from props immediately (before fetch)
  // Only set if item has a valid id (not a placeholder) and itemType is provided
  useEffect(() => {
    if (hasInitialItem && item && item.id && item.id !== '' && !selectedItem && itemType) {
      const itemName = itemType === 'recipe' ? (item as Recipe).name : (item as Dish).dish_name;
      if (itemName) {
        const initialItem: RecipeDishItem = {
          id: item.id,
          name: itemName,
          type: itemType as 'recipe' | 'dish', // TypeScript guard ensures this is not undefined
        };
        setSelectedItem(initialItem);
      }
    }
  }, [hasInitialItem, item, itemType, selectedItem]);

  // Fetch all recipes and dishes for left column
  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const [dishesResponse, recipesResponse] = await Promise.all([
          fetch('/api/dishes', { cache: 'no-store' }),
          fetch('/api/recipes', { cache: 'no-store' }),
        ]);

        const dishesResult = await dishesResponse.json();
        const recipesResult = await recipesResponse.json();

        if (dishesResponse.ok && dishesResult.dishes) {
          setAllDishes(dishesResult.dishes);
        }
        if (recipesResponse.ok && recipesResult.recipes) {
          setAllRecipes(recipesResult.recipes);
        }
      } catch (err) {
        console.error('Failed to fetch items:', err);
        showError('Failed to load recipes and dishes');
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, [showError]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load ingredients when selected item changes
  useEffect(() => {
    const loadIngredients = async () => {
      if (!selectedItem || !selectedItem.id || selectedItem.id === '' || ingredients.length === 0) {
        setCalculations([]);
        setLoadingIngredients(false);
        return;
      }

      // Don't clear calculations immediately - keep previous content visible while loading
      setLoadingIngredients(true);
      try {
        if (selectedItem.type === 'recipe') {
          const response = await fetch(`/api/recipes/${selectedItem.id}/ingredients`, {
            cache: 'no-store',
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch recipe ingredients: ${response.statusText}`);
          }

          const data = await response.json();
          const recipeIngredients = data.items || [];

          if (recipeIngredients.length > 0) {
            const recipe = allRecipes.find(r => r.id === selectedItem.id);
            const recipeYield = recipe?.yield || 1;
            const loadedCalculations = recipeIngredients
              .map((ri: any) => {
                const ingredientData = ingredients.find(ing => ing.id === ri.ingredient_id);
                if (!ingredientData) return null;

                // Convert to per-serving quantity for recipes
                const perServingQuantity = ri.quantity / recipeYield;
                const { convertedQuantity, convertedUnit, conversionNote } = convertIngredientQuantityRef.current(
                  perServingQuantity,
                  ri.unit,
                  ingredientData.unit || 'kg',
                );
                return createCalculation(
                  ri.ingredient_id,
                  ingredientData,
                  convertedQuantity,
                  convertedUnit,
                  conversionNote,
                  selectedItem.id,
                );
              })
              .filter(Boolean) as COGSCalculation[];

            // Update calculations only after new data is ready
            setCalculations(loadedCalculations);
          } else {
            setCalculations([]);
          }
        } else {
          const response = await fetch(`/api/dishes/${selectedItem.id}`, {
            cache: 'no-store',
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch dish: ${response.statusText}`);
          }

          const data = await response.json();

          if (data.success && data.dish) {
            // For dishes, we need to expand recipes to ingredients
            const dishRecipes = data.dish.recipes || [];
            const dishIngredients = data.dish.ingredients || [];
            const allCalculations: COGSCalculation[] = [];

            // Add standalone ingredients
            for (const di of dishIngredients) {
              const ingredientData = ingredients.find(ing => ing.id === di.ingredient_id);
              if (ingredientData) {
                const { convertedQuantity, convertedUnit, conversionNote } = convertIngredientQuantityRef.current(
                  di.quantity,
                  di.unit,
                  ingredientData.unit || 'kg',
                );
                allCalculations.push(
                  createCalculation(di.ingredient_id, ingredientData, convertedQuantity, convertedUnit, conversionNote, selectedItem.id),
                );
              }
            }

            // Expand recipes to ingredients
            for (const dr of dishRecipes) {
              const recipe = recipes.find(r => r.id === dr.recipe_id);
              if (recipe) {
                const recipeResponse = await fetch(`/api/recipes/${recipe.id}/ingredients`, {
                  cache: 'no-store',
                });
                const recipeData = await recipeResponse.json();
                const recipeIngredients = recipeData.items || [];
                const recipeYield = recipe.yield || 1;
                const quantity = dr.quantity || 1;

                for (const ri of recipeIngredients) {
                  const ingredientData = ingredients.find(ing => ing.id === ri.ingredient_id);
                  if (ingredientData) {
                    // Calculate total quantity: (recipe ingredient / recipe yield) * dish recipe quantity
                    const perServingQuantity = ri.quantity / recipeYield;
                    const totalQuantity = perServingQuantity * quantity;
                    const { convertedQuantity, convertedUnit, conversionNote } = convertIngredientQuantityRef.current(
                      totalQuantity,
                      ri.unit,
                      ingredientData.unit || 'kg',
                    );
                    allCalculations.push(
                      createCalculation(ri.ingredient_id, ingredientData, convertedQuantity, convertedUnit, conversionNote, selectedItem.id),
                    );
                  }
                }
              }
            }

            // Update calculations only after new data is ready
            setCalculations(allCalculations);
          } else {
            setCalculations([]);
          }
        }
      } catch (err) {
        console.error('Failed to load ingredients:', err);
        showErrorRef.current('Failed to load ingredients');
        // Clear calculations on error
        setCalculations([]);
      } finally {
        setLoadingIngredients(false);
      }
    };

    if (selectedItem && ingredients.length > 0) {
      loadIngredients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem?.id, selectedItem?.type, ingredients.length, recipes.length, allRecipes.length]);

  // Autosave disabled - ingredients are saved via dedicated API endpoints
  // Autosave would try to save ingredients to recipes/menu_dishes tables which don't have ingredients columns

  // Calculate totals
  const totalCOGS = useMemo(() => {
    return calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
  }, [calculations]);

  const costPerPortion = useMemo(() => {
    if (!selectedItem) return 0;
    if (selectedItem.type === 'recipe') {
      const recipe = allRecipes.find(r => r.id === selectedItem.id);
      return totalCOGS / (recipe?.yield || 1);
    } else {
      return totalCOGS; // Dishes are single-serving
    }
  }, [totalCOGS, selectedItem, allRecipes]);

  // Save handler
  const handleSave = useCallback(async () => {
    if (!selectedItem) {
      showError('Please select a recipe or dish to edit');
      return;
    }

    if (calculations.length === 0) {
      showError(`${selectedItem.type === 'recipe' ? 'Recipe' : 'Dish'} must contain at least one ingredient`);
      return;
    }

    setSaving(true);
    try {
      if (selectedItem.type === 'recipe') {
        const recipe = allRecipes.find(r => r.id === selectedItem.id);
        const recipeYield = recipe?.yield || 1;

        // Convert per-serving quantities back to recipe quantities
        const recipeIngredients = calculations.map(calc => ({
          ingredient_id: calc.ingredientId,
          quantity: calc.quantity * recipeYield, // Convert back to total recipe quantity
          unit: calc.unit,
        }));

        const response = await fetch(`/api/recipes/${selectedItem.id}/ingredients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ingredients: recipeIngredients,
            isUpdate: true,
          }),
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to save recipe ingredients:', {
            status: response.status,
            statusText: response.statusText,
            error: result.error || result.message,
            recipeId: selectedItem.id,
            ingredientsCount: recipeIngredients.length,
          });
          showError(result.error || result.message || `Failed to save recipe ingredients (${response.status})`);
          return;
        }

        const result = await response.json();
        console.log('Recipe ingredients saved successfully:', result);
      } else {
        const dish = allDishes.find(d => d.id === selectedItem.id);
        if (!dish) {
          showError('Dish not found');
          return;
        }

        // For dishes, save as standalone ingredients (recipes are expanded)
        const dishIngredients = calculations.map(calc => ({
          ingredient_id: calc.ingredientId,
          quantity: calc.quantity,
          unit: calc.unit,
        }));

        const response = await fetch(`/api/dishes/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dish_name: dish.dish_name,
            description: dish.description,
            selling_price: dish.selling_price,
            recipes: [], // Dishes in editor mode only use standalone ingredients
            ingredients: dishIngredients,
          }),
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to save dish ingredients:', {
            status: response.status,
            statusText: response.statusText,
            error: result.error || result.message,
            dishId: selectedItem.id,
            ingredientsCount: dishIngredients.length,
          });
          showError(result.error || result.message || `Failed to save dish ingredients (${response.status})`);
          return;
        }

        const result = await response.json();
        console.log('Dish ingredients saved successfully:', result);
      }

      showSuccess(`${selectedItem.type === 'recipe' ? 'Recipe' : 'Dish'} ingredients saved successfully`);
      onSave();
    } catch (err) {
      console.error('Failed to save:', err);
      showError('Failed to save ingredients');
    } finally {
      setSaving(false);
    }
  }, [calculations, selectedItem, allRecipes, allDishes, onSave, showError, showSuccess]);

  const capitalizeName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Combine recipes and dishes for display
  const allItems: RecipeDishItem[] = useMemo(() => {
    const items: RecipeDishItem[] = [
      ...allRecipes.map(r => ({
        id: r.id,
        name: r.name,
        type: 'recipe' as const,
      })),
      ...allDishes.map(d => ({
        id: d.id,
        name: d.dish_name,
        type: 'dish' as const,
      })),
    ];
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [allRecipes, allDishes]);

  // Show loading only for initial data fetch, not for ingredient loading
  if (dataLoading || (loading && allItems.length === 0)) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" width="w-64" height="h-8" />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            aria-label="Back to list"
          >
            <Icon icon={ArrowLeft} size="md" aria-hidden={true} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Recipe & Dish Editor</h2>
            <p className="text-sm text-gray-400">Select a recipe or dish to edit its ingredients</p>
          </div>
        </div>
      </div>

      {/* Two Column Grid Layout */}
      <div className="grid grid-cols-1 gap-6 large-desktop:grid-cols-2">
        {/* Left Column - Recipe/Dish Selector */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Select Recipe or Dish</h3>
          <div className="max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto">
            {allItems.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-gray-400">
                <p>No recipes or dishes found</p>
              </div>
            ) : (
              allItems.map(item => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                    selectedItem?.id === item.id && selectedItem?.type === item.type
                      ? 'border-[#29E7CD] bg-[#29E7CD]/10'
                      : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#29E7CD]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon
                        icon={item.type === 'recipe' ? BookOpen : UtensilsCrossed}
                        size="md"
                        className={item.type === 'recipe' ? 'text-[#3B82F6]' : 'text-[#29E7CD]'}
                        aria-hidden={true}
                      />
                      <div>
                        <p className="font-medium text-white">{capitalizeName(item.name)}</p>
                        <p className="text-xs text-gray-400">
                          {item.type === 'recipe' ? 'Recipe' : 'Dish'}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Ingredient Editor */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          {!selectedItem ? (
            <div className="flex h-full min-h-[400px] items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="mb-2 text-lg">Select a recipe or dish</p>
                <p className="text-sm">Choose an item from the left to edit its ingredients</p>
              </div>
            </div>
          ) : loadingIngredients && calculations.length === 0 ? (
            // Only show skeleton if we have no calculations to display
            <div className="space-y-4">
              <LoadingSkeleton variant="text" width="w-48" height="h-6" />
              <LoadingSkeleton variant="card" />
            </div>
          ) : (
            <div className={`flex h-full flex-col transition-opacity duration-200 ${loadingIngredients ? 'opacity-60' : 'opacity-100'}`}>
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {capitalizeName(selectedItem.name)}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {selectedItem.type === 'recipe' ? 'Recipe' : 'Dish'} Ingredients
                  </p>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="mb-6 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Total Cost</p>
                    <p className="text-xl font-bold text-white">${totalCOGS.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">
                      Cost per {selectedItem.type === 'recipe' ? 'Portion' : 'Serving'}
                    </p>
                    <p className="text-xl font-bold text-[#29E7CD]">${costPerPortion.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Ingredients</p>
                    <p className="text-xl font-bold text-white">{calculations.length}</p>
                  </div>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="mb-6 flex-1 overflow-y-auto">
                {calculations.length > 0 ? (
                  <IngredientsList
                    calculations={calculations}
                    onUpdateCalculation={(ingredientId, newQuantity) => {
                      updateCalculation(ingredientId, newQuantity, ingredients, setCalculations);
                    }}
                    onRemoveCalculation={(ingredientId) => {
                      setCalculations(prev => prev.filter(calc => calc.ingredientId !== ingredientId));
                    }}
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center text-gray-400">
                    <p>No ingredients added yet</p>
                  </div>
                )}
              </div>

              {/* Add Ingredient Section */}
              <div className="border-t border-[#2a2a2a] pt-4">
                <IngredientManager
                  showAddIngredient={showAddIngredient}
                  ingredients={ingredients}
                  ingredientSearch={ingredientSearch}
                  showSuggestions={showSuggestions}
                  filteredIngredients={filteredIngredients}
                  selectedIngredient={selectedIngredient}
                  highlightedIndex={highlightedIndex}
                  newIngredient={newIngredient}
                  onToggleAddIngredient={() => setShowAddIngredient(!showAddIngredient)}
                  onSearchChange={handleSearchChange}
                  onIngredientSelect={handleIngredientSelect}
                  onKeyDown={(e) => handleKeyDown(e, filteredIngredients)}
                  onQuantityChange={(quantity) => setNewIngredient(prev => ({ ...prev, quantity }))}
                  onUnitChange={(unit) => setNewIngredient(prev => ({ ...prev, unit }))}
                  onAddIngredient={handleAddIngredientWrapper}
                />
              </div>

              {/* Save Button */}
              <div className="mt-4 border-t border-[#2a2a2a] pt-4">
                <button
                  onClick={() => {
                    console.log('Save button clicked:', {
                      selectedItem,
                      calculationsCount: calculations.length,
                      saving,
                    });
                    handleSave();
                  }}
                  disabled={saving || calculations.length === 0 || !selectedItem}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <Icon icon={Save} size="sm" className="text-white" aria-hidden={true} />
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
          )}
        </div>
      </div>

      {dataError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {dataError}
        </div>
      )}
    </div>
  );
}
