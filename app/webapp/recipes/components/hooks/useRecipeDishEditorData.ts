import { useState, useEffect } from 'react';
import { Recipe, Dish } from '../../types';
import { logger } from '@/lib/logger';

export interface RecipeDishItem {
  id: string;
  name: string;
  type: 'recipe' | 'dish';
  ingredientCount?: number;
}

export function useRecipeDishEditorData(
  initialItem: Recipe | Dish | null | undefined,
  initialItemType: 'recipe' | 'dish' | undefined,
) {
  const hasInitialItem = Boolean(initialItem && initialItem.id && initialItem.id !== '');
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [selectedItem, setSelectedItem] = useState<RecipeDishItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      hasInitialItem &&
      initialItem &&
      initialItem.id &&
      initialItem.id !== '' &&
      !selectedItem &&
      initialItemType
    ) {
      const itemName =
        initialItemType === 'recipe'
          ? (initialItem as Recipe).recipe_name
          : (initialItem as Dish).dish_name;
      if (itemName) {
        const initialItemData: RecipeDishItem = {
          id: initialItem.id,
          name: itemName,
          type: initialItemType as 'recipe' | 'dish',
        };
        setSelectedItem(initialItemData);
      }
    }
  }, [hasInitialItem, initialItem, initialItemType, selectedItem]);

  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const [dishesResponse, recipesResponse] = await Promise.all([
          fetch('/api/dishes', { cache: 'no-store' }),
          fetch('/api/recipes', { cache: 'no-store' }),
        ]);
        const dishesResult = await dishesResponse.json();
        const recipesResult = await recipesResponse.json();
        if (dishesResponse.ok && dishesResult.dishes) setAllDishes(dishesResult.dishes);
        if (recipesResponse.ok && recipesResult.recipes) setAllRecipes(recipesResult.recipes);
      } catch (err) {
        logger.error('Failed to fetch items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllItems();
  }, []);

  const allItems: RecipeDishItem[] = [
    ...allRecipes.map(r => ({ id: r.id, name: r.recipe_name, type: 'recipe' as const })),
    ...allDishes.map(d => ({ id: d.id, name: d.dish_name, type: 'dish' as const })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  return { allRecipes, allDishes, selectedItem, setSelectedItem, loading, allItems };
}
