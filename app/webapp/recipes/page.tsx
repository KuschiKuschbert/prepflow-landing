'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

// External dependencies
import { supabase } from '@/lib/supabase';

// UI components
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

// Local hooks and types
import { useAIInstructions } from './hooks/useAIInstructions';
import { useRecipeManagement } from './hooks/useRecipeManagement';
import { COGSCalculation, Recipe, RecipeIngredientWithDetails } from './types';

// Local components
import BulkActionsBar from './components/BulkActionsBar';
import RecipeCard from './components/RecipeCard';
import RecipeForm from './components/RecipeForm';
import RecipePreviewModal from './components/RecipePreviewModal';
import RecipeTable from './components/RecipeTable';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { BulkDeleteConfirmationModal } from './components/BulkDeleteConfirmationModal';

// Utils
import { formatQuantity as formatQuantityUtil } from './utils/formatQuantity';

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
    setError,
  } = useRecipeManagement();

  const { aiInstructions, generatingInstructions, generateAIInstructions } = useAIInstructions();

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
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientWithDetails[]>([]);
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

  // Helper function - format quantity with yield adjustment
  const formatQuantity = (quantity: number, unit: string) => {
    return formatQuantityUtil(quantity, unit, previewYield, selectedRecipe?.yield || 1);
  };

  // Event handlers
  const handleAddRecipe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const { error } = await supabase.from('recipes').insert([newRecipe]);

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
    },
    [newRecipe, setError, fetchRecipes],
  );

  const handlePreviewRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        // cleaned: Removed debug console.log statements
        const ingredients = await fetchRecipeIngredients(recipe.id);
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
    },
    [fetchRecipeIngredients, setError, generateAIInstructions],
  );

  const handleEditFromPreview = () => {
    if (!selectedRecipe || !recipeIngredients.length) {
      setError('No recipe data available for editing');
      return;
    }

    try {
      // cleaned: Removed debug console.log statements
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
          id: ri.id,
          ingredient_id: ingredient.id,
          ingredientId: ingredient.id,
          ingredient_name: ingredient.ingredient_name,
          ingredientName: ingredient.ingredient_name,
          quantity: quantity,
          unit: ri.unit,
          cost_per_unit: costPerUnit,
          total_cost: totalCost,
          yieldAdjustedCost: yieldAdjustedCost,
          supplier_name: ingredient.supplier_name,
          category: ingredient.category,
        };
      });

      // cleaned: Removed debug console.log statement
      // Store data in sessionStorage for COGS page
      sessionStorage.setItem(
        'editingRecipe',
        JSON.stringify({
          recipe: selectedRecipe,
          recipeId: selectedRecipe.id, // Pass the specific recipe ID
          calculations,
          dishName: selectedRecipe.name,
          dishPortions: selectedRecipe.yield,
          dishNameLocked: true,
        }),
      );

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
      setSuccessMessage(
        `Recipe "${capitalizeRecipeName(recipeToDelete.name)}" deleted successfully!`,
      );
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
      setSuccessMessage(
        `${selectedRecipes.size} recipe${selectedRecipes.size > 1 ? 's' : ''} deleted successfully!`,
      );
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
          unit: ri.unit,
        })),
        aiInstructions: aiInstructions,
        created_at: selectedRecipe.created_at,
        shared_at: new Date().toISOString(),
      };

      // Call the recipe share API
      const response = await fetch('/api/recipe-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeData,
          userId: 'user-123', // You can get this from auth context
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
    <div className="min-h-screen bg-transparent p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <Image
              src="/images/prepflow-logo.png"
              alt="PrepFlow Logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
            <h1 className="text-4xl font-bold text-white">📖 Recipe Book</h1>
          </div>
          <p className="text-gray-400">Manage your saved recipes and create new ones</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
          >
            {showAddForm ? 'Cancel' : '+ Add Manual Recipe'}
          </button>
          <a
            href="/webapp/cogs"
            className="rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 hover:shadow-xl"
          >
            Create Recipe from COGS
          </a>
          <button
            onClick={() => {
              fetchRecipes();
            }}
            className="rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#3B82F6] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#D925C7]/80 hover:to-[#3B82F6]/80 hover:shadow-xl"
          >
            🔄 Refresh Recipes
          </button>
        </div>

        {/* Recipe Book Description */}
        <div className="mb-6 rounded-xl border border-[#29E7CD]/30 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-4 sm:p-6">
          <h2 className="mb-2 text-lg font-semibold text-white">How Recipe Book Works</h2>
          <div className="grid gap-4 text-sm text-gray-300 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium text-[#3B82F6]">✍️ Manual Recipes</h3>
              <p>
                Add recipes manually with instructions and portion counts. Perfect for documenting
                cooking methods and procedures.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-[#29E7CD]">📊 From COGS Calculations</h3>
              <p>
                Create cost calculations in the COGS screen, then save them as recipes. These
                recipes include all ingredient costs and portion calculations.
              </p>
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
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-center rounded border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 text-green-700">
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
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
        <div className="overflow-hidden rounded-lg bg-[#1f1f1f] shadow">
          <div className="sticky top-0 z-10 border-b border-[#2a2a2a] bg-[#1f1f1f] px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recipes ({recipes.length})</h2>
              {selectedRecipes.size > 0 && (
                <div className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626]">
                    <span className="text-xs font-bold text-white">{selectedRecipes.size}</span>
                  </div>
                  <span className="text-sm text-gray-300">{selectedRecipes.size} selected</span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="block md:hidden">
            <div className="divide-y divide-[#2a2a2a]">
              {recipes.map(recipe => (
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
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl text-gray-400">🍳</div>
            <h3 className="mb-2 text-lg font-medium text-white">No recipes yet</h3>
            <p className="mb-4 text-gray-500">
              Start by adding your first recipe to begin managing your kitchen costs.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-white transition-colors hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
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
        <DeleteConfirmationModal
          show={showDeleteConfirm}
          recipe={recipeToDelete}
          capitalizeRecipeName={capitalizeRecipeName}
          onConfirm={confirmDeleteRecipe}
          onCancel={cancelDeleteRecipe}
        />

        {/* Bulk Delete Confirmation Modal */}
        <BulkDeleteConfirmationModal
          show={showBulkDeleteConfirm}
          selectedRecipeIds={selectedRecipes}
          recipes={recipes}
          capitalizeRecipeName={capitalizeRecipeName}
          onConfirm={confirmBulkDelete}
          onCancel={cancelBulkDelete}
        />
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
