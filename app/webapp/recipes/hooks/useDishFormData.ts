import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Dispatch, SetStateAction, useEffect } from 'react';
import type { Ingredient } from '../../cogs/types';
import type { APIResponse, SelectedIngredient, SelectedRecipe } from '../components/DishEditDrawerTypes';
import type { Dish, DishWithDetails, Recipe } from '../types';

interface UseDishFormDataProps {
  dish: Dish | null;
  isOpen: boolean;
  setDishName: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setSellingPrice: Dispatch<SetStateAction<string>>;
  setRecipes: Dispatch<SetStateAction<Recipe[]>>;
  setIngredients: Dispatch<SetStateAction<Ingredient[]>>;
  setSelectedRecipes: Dispatch<SetStateAction<SelectedRecipe[]>>;
  setSelectedIngredients: Dispatch<SetStateAction<SelectedIngredient[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setPriceOverride: Dispatch<SetStateAction<boolean>>;
}

export function useDishFormData({
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
}: UseDishFormDataProps) {
  const { showError } = useNotification();

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
  }, [
    dish,
    isOpen,
    showError,
    setDishName,
    setDescription,
    setSellingPrice,
    setRecipes,
    setIngredients,
    setSelectedRecipes,
    setSelectedIngredients,
    setLoading,
    setPriceOverride,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setDishName('');
      setDescription('');
      setSellingPrice('');
      setSelectedRecipes([]);
      setSelectedIngredients([]);
      setPriceOverride(false);
    }
  }, [
    isOpen,
    setDishName,
    setDescription,
    setSellingPrice,
    setSelectedRecipes,
    setSelectedIngredients,
    setPriceOverride,
  ]);
}
