/**
 * Hook for adding menu items to categories.
 */
import { useCallback } from 'react';
import { logger } from '@/lib/logger';
import type { MenuItem, Dish, Recipe } from '../../../types';

interface UseMenuItemAdditionProps {
  menuId: string;
  menuItems: MenuItem[];
  dishes: Dish[];
  recipes: Recipe[];
  categories: string[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
}

/**
 * Hook for adding menu items to categories.
 */
export function useMenuItemAddition({
  menuId,
  menuItems,
  dishes,
  recipes,
  categories,
  setMenuItems,
  setCategories,
  refreshStatistics,
  showError,
}: UseMenuItemAdditionProps) {
  const handleCategorySelect = useCallback(
    async (
      category: string,
      selectedItem: { type: 'dish' | 'recipe'; id: string; name: string } | null,
    ) => {
      if (!selectedItem) return;
      const dish = dishes.find(d => d.id === selectedItem.id);
      const recipe = recipes.find(r => r.id === selectedItem.id);
      if (!dish && !recipe) {
        showError('Item not found. Please try again.');
        return;
      }
      const categoryItems = menuItems.filter(item => item.category === category);
      const maxPosition =
        categoryItems.length > 0 ? Math.max(...categoryItems.map(item => item.position)) : -1;
      const optimisticItem: MenuItem = {
        id: `temp-${Date.now()}`,
        menu_id: menuId,
        category,
        position: maxPosition + 1,
        ...(selectedItem.type === 'dish'
          ? {
              dish_id: selectedItem.id,
              dishes: {
                id: dish!.id,
                dish_name: dish!.dish_name,
                description: dish!.description,
                selling_price: dish!.selling_price,
              },
            }
          : {
              recipe_id: selectedItem.id,
              recipes: {
                id: recipe!.id,
                recipe_name: recipe!.recipe_name,
                description: recipe!.description,
                yield: recipe!.yield,
              },
            }),
      };
      // Optimistic update: add item immediately to UI
      setMenuItems(prevItems => {
        const newItems = [...prevItems, optimisticItem];
        logger.dev('[useMenuItemAddition] Optimistic update - adding item', {
          optimisticItemId: optimisticItem.id,
          category,
          prevItemsCount: prevItems.length,
          newItemsCount: newItems.length,
        });
        return newItems;
      });
      if (!categories.includes(category)) setCategories([...categories, category]);
      try {
        const response = await fetch(`/api/menus/${menuId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            selectedItem.type === 'dish'
              ? { dish_id: selectedItem.id, category }
              : { recipe_id: selectedItem.id, category },
          ),
        });

        const result = await response.json();

        if (response.ok && result.success && result.item) {
          // Normalize server item to ensure it has all required fields and nested objects
          const normalizeServerItem = (serverItem: any): MenuItem => {
            // Handle Supabase nested select - it might return arrays or single objects
            const getDishData = () => {
              if (!serverItem.dish_id) return null;

              // Try to get dish from local array first (most reliable)
              const dish = dishes.find(d => d.id === serverItem.dish_id);
              if (dish) {
                return {
                  id: dish.id,
                  dish_name: dish.dish_name,
                  description: dish.description,
                  selling_price: dish.selling_price,
                };
              }

              // Fallback to server data (handle both array and object formats)
              if (serverItem.dishes) {
                const dishData = Array.isArray(serverItem.dishes)
                  ? serverItem.dishes[0]
                  : serverItem.dishes;
                if (dishData) {
                  return {
                    id: dishData.id,
                    dish_name: dishData.dish_name,
                    description: dishData.description,
                    selling_price: dishData.selling_price,
                  };
                }
              }

              return null;
            };

            const getRecipeData = () => {
              if (!serverItem.recipe_id) return null;

              // Try to get recipe from local array first (most reliable)
              const recipe = recipes.find(r => r.id === serverItem.recipe_id);
              if (recipe) {
                return {
                  id: recipe.id,
                  recipe_name: recipe.recipe_name,
                  description: recipe.description,
                  yield: recipe.yield,
                  selling_price: recipe.selling_price,
                };
              }

              // Fallback to server data (handle both array and object formats)
              if (serverItem.recipes) {
                const recipeData = Array.isArray(serverItem.recipes)
                  ? serverItem.recipes[0]
                  : serverItem.recipes;
                if (recipeData) {
                  return {
                    id: recipeData.id,
                    recipe_name: recipeData.recipe_name,
                    description: recipeData.description,
                    yield: recipeData.yield,
                    selling_price: recipeData.selling_price,
                  };
                }
              }

              return null;
            };

            const normalized: MenuItem = {
              id: serverItem.id,
              menu_id: menuId,
              category: serverItem.category ?? optimisticItem.category,
              position: serverItem.position ?? optimisticItem.position,
              dish_id: serverItem.dish_id,
              recipe_id: serverItem.recipe_id,
              actual_selling_price: serverItem.actual_selling_price,
              recommended_selling_price: serverItem.recommended_selling_price,
            };

            const dishData = getDishData();
            if (dishData) {
              normalized.dishes = dishData;
            }

            const recipeData = getRecipeData();
            if (recipeData) {
              normalized.recipes = recipeData;
            }

            logger.dev('[useMenuItemAddition] Normalized server item', {
              serverItemId: normalized.id,
              hasDishes: !!normalized.dishes,
              hasRecipes: !!normalized.recipes,
              dishId: normalized.dish_id,
              recipeId: normalized.recipe_id,
              normalizedStructure: {
                id: normalized.id,
                menu_id: normalized.menu_id,
                category: normalized.category,
                position: normalized.position,
                dishes: normalized.dishes,
                recipes: normalized.recipes,
              },
            });

            return normalized;
          };

          const serverItem = normalizeServerItem(result.item);

          // Replace optimistic item with real item from server
          setMenuItems(prevItems => {
            // Find the index of the optimistic item
            const optimisticIndex = prevItems.findIndex(item => item.id === optimisticItem.id);
            if (optimisticIndex === -1) {
              // Optimistic item not found, check if server item already exists
              const serverItemIndex = prevItems.findIndex(item => item.id === serverItem.id);
              if (serverItemIndex === -1) {
                // Neither found, add the server item
                logger.warn('[useMenuItemAddition] Optimistic item not found, adding server item', {
                  optimisticItemId: optimisticItem.id,
                  serverItemId: serverItem.id,
                  prevItemsIds: prevItems.map(i => i.id),
                  serverItemStructure: {
                    id: serverItem.id,
                    menu_id: serverItem.menu_id,
                    category: serverItem.category,
                    position: serverItem.position,
                    dish_id: serverItem.dish_id,
                    recipe_id: serverItem.recipe_id,
                    hasDishes: !!serverItem.dishes,
                    hasRecipes: !!serverItem.recipes,
                    dishesKeys: serverItem.dishes ? Object.keys(serverItem.dishes) : [],
                    recipesKeys: serverItem.recipes ? Object.keys(serverItem.recipes) : [],
                  },
                });
                // Create new array to ensure React detects change
                return [...prevItems, serverItem];
              } else {
                // Server item already exists, update it in place
                logger.dev('[useMenuItemAddition] Server item already exists, updating in place', {
                  serverItemId: serverItem.id,
                  serverItemIndex,
                });
                const updatedItems = [...prevItems];
                updatedItems[serverItemIndex] = serverItem;
                return updatedItems;
              }
            }
            // Replace optimistic item with server item
            // Create a completely new array with new object references to ensure React detects the change
            const updatedItems = [
              ...prevItems.slice(0, optimisticIndex).map(item => ({ ...item })), // Create new object references
              serverItem, // New server item
              ...prevItems.slice(optimisticIndex + 1).map(item => ({ ...item })), // Create new object references
            ];
            logger.dev('[useMenuItemAddition] Replacing optimistic item with server item', {
              optimisticItemId: optimisticItem.id,
              serverItemId: serverItem.id,
              optimisticIndex,
              prevItemsCount: prevItems.length,
              updatedItemsCount: updatedItems.length,
              hasOptimisticItem: optimisticIndex !== -1,
              serverItemStructure: {
                id: serverItem.id,
                menu_id: serverItem.menu_id,
                category: serverItem.category,
                position: serverItem.position,
                dish_id: serverItem.dish_id,
                recipe_id: serverItem.recipe_id,
                hasDishes: !!serverItem.dishes,
                hasRecipes: !!serverItem.recipes,
                dishesKeys: serverItem.dishes ? Object.keys(serverItem.dishes) : [],
                recipesKeys: serverItem.recipes ? Object.keys(serverItem.recipes) : [],
                dishesStructure: serverItem.dishes,
                recipesStructure: serverItem.recipes,
              },
              prevItemsIds: prevItems.map(i => i.id),
              updatedItemsIds: updatedItems.map(i => i.id),
              arrayReferenceChanged: prevItems !== updatedItems,
            });
            return updatedItems;
          });
          refreshStatistics().catch(err => logger.error('Failed to refresh statistics:', err));
        } else {
          const errorMessage =
            result.error || result.message || `Failed to add item (${response.status})`;
          logger.error('[Menu Editor] API Error:', {
            status: response.status,
            error: errorMessage,
            result,
          });
          setMenuItems(prevItems => prevItems.filter(item => item.id !== optimisticItem.id));
          showError(errorMessage);
        }
      } catch (err) {
        logger.error('[Menu Editor] Network Error:', err);
        setMenuItems(prevItems => prevItems.filter(item => item.id !== optimisticItem.id));
        showError('Failed to add item. Please check your connection and try again.');
      }
    },
    [
      menuId,
      menuItems,
      dishes,
      recipes,
      categories,
      setMenuItems,
      setCategories,
      refreshStatistics,
      showError,
    ],
  );

  return { handleCategorySelect };
}
