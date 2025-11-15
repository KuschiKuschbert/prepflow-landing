'use client';

import { useSelectionMode } from '@/app/webapp/ingredients/hooks/useSelectionMode';
import { Icon } from '@/components/ui/Icon';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { TablePagination } from '@/components/ui/TablePagination';
import { formatRecipeName } from '@/lib/text-utils';
import { ChefHat, List, Edit } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DishBuilderClient from '../../dish-builder/components/DishBuilderClient';
import { useAIInstructions } from '../hooks/useAIInstructions';
import { useDishFiltering } from '../hooks/useDishFiltering';
import { useRecipeIngredients } from '../hooks/useRecipeIngredients';
import { useRecipePricing } from '../hooks/useRecipePricing';
import { Dish, DishCostData, Recipe, RecipeIngredientWithDetails } from '../types';
import { formatQuantity as formatQuantityUtil } from '../utils/formatQuantity';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import DishCard from './DishCard';
import { DishEditDrawer } from './DishEditDrawer';
import DishTable from './DishTable';
import RecipeCard from './RecipeCard';
import RecipeTable from './RecipeTable';
import { SelectionModeBanner } from './SelectionModeBanner';
import { SuccessMessage } from './SuccessMessage';
import { RecipeDishEditor } from './RecipeDishEditor';
import { RecipeSidePanel } from './RecipeSidePanel';
import { DishSidePanel } from './DishSidePanel';

type ViewMode = 'list' | 'editor' | 'builder';

// Unified item type for dishes and recipes
type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

