'use client';

import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { useState } from 'react';
import type { Ingredient } from '../../cogs/types';
import type { SelectedIngredient, SelectedRecipe } from '../components/DishEditDrawerTypes';
import type { Dish, Recipe } from '../types';
import { useDishFormData } from './useDishFormData';
import { useDishFormSubmit } from './useDishFormSubmit';

interface UseDishFormProps {
  dish: Dish | null;
  isOpen: boolean;
  onSave: () => void;
  onClose: () => void;
}

export function useDishForm({ dish, isOpen, onSave, onClose }: UseDishFormProps) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [priceOverride, setPriceOverride] = useState(false);

  // Load data
  useDishFormData({
    dish,
    isOpen,
    setDishName,
    setDescription,
    setSellingPrice,
    setRecipes,
    setIngredients,
    setSelectedRecipes,
    setSelectedIngredients,
    setLoading,
    setPriceOverride,
  });

  // Handle submission
  const { handleSave } = useDishFormSubmit({
    dish,
    dishName,
    description,
    sellingPrice,
    selectedRecipes,
    selectedIngredients,
    onSave,
    onClose,
  });

  // Autosave integration
  const entityId = deriveAutosaveId('dishes', dish?.id, [dishName]);
  const canAutosave = Boolean(dishName && isOpen);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'menu_dishes',
    entityId: entityId,
    data: {
      id: dish?.id,
      dish_name: dishName,
      description: description || null,
      selling_price: sellingPrice ? parseFloat(sellingPrice) : 0,
      recipes: selectedRecipes,
      ingredients: selectedIngredients,
    },
    enabled: canAutosave,
  });

  return {
    dishName,
    setDishName,
    description,
    setDescription,
    sellingPrice,
    setSellingPrice,
    recipes,
    ingredients,
    selectedRecipes,
    setSelectedRecipes,
    selectedIngredients,
    setSelectedIngredients,
    loading,
    priceOverride,
    setPriceOverride,
    status,
    autosaveError,
    saveNow,
    handleSave,
  };
}
