'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useRecipeManagement } from './hooks/useRecipeManagement';
import { useAIInstructions } from './hooks/useAIInstructions';
import { Recipe, RecipeIngredient, COGSCalculation } from './types';
import RecipeCard from './components/RecipeCard';
import RecipeTable from './components/RecipeTable';
import RecipeForm from './components/RecipeForm';
import BulkActionsBar from './components/BulkActionsBar';
import RecipePreviewModal from './components/RecipePreviewModal';

function RecipesPageContent() {
  const router = useRouter();
  const {
    recipes,
    loading,
    error,
    recipePrices,
    capitalizeRecipeName,
    fetchRecipes,
    fetchRecipeIngredients,
    handleEditRecipe,
    setError
  } = useRecipeManagement();

  const {
    aiInstructions,
    generatingInstructions,
    generateAIInstructions
  } = useAIInstructions();

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: '',
    yield: 1,
    yield_unit: 'servings',
    instructions: '',
  });

  // Preview state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewYield, setPreviewYield] = useState<number>(1);

  // Selection state
  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Share state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareLoading, setShareLoading] = useState(false);

  // Success message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper functions
  const formatQuantity = (quantity: number, unit: string) => {
    const adjustedQuantity = previewYield / (selectedRecipe?.yield || 1) * quantity;
    
    // Smart conversions for common units
    if (unit.toLowerCase() === 'gm' || unit.toLowerCase() === 'g' || unit.toLowerCase() === 'gram') {
      if (adjustedQuantity >= 1000) {
        return {
          value: (adjustedQuantity / 1000).toFixed(1),
          unit: 'kg',
          original: `${adjustedQuantity.toFixed(1)} ${unit}`
        };
      }
    }
    
    if (unit.toLowerCase() === 'ml' || unit.toLowerCase() === 'milliliter') {
      if (adjustedQuantity >= 1000) {
        return {
          value: (adjustedQuantity / 1000).toFixed(1),
          unit: 'L',
          original: `${adjustedQuantity.toFixed(1)} ${unit}`
        };
      }
    }
    
    // For smaller quantities, show more precision
    if (adjustedQuantity < 1) {
      return {
        value: adjustedQuantity.toFixed(2),
        unit: unit,
        original: `${adjustedQuantity.toFixed(2)} ${unit}`
      };
    }
    
    // Default formatting
    return {
      value: adjustedQuantity.toFixed(1),
      unit: unit,
      original: `${adjustedQuantity.toFixed(1)} ${unit}`
    };
  };

  // Event handlers
  const handleAddRecipe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('recipes')
        .insert([newRecipe]);

      if (error) {
        setError(error.message);
      } else {
        setShowAddForm(false);
        setNewRecipe({
          name: '',
          yield: 1,
          yield_unit: 'servings',
          instructions: '',
        });
        fetchRecipes();
      }
    } catch (err) {
      setError('Failed to add recipe');
    }
  }, [newRecipe, setError, fetchRecipes]);

  const handlePreviewRecipe = useCallback(async (recipe: Recipe) => {
    try {
      console.log('🔍 DEBUG: Fetching ingredients for recipe:', recipe.name, recipe.id);
      const ingredients = await fetchRecipeIngredients(recipe.id);
      console.log('🔍 DEBUG: Fetched ingredients:', ingredients);
      setSelectedRecipe(recipe);
      setRecipeIngredients(ingredients);
      setPreviewYield(recipe.yield); // Initialize with original yield
      setShowPreview(true);
      
      // Generate AI instructions
      await generateAIInstructions(recipe, ingredients);
    } catch (err) {
      console.error('❌ Error in handlePreviewRecipe:', err);
      setError('Failed to load recipe preview');
    }
  }, [fetchRecipeIngredients, setError, generateAIInstructions]);

  const handleEditFromPreview = () => {
    if (!selectedRecipe || !recipeIngredients.length) {
      setError('No recipe data available for editing');
      return;
    }

    try {
      console.log('🔍 DEBUG: Recipe ingredients from preview:', recipeIngredients);
      console.log('🔍 DEBUG: Selected recipe:', selectedRecipe);

      // Convert already loaded recipe ingredients to COGSCalculation format
      const calculations: COGSCalculation[] = recipeIngredients.map(ri => {
        const ingredient = ri.ingredients;
        const quantity = ri.quantity;
        const costPerUnit = ingredient.cost_per_unit;
        const totalCost = quantity * costPerUnit;

        // Apply waste and yield adjustments
        const wastePercent = ingredient.trim_peel_waste_percentage || 0;
        const yieldPercent = ingredient.yield_percentage || 100;
        const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
        const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

        return {
          recipeId: selectedRecipe.id,
          ingredientId: ingredient.id,
          ingredientName: ingredient.ingredient_name,
          quantity: quantity,
          unit: ri.unit,
          costPerUnit: costPerUnit,
          totalCost: totalCost,
          wasteAdjustedCost: wasteAdjustedCost,
          yieldAdjustedCost: yieldAdjustedCost
        };
      });

      console.log('🔍 DEBUG: Final calculations array:', calculations);

      // Store data in sessionStorage for COGS page
      sessionStorage.setItem('editingRecipe', JSON.stringify({
        recipe: selectedRecipe,
        recipeId: selectedRecipe.id, // Pass the specific recipe ID
        calculations,
        dishName: selectedRecipe.name,
        dishPortions: selectedRecipe.yield,
        dishNameLocked: true
      }));

      // Close the preview modal
      setShowPreview(false);

      // Navigate to COGS page
      router.push('/webapp/cogs');
    } catch (err) {
      console.error('❌ Error in handleEditFromPreview:', err);
      setError('Failed to load recipe for editing');
    }
  };

  const handleDeleteRecipe = useCallback((recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;

    try {
      // First delete all recipe ingredients
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', recipeToDelete.id);

      if (ingredientsError) {
        setError(ingredientsError.message);
        return;
      }

      // Then delete the recipe
      const { error: recipeError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeToDelete.id);

      if (recipeError) {
        setError(recipeError.message);
        return;
      }

      // Refresh the recipes list
      await fetchRecipes();
      
      // Show success message
      setSuccessMessage(`Recipe "${capitalizeRecipeName(recipeToDelete.name)}" deleted successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Close the confirmation modal
      setShowDeleteConfirm(false);
      setRecipeToDelete(null);

    } catch (err) {
      setError('Failed to delete recipe');
    }
  };

  const cancelDeleteRecipe = () => {
    setShowDeleteConfirm(false);
    setRecipeToDelete(null);
  };

  // Multi-selection functions
  const handleSelectRecipe = useCallback((recipeId: string) => {
    setSelectedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = () => {
    if (selectedRecipes.size === recipes.length) {
      setSelectedRecipes(new Set());
    } else {
      setSelectedRecipes(new Set(recipes.map(r => r.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedRecipes.size === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedRecipes.size === 0) return;

    try {
      const selectedRecipeIds = Array.from(selectedRecipes);
      
      // Delete all recipe ingredients for selected recipes
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .delete()
        .in('recipe_id', selectedRecipeIds);

      if (ingredientsError) {
        setError(ingredientsError.message);
        return;
      }

      // Delete all selected recipes
      const { error: recipesError } = await supabase
        .from('recipes')
        .delete()
        .in('id', selectedRecipeIds);

      if (recipesError) {
        setError(recipesError.message);
        return;
      }

      // Refresh the recipes list
      await fetchRecipes();
      
      // Show success message
      setSuccessMessage(`${selectedRecipes.size} recipe${selectedRecipes.size > 1 ? 's' : ''} deleted successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Clear selection and close modal
      setSelectedRecipes(new Set());
      setShowBulkDeleteConfirm(false);

    } catch (err) {
      setError('Failed to delete recipes');
    }
  };

  const cancelBulkDelete = () => {
    setShowBulkDeleteConfirm(false);
  };

  const handleShareRecipe = async () => {
    if (!selectedRecipe || !recipeIngredients.length) {
      setError('No recipe data available for sharing');
      return;
    }

    setShareLoading(true);
    try {
      // Create a compressed recipe data object
      const recipeData = {
        name: selectedRecipe.name,
        yield: selectedRecipe.yield,
        yield_unit: selectedRecipe.yield_unit,
        instructions: selectedRecipe.instructions,
        ingredients: recipeIngredients.map(ri => ({
          name: ri.ingredients.ingredient_name,
          quantity: ri.quantity,
          unit: ri.unit
        })),
        aiInstructions: aiInstructions,
        created_at: selectedRecipe.created_at,
        shared_at: new Date().toISOString()
      };

      // Call the recipe share API
      const response = await fetch('/api/recipe-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeData,
          userId: 'user-123' // You can get this from auth context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create share link');
      }

      const result = await response.json();
      setShareUrl(result.shareUrl);
      setShowShareModal(true);
    } catch (err) {
      setError('Failed to share recipe');
    } finally {
      setShareLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
            <h1 className="text-4xl font-bold text-white">
              📖 Recipe Book
            </h1>
          </div>
          <p className="text-gray-400">Manage your saved recipes and create new ones</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white px-6 py-3 rounded-2xl hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            {showAddForm ? 'Cancel' : '+ Add Manual Recipe'}
          </button>
          <a
            href="/webapp/cogs"
            className="bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] text-white px-6 py-3 rounded-2xl hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Create Recipe from COGS
          </a>
          <button
            onClick={() => {
              fetchRecipes();
            }}
            className="bg-gradient-to-r from-[#D925C7] to-[#3B82F6] text-white px-6 py-3 rounded-2xl hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            🔄 Refresh Recipes
          </button>
        </div>

        {/* Recipe Book Description */}
        <div className="bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 border border-[#29E7CD]/30 p-4 sm:p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">How Recipe Book Works</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h3 className="font-medium text-[#3B82F6] mb-2">✍️ Manual Recipes</h3>
              <p>Add recipes manually with instructions and portion counts. Perfect for documenting cooking methods and procedures.</p>
            </div>
            <div>
              <h3 className="font-medium text-[#29E7CD] mb-2">📊 From COGS Calculations</h3>
              <p>Create cost calculations in the COGS screen, then save them as recipes. These recipes include all ingredient costs and portion calculations.</p>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedRecipes.size}
          onBulkDelete={handleBulkDelete}
          onClearSelection={() => setSelectedRecipes(new Set())}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Recipe Form */}
        <RecipeForm
          showForm={showAddForm}
          newRecipe={newRecipe}
          onToggleForm={() => setShowAddForm(!showAddForm)}
          onUpdateRecipe={setNewRecipe}
          onSubmit={handleAddRecipe}
        />

        {/* Recipes List */}
        <div className="bg-[#1f1f1f] rounded-lg shadow overflow-hidden">
          <div className="sticky top-0 z-10 bg-[#1f1f1f] px-4 sm:px-6 py-4 border-b border-[#2a2a2a]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Recipes ({recipes.length})
              </h2>
              {selectedRecipes.size > 0 && (
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-xs">{selectedRecipes.size}</span>
                  </div>
                  <span className="text-sm text-gray-300">
                    {selectedRecipes.size} selected
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Card Layout */}
          <div className="block md:hidden">
            <div className="divide-y divide-[#2a2a2a]">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  recipePrices={recipePrices}
                  selectedRecipes={selectedRecipes}
                  onSelectRecipe={handleSelectRecipe}
                  onPreviewRecipe={handlePreviewRecipe}
                  onEditRecipe={handleEditRecipe}
                  onDeleteRecipe={handleDeleteRecipe}
                  capitalizeRecipeName={capitalizeRecipeName}
                />
              ))}
            </div>
          </div>

          {/* Desktop Table Layout */}
          <RecipeTable
            recipes={recipes}
            recipePrices={recipePrices}
            selectedRecipes={selectedRecipes}
            onSelectAll={handleSelectAll}
            onSelectRecipe={handleSelectRecipe}
            onPreviewRecipe={handlePreviewRecipe}
            onEditRecipe={handleEditRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            capitalizeRecipeName={capitalizeRecipeName}
          />
        </div>

        {/* Empty State */}
        {recipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍳</div>
            <h3 className="text-lg font-medium text-white mb-2">No recipes yet</h3>
            <p className="text-gray-500 mb-4">
              Start by adding your first recipe to begin managing your kitchen costs.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white px-4 py-2 rounded-lg hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80 transition-colors"
            >
              Add Your First Recipe
            </button>
          </div>
        )}

        {/* Recipe Preview Modal */}
        <RecipePreviewModal
          showPreview={showPreview}
          selectedRecipe={selectedRecipe}
          recipeIngredients={recipeIngredients}
          aiInstructions={aiInstructions}
          generatingInstructions={generatingInstructions}
          previewYield={previewYield}
          shareLoading={shareLoading}
          onClose={() => setShowPreview(false)}
          onEditFromPreview={handleEditFromPreview}
          onShareRecipe={handleShareRecipe}
          onPrint={handlePrint}
          onUpdatePreviewYield={setPreviewYield}
          capitalizeRecipeName={capitalizeRecipeName}
          formatQuantity={formatQuantity}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && recipeToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-md w-full border border-[#2a2a2a]">
              <div className="p-6 border-b border-[#2a2a2a]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Delete Recipe</h3>
                    <p className="text-gray-400 text-sm">This action cannot be undone</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete <span className="font-semibold text-white">"{capitalizeRecipeName(recipeToDelete.name)}"</span>? 
                  This will permanently remove the recipe and all its ingredients from your Recipe Book.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelDeleteRecipe}
                    className="flex-1 bg-[#2a2a2a] text-gray-300 px-4 py-3 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteRecipe}
                    className="flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-4 py-3 rounded-xl hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    Delete Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Confirmation Modal */}
        {showBulkDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-md w-full border border-[#2a2a2a]">
              <div className="p-6 border-b border-[#2a2a2a]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Delete Multiple Recipes</h3>
                    <p className="text-gray-400 text-sm">This action cannot be undone</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete <span className="font-semibold text-white">{selectedRecipes.size} recipe{selectedRecipes.size > 1 ? 's' : ''}</span>? 
                  This will permanently remove all selected recipes and their ingredients from your Recipe Book.
                </p>
                <div className="bg-[#0a0a0a] rounded-lg p-4 mb-6 max-h-32 overflow-y-auto">
                  <h4 className="text-sm font-medium text-white mb-2">Selected Recipes:</h4>
                  <div className="space-y-1">
                    {Array.from(selectedRecipes).map(recipeId => {
                      const recipe = recipes.find(r => r.id === recipeId);
                      return recipe ? (
                        <div key={recipeId} className="text-xs text-gray-400">• {capitalizeRecipeName(recipe.name)}</div>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={cancelBulkDelete}
                    className="flex-1 bg-[#2a2a2a] text-gray-300 px-4 py-3 rounded-xl hover:bg-[#3a3a3a] transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBulkDelete}
                    className="flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-4 py-3 rounded-xl hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    Delete {selectedRecipes.size} Recipe{selectedRecipes.size > 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecipesPageRefactored() {
  return (
    <ErrorBoundary>
      <RecipesPageContent />
    </ErrorBoundary>
  );
}