export default function DishesClient() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dishCosts, setDishCosts] = useState<Map<string, DishCostData>>(new Map());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Selection mode hook
  const {
    isSelectionMode,
    startLongPress,
    cancelLongPress,
    enterSelectionMode,
    exitSelectionMode,
  } = useSelectionMode();
  const [itemToDelete, setItemToDelete] = useState<UnifiedItem | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Recipe preview panel state
  const [selectedRecipeForPreview, setSelectedRecipeForPreview] = useState<Recipe | null>(null);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientWithDetails[]>([]);
  const [showRecipePanel, setShowRecipePanel] = useState(false);
  const [previewYield, setPreviewYield] = useState<number>(1);

  // Dish preview panel state
  const [selectedDishForPreview, setSelectedDishForPreview] = useState<Dish | null>(null);
  const [showDishPanel, setShowDishPanel] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [showDishEditDrawer, setShowDishEditDrawer] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [editingItem, setEditingItem] = useState<{ item: Recipe | Dish; type: 'recipe' | 'dish' } | null>(null);
  const [highlightingRowId, setHighlightingRowId] = useState<string | null>(null);
  const [highlightingRowType, setHighlightingRowType] = useState<'recipe' | 'dish' | null>(null);

  // Recipe pricing hooks
  const {
    recipePrices,
    updateVisibleRecipePrices,
  } = useRecipePricing();
  const { fetchRecipeIngredients, fetchBatchRecipeIngredients } = useRecipeIngredients(setError);
  const capitalizeRecipeName = formatRecipeName;
  const calculatingPricesRef = useRef<Set<string>>(new Set());

  // AI Instructions hook
  const {
    aiInstructions,
    generatingInstructions,
    generateAIInstructions,
  } = useAIInstructions();

  // Format quantity utility
  const formatQuantity = useCallback(
    (q: number, u: string) => formatQuantityUtil(q, u, previewYield, selectedRecipeForPreview?.yield || 1),
    [previewYield, selectedRecipeForPreview?.yield],
  );

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both dishes and recipes in parallel
      const [dishesResponse, recipesResponse] = await Promise.all([
        fetch('/api/dishes', { cache: 'no-store' }),
        fetch('/api/recipes', { cache: 'no-store' }),
      ]);

      const dishesResult = await dishesResponse.json();
      const recipesResult = await recipesResponse.json();

      if (!dishesResponse.ok) {
        setError(dishesResult.error || 'Failed to fetch dishes');
        setLoading(false);
        return;
      }

      if (!recipesResponse.ok) {
        setError(recipesResult.error || 'Failed to fetch recipes');
        setLoading(false);
        return;
      }

      const dishesList = dishesResult.dishes || [];
      const recipesList = recipesResult.recipes || [];

      setDishes(dishesList);
      setRecipes(recipesList);
      setLoading(false);

      // Fetch costs for all dishes
      const costPromises = dishesList.map(async (dish: Dish) => {
        try {
          const costResponse = await fetch(`/api/dishes/${dish.id}/cost`);
          const costResult = await costResponse.json();
          if (costResult.success && costResult.cost) {
            return { dishId: dish.id, cost: costResult.cost };
          }
        } catch (err) {
          console.error(`Failed to fetch cost for dish ${dish.id}:`, err);
        }
        return null;
      });

      const costs = await Promise.all(costPromises);
      const costMap = new Map<string, DishCostData>();
      costs.forEach(c => {
        if (c) costMap.set(c.dishId, c.cost);
      });
      setDishCosts(costMap);

      // Calculate prices for visible recipes (first page - default 20 items)
      if (recipesList.length > 0) {
        const firstPageRecipes = recipesList.slice(0, 20);
        updateVisibleRecipePrices(
          firstPageRecipes,
          fetchRecipeIngredients,
          fetchBatchRecipeIngredients,
        ).catch(err => {
          console.error('Failed to calculate recipe prices:', err);
        });
      }
    } catch (err) {
      setError('Failed to fetch items');
      setLoading(false);
    }
  }, [updateVisibleRecipePrices, fetchRecipeIngredients, fetchBatchRecipeIngredients]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Refresh items when switching from builder/editor to list view
  useEffect(() => {
    if (viewMode === 'list') {
      fetchItems();
      // Clear editing state when switching back to list
      setEditingRecipe(null);
      setEditingItem(null);
      setHighlightingRowId(null);
      setHighlightingRowType(null);
    }
  }, [viewMode, fetchItems]);


  const handleEditDish = (dish: Dish) => {
    // If editor is already open, close it first
    if (viewMode === 'editor' && editingItem) {
      setViewMode('list');
      setEditingItem(null);
    }
    // Start highlight animation
    setHighlightingRowId(dish.id);
    setHighlightingRowType('dish');
    // After animation delay, open editor
    setTimeout(() => {
      setEditingItem({ item: dish, type: 'dish' });
      setViewMode('editor');
      setHighlightingRowId(null);
      setHighlightingRowType(null);
    }, 500);
  };

  const handleEditRecipe = useCallback((recipe: Recipe) => {
    // Close panel if open
    setShowRecipePanel(false);
    setSelectedRecipeForPreview(null);
    // If editor is already open, close it first
    if (viewMode === 'editor' && editingItem) {
      setViewMode('list');
      setEditingItem(null);
    }
    // Start highlight animation
    setHighlightingRowId(recipe.id);
    setHighlightingRowType('recipe');
    // After animation delay, open editor
    setTimeout(() => {
      setEditingItem({ item: recipe, type: 'recipe' });
      setViewMode('editor');
      setHighlightingRowId(null);
      setHighlightingRowType(null);
    }, 500);
  }, [viewMode, editingItem]);

  const handleDeleteDish = (dish: Dish) => {
    setItemToDelete({ ...dish, itemType: 'dish' });
    setShowDeleteConfirm(true);
  };

  const handleDeleteRecipe = (recipe: Recipe) => {
    setItemToDelete({ ...recipe, itemType: 'recipe' });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      const endpoint = itemToDelete.itemType === 'dish' ? `/api/dishes/${itemToDelete.id}` : `/api/recipes/${itemToDelete.id}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || `Failed to delete ${itemToDelete.itemType}`);
        return;
      }

      if (itemToDelete.itemType === 'dish') {
        setDishes(dishes.filter(d => d.id !== itemToDelete.id));
      } else {
        setRecipes(recipes.filter(r => r.id !== itemToDelete.id));
      }

      setSuccessMessage(`${itemToDelete.itemType === 'dish' ? 'Dish' : 'Recipe'} deleted successfully`);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(`Failed to delete ${itemToDelete.itemType}`);
    }
  };

  const cancelDeleteItem = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
      // Enter selection mode when selecting an item
      if (!isSelectionMode) {
        enterSelectionMode();
      }
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    const allItemIds = [...dishes.map(d => d.id), ...recipes.map(r => r.id)];
    if (selectedItems.size === allItemIds.length) {
      setSelectedItems(new Set());
      exitSelectionMode();
    } else {
      setSelectedItems(new Set(allItemIds));
      enterSelectionMode();
    }
  };

  const handleExitSelectionMode = () => {
    setSelectedItems(new Set());
    exitSelectionMode();
  };

  const handlePreviewDish = async (dish: Dish) => {
    setSelectedDishForPreview(dish);
    setShowDishPanel(true);
  };

  const handlePreviewRecipe = useCallback(async (recipe: Recipe) => {
    try {
      const ingredients = await fetchRecipeIngredients(recipe.id);
      setSelectedRecipeForPreview(recipe);
      setRecipeIngredients(ingredients);
      setPreviewYield(recipe.yield || 1);
      setShowRecipePanel(true);
      // Generate AI instructions in background (optional for side panel)
      generateAIInstructions(recipe, ingredients).catch(err => {
        console.error('Failed to generate AI instructions:', err);
      });
    } catch (err) {
      console.error('Failed to load recipe:', err);
      setError('Failed to load recipe details');
    }
  }, [fetchRecipeIngredients, generateAIInstructions]);

  // Combine dishes and recipes for unified display
  const allItems: UnifiedItem[] = [
    ...dishes.map(d => ({ ...d, itemType: 'dish' as const })),
    ...recipes.map(r => ({ ...r, itemType: 'recipe' as const })),
  ];

  const {
    filters,
    updateFilters,
    paginatedDishes,
    totalPages,
  } = useDishFiltering(dishes, dishCosts);

  // Paginate unified items
  const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
  const endIndex = startIndex + filters.itemsPerPage;
  const paginatedItems = allItems.slice(startIndex, endIndex);

  // Separate paginated dishes and recipes
  const paginatedDishesList = useMemo(() => {
    return paginatedItems.filter(item => item.itemType === 'dish') as (Dish & { itemType: 'dish' })[];
  }, [paginatedItems]);

  const paginatedRecipesList = useMemo(() => {
    return paginatedItems.filter(item => item.itemType === 'recipe') as (Recipe & { itemType: 'recipe' })[];
  }, [paginatedItems]);

  // Calculate recipe prices for visible recipes
  useEffect(() => {
    if (paginatedRecipesList.length === 0) return;

    const recipesNeedingPrices = paginatedRecipesList.filter(
      recipe => !recipePrices[recipe.id] && !calculatingPricesRef.current.has(recipe.id)
    );

    if (recipesNeedingPrices.length > 0) {
      recipesNeedingPrices.forEach(recipe => {
        calculatingPricesRef.current.add(recipe.id);
      });

      updateVisibleRecipePrices(
        recipesNeedingPrices,
        fetchRecipeIngredients,
        fetchBatchRecipeIngredients,
      )
        .then(() => {
          recipesNeedingPrices.forEach(recipe => {
            calculatingPricesRef.current.delete(recipe.id);
          });
        })
        .catch(err => {
          console.error('Failed to calculate visible recipe prices:', err);
          recipesNeedingPrices.forEach(recipe => {
            calculatingPricesRef.current.delete(recipe.id);
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedRecipesList.map(r => r.id).join(',')]);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div>
      {successMessage && <SuccessMessage message={successMessage} />}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Selection Mode Banner */}
      <SelectionModeBanner
        isSelectionMode={isSelectionMode}
        selectedCount={selectedItems.size}
        onExitSelectionMode={handleExitSelectionMode}
      />

      {/* View Mode Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none tablet:px-6 ${
              viewMode === 'list'
                ? 'bg-[#29E7CD] text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
            aria-pressed={Boolean(viewMode === 'list')}
            aria-label="List view"
          >
            <Icon icon={List} size="sm" />
            <span>List View</span>
          </button>
          <button
            onClick={() => {
              setViewMode('editor');
              setEditingItem(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none tablet:px-6 ${
              viewMode === 'editor'
                ? 'bg-[#29E7CD] text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
            aria-pressed={viewMode === 'editor'}
            aria-label="Editor view"
          >
            <Icon icon={Edit} size="sm" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setViewMode('builder')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none tablet:px-6 ${
              viewMode === 'builder'
                ? 'bg-[#29E7CD] text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
            aria-pressed={viewMode === 'builder'}
            aria-label="Builder view"
          >
            <Icon icon={ChefHat} size="sm" />
            <span>Builder</span>
          </button>
        </div>
      </div>

      {viewMode === 'editor' ? (
        editingItem ? (
          <RecipeDishEditor
            item={editingItem.item}
            itemType={editingItem.type}
            onClose={() => {
              setViewMode('list');
              setEditingItem(null);
            }}
            onSave={() => {
              fetchItems();
            }}
          />
        ) : (
          // Editor without initial item - user can select from left column
          <RecipeDishEditor
            item={null}
            itemType={undefined}
            onClose={() => {
              setViewMode('list');
              setEditingItem(null);
            }}
            onSave={() => {
              fetchItems();
            }}
          />
        )
      ) : viewMode === 'builder' ? (
        <DishBuilderClient
          editingRecipe={editingRecipe}
          onSaveSuccess={() => {
            setViewMode('list');
            setEditingRecipe(null); // Clear editing recipe after save
            fetchItems();
          }}
        />
      ) : (
        <>

      <TablePagination
        page={filters.currentPage}
        totalPages={Math.ceil(allItems.length / filters.itemsPerPage)}
        total={allItems.length}
        itemsPerPage={filters.itemsPerPage}
        onPageChange={page => updateFilters({ currentPage: page })}
        onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
        className="mb-4"
      />

      {/* Mobile Card Layout */}
      <div className="block large-desktop:hidden">
        <div className="divide-y divide-[#2a2a2a]">
          {paginatedItems.map(item => {
            if (item.itemType === 'dish') {
              return (
                <DishCard
                  key={item.id}
                  dish={item}
                  dishCost={dishCosts.get(item.id)}
                  selectedDishes={selectedItems}
                  onSelectDish={handleSelectItem}
                  onPreviewDish={handlePreviewDish}
                  onEditDish={handleEditDish}
                  onDeleteDish={handleDeleteDish}
                />
              );
            } else {
              return (
                <RecipeCard
                  key={item.id}
                  recipe={item}
                  recipePrices={recipePrices}
                  selectedRecipes={selectedItems}
                  onSelectRecipe={handleSelectItem}
                  onPreviewRecipe={handlePreviewRecipe}
                  onEditRecipe={handleEditRecipe}
                  onDeleteRecipe={handleDeleteRecipe}
                  capitalizeRecipeName={capitalizeRecipeName}
                />
              );
            }
          })}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden tablet:block space-y-6">
        {/* Dishes Table */}
        {paginatedDishesList.length > 0 && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#29E7CD]/60"></span>
              <span>Dishes</span>
              <span className="text-sm font-normal text-gray-400">({paginatedDishesList.length})</span>
            </h3>
            <DishTable
              dishes={paginatedDishesList}
              dishCosts={dishCosts}
              selectedDishes={selectedItems}
              highlightingRowId={highlightingRowType === 'dish' ? highlightingRowId : null}
              onSelectAll={handleSelectAll}
              onSelectDish={handleSelectItem}
              onPreviewDish={handlePreviewDish}
              onEditDish={handleEditDish}
              onDeleteDish={handleDeleteDish}
              sortField={filters.sortField}
              sortDirection={filters.sortDirection}
              onSortChange={(field, direction) => updateFilters({ sortField: field, sortDirection: direction })}
              isSelectionMode={isSelectionMode}
              onStartLongPress={startLongPress}
              onCancelLongPress={cancelLongPress}
              onEnterSelectionMode={enterSelectionMode}
            />
          </div>
        )}

        {/* Recipes Table */}
        {paginatedRecipesList.length > 0 && (
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]/60"></span>
              <span>Recipes</span>
              <span className="text-sm font-normal text-gray-400">({paginatedRecipesList.length})</span>
            </h3>
            <RecipeTable
              recipes={paginatedRecipesList}
              recipePrices={recipePrices}
              selectedRecipes={selectedItems}
              highlightingRowId={highlightingRowType === 'recipe' ? highlightingRowId : null}
              onSelectAll={handleSelectAll}
              onSelectRecipe={handleSelectItem}
              onPreviewRecipe={handlePreviewRecipe}
              onEditRecipe={handleEditRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              capitalizeRecipeName={capitalizeRecipeName}
              isSelectionMode={isSelectionMode}
              onStartLongPress={startLongPress}
              onCancelLongPress={cancelLongPress}
              onEnterSelectionMode={enterSelectionMode}
            />
          </div>
        )}
      </div>

      <TablePagination
        page={filters.currentPage}
        totalPages={Math.ceil(allItems.length / filters.itemsPerPage)}
        total={allItems.length}
        itemsPerPage={filters.itemsPerPage}
        onPageChange={page => updateFilters({ currentPage: page })}
        onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
        className="mt-4"
      />

      {/* Empty State */}
      {allItems.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">🍽️</div>
          <h3 className="mb-2 text-lg font-medium text-white">No dishes or recipes yet</h3>
          <p className="mb-4 text-gray-500">
            Create your first dish or recipe by combining ingredients.
          </p>
          <button
            onClick={() => setViewMode('builder')}
            className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-white transition-colors hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
          >
            Create Your First Item
          </button>
        </div>
      )}

      {/* Dish Side Panel */}
      <DishSidePanel
        isOpen={showDishPanel}
        dish={selectedDishForPreview}
        onClose={() => {
          setShowDishPanel(false);
          setSelectedDishForPreview(null);
        }}
        onEdit={(dish) => {
          setShowDishPanel(false);
          setSelectedDishForPreview(null);
          handleEditDish(dish);
        }}
        onDelete={(dish) => {
          setShowDishPanel(false);
          setSelectedDishForPreview(null);
          handleDeleteDish(dish);
        }}
      />

      {/* Recipe Side Panel */}
      <RecipeSidePanel
        isOpen={showRecipePanel}
        recipe={selectedRecipeForPreview}
        recipeIngredients={recipeIngredients}
        previewYield={previewYield}
        onClose={() => {
          setShowRecipePanel(false);
          setSelectedRecipeForPreview(null);
          setRecipeIngredients([]);
        }}
        onEditRecipe={(recipe) => {
          setShowRecipePanel(false);
          setSelectedRecipeForPreview(null);
          handleEditRecipe(recipe);
        }}
        onDeleteRecipe={(recipe) => {
          setShowRecipePanel(false);
          setSelectedRecipeForPreview(null);
          handleDeleteRecipe(recipe);
        }}
        capitalizeRecipeName={capitalizeRecipeName}
        formatQuantity={formatQuantity}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && itemToDelete && (
        <DeleteConfirmationModal
          itemName={itemToDelete.itemType === 'dish' ? itemToDelete.dish_name : itemToDelete.name}
          itemType={itemToDelete.itemType}
          onConfirm={confirmDeleteItem}
          onCancel={cancelDeleteItem}
        />
      )}

      {/* Dish Edit Drawer */}
      <DishEditDrawer
        isOpen={showDishEditDrawer}
        dish={editingDish}
        onClose={() => {
          setShowDishEditDrawer(false);
          setEditingDish(null);
        }}
        onSave={async () => {
          await fetchItems();
        }}
      />
        </>
      )}
    </div>
  );
}
