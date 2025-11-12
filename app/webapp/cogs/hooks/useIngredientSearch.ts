'use client';

import { useState, useMemo, useCallback } from 'react';
import { Ingredient, RecipeIngredient } from '../types';
import { handleKeyboardNavigation } from './utils/keyboardNavigation';
import { filterIngredients } from './utils/ingredientFiltering';

export const useIngredientSearch = (ingredients: Ingredient[]) => {
  const [ingredientSearch, setIngredientSearch] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [newIngredient, setNewIngredient] = useState<Partial<RecipeIngredient>>({
    ingredient_id: '',
    quantity: 0,
    unit: 'kg',
  });

  const filteredIngredients = useMemo(
    () => filterIngredients(ingredients, ingredientSearch),
    [ingredients, ingredientSearch],
  );

  const handleIngredientSelect = useCallback((ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setNewIngredient(prev => ({
      ...prev,
      ingredient_id: ingredient.id,
      unit: ingredient.unit || 'kg',
    }));
    setIngredientSearch(ingredient.ingredient_name.toLowerCase());
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setIngredientSearch(value);
      // Always show suggestions when there are ingredients available
      // This ensures users can see the list even when search is empty
      setShowSuggestions(ingredients.length > 0);
      setHighlightedIndex(-1); // Reset highlight when search changes
      if (value.length === 0) {
        setSelectedIngredient(null);
        setNewIngredient(prev => ({
          ...prev,
          ingredient_id: '',
        }));
      }
    },
    [ingredients.length],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, filteredIngredients: Ingredient[]) => {
      handleKeyboardNavigation(
        e,
        filteredIngredients,
        highlightedIndex,
        showSuggestions,
        selectedIngredient,
        setHighlightedIndex,
        setShowSuggestions,
        handleIngredientSelect,
      );
    },
    [showSuggestions, selectedIngredient, highlightedIndex, handleIngredientSelect],
  );

  const resetForm = useCallback(() => {
    setNewIngredient({
      ingredient_id: '',
      quantity: 0,
      unit: 'kg',
    });
    setIngredientSearch('');
    setSelectedIngredient(null);
    setShowSuggestions(false);
  }, []);

  return {
    ingredientSearch,
    showSuggestions,
    selectedIngredient,
    newIngredient,
    filteredIngredients,
    highlightedIndex,
    setIngredientSearch,
    setShowSuggestions,
    setNewIngredient,
    handleIngredientSelect,
    handleSearchChange,
    handleKeyDown,
    resetForm,
  };
};
