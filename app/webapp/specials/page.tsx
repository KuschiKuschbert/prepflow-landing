'use client';

import React, { useEffect, useState } from 'react';
import { UnifiedRecipeModal } from '../recipes/components/UnifiedRecipeModal';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { usePhotoUpload } from './hooks/usePhotoUpload';

// New Imports
import { RecipeIngredientWithDetails, Recipe as UnifiedRecipe } from '@/lib/types/recipes';
import { SpecialsFilters } from './components/SpecialsFilters';
import { SpecialsGrid } from './components/SpecialsGrid';
import { SpecialsHeader } from './components/SpecialsHeader';
import { useSpecialsData } from './hooks/useSpecialsData';
import { useSpecialsFilters } from './hooks/useSpecialsFilters';
import { adaptAiToUnified, APIRecipe } from './utils';

export default function AISpecialsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { submitPhoto, isProcessing, isAuthenticated } = usePhotoUpload();

  // Selected Recipe State for Modal
  const [selectedRecipe, setSelectedRecipe] = useState<{
    recipe: UnifiedRecipe | null;
    ingredients: RecipeIngredientWithDetails[];
  }>({ recipe: null, ingredients: [] });

  // Data & Search Hook
  const {
    inputInternal,
    setInputInternal,
    ingredients,
    setIngredients,
    recipes,
    loading,
    hasMore,
    fetchRecipes, // Exposed: (reset, ingredients, query, tags, cuisines, readyToCook)
    ref,
    inView,
    searchTimeout,
  } = useSpecialsData();

  // Filter Trigger Wrapper (to update recipes)
  const handleFilterChange = () => {
    // Re-fetch with new state (will be picked up by the values passed below or effects)
    // Actually, we need to pass the *latest* values.
    // Since state updates are async, we might need to rely on an Effect in this component
    // or pass the new value directly if available.
  };

  const {
    readyToCook,
    setReadyToCook,
    filterTags,
    setFilterTags,
    selectedCuisines,
    setSelectedCuisines,
    toggleFilterTag,
    toggleCuisine,
  } = useSpecialsFilters(handleFilterChange);

  // --- Logic Wiring ---

  // 1. Re-fetch when Filters Change (Debounced or Immediate)
  // We use an effect here to sync filter state with data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes(
        true, // reset
        ingredients,
        inputInternal.length > 3 ? inputInternal : undefined,
        filterTags,
        selectedCuisines,
        readyToCook,
      );
    }, 300);
    return () => clearTimeout(timer);
    // We intentionally omit fetchRecipes from deps to avoid loops if strict deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToCook, filterTags, selectedCuisines, ingredients]);
  // Note: ingredients in dep array handles add/remove ingredient triggering fetch

  // 2. Load More Handler
  const handleLoadMore = () => {
    fetchRecipes(
      false, // no reset
      ingredients,
      inputInternal,
      filterTags,
      selectedCuisines,
      readyToCook,
    );
  };

  // 3. Search Actions
  const handleActiveSearch = (term: string) => {
    setInputInternal(term);
    setIngredients([]);
    // Immediate fetch
    fetchRecipes(true, [], term, filterTags, selectedCuisines, readyToCook);
  };

  const handleAddIngredient = (ing: string) => {
    const trimmed = ing.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputInternal('');
      // Effect will trigger fetch due to [ingredients] dependency
    }
  };

  const handleRemoveIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
    // Effect will trigger fetch
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const term = inputInternal.trim();
      if (term.length > 0) {
        if (term.includes(' ')) {
          handleActiveSearch(term);
        } else {
          handleAddIngredient(term);
        }
      }
    } else if (e.key === 'Backspace' && inputInternal === '' && ingredients.length > 0) {
      handleRemoveIngredient(ingredients[ingredients.length - 1]);
    }
  };

  // 4. Recipe Click
  const handleRecipeClick = (aiRecipe: APIRecipe) => {
    const adapted = adaptAiToUnified(aiRecipe);
    setSelectedRecipe(adapted);
  };

  // 5. Photo Upload
  const handlePhotoSubmit = async (file: File, prompt: string) => {
    const result = await submitPhoto(file, prompt);
    if (result) {
      setIsUploadModalOpen(false);
      const newIngredients = Array.from(new Set([...ingredients, ...(result.ingredients || [])]));
      setIngredients(newIngredients);
      // Effect will trigger fetch
    }
  };

  return (
    <div className="webapp-main-content min-h-screen w-full bg-transparent">
      <SpecialsHeader
        inputInternal={inputInternal}
        setInputInternal={setInputInternal}
        ingredients={ingredients}
        removeIngredient={handleRemoveIngredient}
        activeSearch={handleActiveSearch}
        handleKeyDown={handleKeyDown}
        onCameraClick={() => setIsUploadModalOpen(true)}
        isAuthenticated={isAuthenticated}
      />

      <div className="mx-auto max-w-[2560px]">
        <SpecialsFilters
          readyToCook={readyToCook}
          setReadyToCook={setReadyToCook}
          selectedCuisines={selectedCuisines}
          toggleCuisine={toggleCuisine}
          filterTags={filterTags}
          toggleFilterTag={toggleFilterTag}
        />

        <SpecialsGrid
          loading={loading}
          recipes={recipes}
          ingredients={ingredients}
          inputInternal={inputInternal}
          hasMore={hasMore}
          loadMore={handleLoadMore}
          onRecipeClick={handleRecipeClick}
          observerRef={ref}
          inView={inView}
        />
      </div>

      <UnifiedRecipeModal
        isOpen={!!selectedRecipe.recipe}
        recipe={selectedRecipe.recipe}
        recipeIngredients={selectedRecipe.ingredients || []}
        aiInstructions={''}
        generatingInstructions={false} // Would need separate state if implementing AI gen logic here
        previewYield={selectedRecipe.recipe?.yield || 4}
        onClose={() => setSelectedRecipe({ recipe: null, ingredients: [] })}
        // Stubs
        onEditRecipe={() => {}}
        onShareRecipe={() => {}}
        onPrint={() => {}}
        onDuplicateRecipe={() => {}}
        onDeleteRecipe={() => {}}
        onUpdatePreviewYield={() => {}}
        onRefreshIngredients={async () => {}}
        capitalizeRecipeName={(name: string) => name}
        formatQuantity={(q: number, u: string) => ({
          value: q.toFixed(2),
          unit: u,
          original: `${q} ${u}`,
        })}
      />

      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handlePhotoSubmit}
        isProcessing={isProcessing}
      />
    </div>
  );
}
