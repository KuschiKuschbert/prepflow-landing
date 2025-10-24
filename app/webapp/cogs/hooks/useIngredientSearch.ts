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
    console.log('Filtering ingredients:', ingredients.length, 'total, search:', ingredientSearch);

    if (!ingredientSearch.trim()) {
      const result = ingredients.slice(0, 50); // Show first 50 ingredients when no search
      console.log('No search term, returning first 50:', result.length);
      return result;
    }

    const searchTerm = ingredientSearch.toLowerCase().trim();
    const filtered = ingredients
      .filter(
        ingredient =>
          ingredient.ingredient_name.toLowerCase().includes(searchTerm) ||
          (ingredient.unit && ingredient.unit.toLowerCase().includes(searchTerm)),
      )
      .sort((a, b) => {
        // Prioritize exact matches and starts-with matches
        const aName = a.ingredient_name.toLowerCase();
        const bName = b.ingredient_name.toLowerCase();

        if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
        if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm)) return 1;
        if (aName === searchTerm && bName !== searchTerm) return -1;
        if (aName !== searchTerm && bName === searchTerm) return 1;

        return aName.localeCompare(bName);
      })
      .slice(0, 20); // Limit to 20 results for performance

    console.log('Search results:', filtered.length, 'matches for', searchTerm);
    return filtered;
  }, [ingredients, ingredientSearch]);

  const handleIngredientSelect = useCallback(
    (ingredient: Ingredient) => {
      console.log('Ingredient selected:', ingredient.ingredient_name);
      setSelectedIngredient(ingredient);
      setNewIngredient({
        ...newIngredient,
        ingredient_id: ingredient.id,
        unit: ingredient.unit || 'kg',
      });
      setIngredientSearch(ingredient.ingredient_name);
      setShowSuggestions(false);
    },
    [newIngredient],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setIngredientSearch(value);
      setShowSuggestions(value.length > 0);
      setSelectedIngredient(null);
      setNewIngredient({
        ...newIngredient,
        ingredient_id: '',
      });
    },
    [newIngredient],
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
