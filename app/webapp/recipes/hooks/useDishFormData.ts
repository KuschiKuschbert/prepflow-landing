import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { Ingredient } from '@/lib/types/recipes';
import type { Dish, DishWithDetails, Recipe } from '@/lib/types/recipes';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import type { SelectedIngredient, SelectedRecipe } from '../components/DishEditDrawerTypes';
import {
  extractDishFormFromResponse,
  fetchDishWithDetails,
  fetchResourcesForDishForm,
} from './useDishFormData/helpers';

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
    if (!isOpen) {
      setDishName('');
      setDescription('');
      setSellingPrice('');
      setSelectedRecipes([]);
      setSelectedIngredients([]);
      setPriceOverride(false);
      return;
    }
    setLoading(true);
    const run = async () => {
      try {
        const { recipes, ingredients } = await fetchResourcesForDishForm();
        setRecipes(recipes);
        setIngredients(ingredients);

        if (dish) {
          setDishName(dish.dish_name);
          setDescription(dish.description || '');
          setSellingPrice(dish.selling_price.toString());

          const data = await fetchDishWithDetails(dish.id);
          const extracted = extractDishFormFromResponse(data);
          if (extracted) {
            setSelectedRecipes(extracted.recipes);
            setSelectedIngredients(extracted.ingredients);
          } else {
            logger.error('Invalid dish data structure:', data);
            showError('Failed to load dish data: Invalid response structure');
          }
        } else {
          setDishName('');
          setDescription('');
          setSellingPrice('');
          setSelectedRecipes([]);
          setSelectedIngredients([]);
          setPriceOverride(false);
        }
      } catch (err) {
        logger.error('Failed to fetch dish/resources:', err);
        showError(
          dish
            ? 'Failed to load dish details. Give it another go, chef.'
            : 'Failed to load recipes and ingredients',
        );
      } finally {
        setLoading(false);
      }
    };

    run();
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
}
