'use client';

import { useState, useMemo, useCallback } from 'react';
import { Ingredient, RecipeIngredient } from '../types';

export const useIngredientSearch = (ingredients: Ingredient[]) => {
  const [ingredientSearch, setIngredientSearch] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [newIngredient, setNewIngredient] = useState<Partial<RecipeIngredient>>({
    ingredient_id: '',
    quantity: 0,
    unit: 'kg',
  });

  // Live search with Material Design 3 guidelines - instant filtering
  const filteredIngredients = useMemo(() => {
    if (!ingredientSearch.trim()) {
      return ingredients.slice(0, 50); // Show first 50 ingredients when no search
    }
    const searchTerm = ingredientSearch.toLowerCase().trim();
    const filtered = ingredients
      .filter(
        ingredient =>
          ingredient.ingredient_name.toLowerCase().includes(searchTerm) ||
          (ingredient.unit && ingredient.unit.toLowerCase().includes(searchTerm)),
      )
      .sort((a, b) => {
        const aName = a.ingredient_name.toLowerCase();
        const bName = b.ingredient_name.toLowerCase();
        if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
        if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm)) return 1;
        if (aName === searchTerm && bName !== searchTerm) return -1;
        if (aName !== searchTerm && bName === searchTerm) return 1;
        return aName.localeCompare(bName);
      })
      .slice(0, 20);
    return filtered;
  }, [ingredients, ingredientSearch]);

  const handleIngredientSelect = useCallback((ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setNewIngredient(prev => ({
      ...prev,
      ingredient_id: ingredient.id,
      unit: ingredient.unit || 'kg',
    }));
    setIngredientSearch(ingredient.ingredient_name.toLowerCase());
    setShowSuggestions(false);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setIngredientSearch(value);
      // Always show suggestions when there are ingredients available
      // This ensures users can see the list even when search is empty
      setShowSuggestions(ingredients.length > 0);
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
    setIngredientSearch,
    setShowSuggestions,
    setNewIngredient,
    handleIngredientSelect,
    handleSearchChange,
    resetForm,
  };
};
