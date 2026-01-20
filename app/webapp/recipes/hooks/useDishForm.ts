'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';
import type { Ingredient } from '../../cogs/types';
import type { APIResponse, SelectedIngredient, SelectedRecipe } from '../components/DishEditDrawerTypes';
import type { Dish, DishWithDetails, Recipe } from '../types';

interface UseDishFormProps {
  dish: Dish | null;
  isOpen: boolean;
  onSave: () => void;
  onClose: () => void;
}

export function useDishForm({ dish, isOpen, onSave, onClose }: UseDishFormProps) {
  const { showWarning, showError, showSuccess } = useNotification();
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [priceOverride, setPriceOverride] = useState(false);

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

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const fetchResources = async () => {
      try {
        const [recipesRes, ingredientsRes] = await Promise.all([
          fetch('/api/recipes'),
          fetch('/api/ingredients?pageSize=1000'),
        ]);

        const recipesData = (await recipesRes.json()) as APIResponse<Recipe[]>;
        const ingredientsData = (await ingredientsRes.json()) as APIResponse<{
          items: Ingredient[];
        }>;

        if (recipesData.success) setRecipes(recipesData.recipes || []);
        if (ingredientsData.success) setIngredients(ingredientsData.data?.items || []);
      } catch (err) {
        logger.error('Failed to fetch recipes/ingredients:', err);
        showError('Failed to load recipes and ingredients');
      }
    };

    fetchResources();

    if (dish) {
      setDishName(dish.dish_name);
      setDescription(dish.description || '');
      setSellingPrice(dish.selling_price.toString());
      fetch(`/api/dishes/${dish.id}`)
        .then(r => {
          if (!r.ok) {
            throw new Error(`Failed to fetch dish: ${r.status} ${r.statusText}`);
          }
          return r.json();
        })
        .then((data: { success: boolean; dish?: DishWithDetails }) => {
          logger.dev('Dish data loaded:', data);
          if (data.success && data.dish) {
            const recipes = (data.dish.recipes || []).map(
              (r: {
                recipe_id: string;
                quantity: number;
                recipes?: { recipe_name: string };
              }) => ({
                recipe_id: r.recipe_id,
                quantity: r.quantity || 1,
                recipe_name: r.recipes?.recipe_name,
              }),
            );
            const ingredients = (data.dish.ingredients || []).map(
              (i: {
                ingredient_id: string;
                quantity: number;
                unit?: string;
                ingredients?: { ingredient_name: string };
              }) => ({
                ingredient_id: i.ingredient_id,
                quantity: i.quantity || 0,
                unit: i.unit || 'kg',
                ingredient_name: i.ingredients?.ingredient_name,
              }),
            );
            setSelectedRecipes(recipes);
            setSelectedIngredients(ingredients);
            setLoading(false);
          } else {
            logger.error('Invalid dish data structure:', data);
            showError('Failed to load dish data: Invalid response structure');
            setLoading(false);
          }
        })
        .catch(err => {
          logger.error('Failed to fetch dish details:', err);
          showError('Failed to load dish details. Give it another go, chef.');
          setLoading(false);
        });
    } else {
      setDishName('');
      setDescription('');
      setSellingPrice('');
      setSelectedRecipes([]);
      setSelectedIngredients([]);
      setPriceOverride(false);
      setLoading(false);
    }
  }, [dish, isOpen, showError]);

  useEffect(() => {
    if (!isOpen) {
      setDishName('');
      setDescription('');
      setSellingPrice('');
      setSelectedRecipes([]);
      setSelectedIngredients([]);
      setPriceOverride(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!dishName || !sellingPrice) {
      showWarning('Dish name and selling price are required');
      return;
    }

    if (selectedRecipes.length === 0 && selectedIngredients.length === 0) {
      showWarning('Dish must contain at least one recipe or ingredient');
      return;
    }

    try {
      const url = dish ? `/api/dishes/${dish.id}` : '/api/dishes';
      const method = dish ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dish_name: dishName,
          description: description || null,
          selling_price: parseFloat(sellingPrice),
          recipes: selectedRecipes,
          ingredients: selectedIngredients,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showError(result.message || result.error || 'Failed to save dish');
        return;
      }

      showSuccess(dish ? 'Dish updated successfully!' : 'Dish created successfully!');
      onSave();
      onClose();
    } catch (err) {
      logger.error('Failed to save dish:', err);
      showError('Failed to save dish');
    }
  };

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
