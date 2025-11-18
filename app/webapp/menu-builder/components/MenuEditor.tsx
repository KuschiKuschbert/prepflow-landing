'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useNotification } from '@/contexts/NotificationContext';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import {
    closestCenter,
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type Modifier,
} from '@dnd-kit/core';
import { ChefHat, Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMenuDragDrop } from '../hooks/useMenuDragDrop';
import { Dish, Menu, MenuItem, MenuStatistics, Recipe } from '../types';
import CategoryManager from './CategoryManager';
import CategorySelectorModal from './CategorySelectorModal';
import DishPalette from './DishPalette';
import MenuCategory from './MenuCategory';
import { MenuItemStatisticsModal } from './MenuItemStatisticsModal';
import MenuStatisticsPanel from './MenuStatisticsPanel';

import { logger } from '@/lib/logger';
interface MenuEditorProps {
  menu: Menu;
  onBack: () => void;
  onMenuUpdated: () => void;
}

export default function MenuEditor({ menu, onBack, onMenuUpdated }: MenuEditorProps) {
  const { showError, showSuccess, showWarning } = useNotification();

  // Initialize with cached data for instant display
  const menuCacheKey = `menu_${menu.id}_data`;
  const dishesCacheKey = 'menu_builder_dishes';
  const recipesCacheKey = 'menu_builder_recipes';

  const cachedMenuData = getCachedData<{
    menuItems: MenuItem[];
    categories: string[];
    statistics: MenuStatistics | null;
  }>(menuCacheKey);
  const cachedDishes = getCachedData<Dish[]>(dishesCacheKey);
  const cachedRecipes = getCachedData<Recipe[]>(recipesCacheKey);

  const [menuItems, setMenuItems] = useState<MenuItem[]>(cachedMenuData?.menuItems || []);
  const [dishes, setDishes] = useState<Dish[]>(cachedDishes || []);
  const [recipes, setRecipes] = useState<Recipe[]>(cachedRecipes || []);
  const [categories, setCategories] = useState<string[]>(
    cachedMenuData?.categories || ['Uncategorized'],
  );
  const [statistics, setStatistics] = useState<MenuStatistics | null>(
    cachedMenuData?.statistics || null,
  );
  const [loading, setLoading] = useState(!cachedMenuData && !cachedDishes && !cachedRecipes);
  const [selectedItemForStats, setSelectedItemForStats] = useState<MenuItem | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'dish' | 'recipe';
    id: string;
    name: string;
  } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning',
  });

  const refreshStatistics = async () => {
    const statsResponse = await fetch(`/api/menus/${menu.id}/statistics`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      if (statsData.success) setStatistics(statsData.statistics);
    }
  };

  const loadMenuData = async () => {
    setLoading(true);
    try {
      const [menuResponse, dishesResponse, recipesResponse, statsResponse] = await Promise.all([
        fetch(`/api/menus/${menu.id}`),
        fetch('/api/dishes?pageSize=1000'),
        fetch('/api/recipes?pageSize=1000'),
        fetch(`/api/menus/${menu.id}/statistics`),
      ]);

      const menuData = await menuResponse.json();
      const dishesData = await dishesResponse.json();
      const recipesData = await recipesResponse.json();
      const statsData = await statsResponse.json();

      if (!menuResponse.ok) {
        logger.error('Failed to load menu:', {
          error: menuData.error || menuData.message,
          status: menuResponse.status,
          menuId: menu.id,
          fullResponse: menuData,
        });
        showError(`Failed to load menu: ${menuData.error || menuData.message || 'Unknown error'}`);
        return;
      }

      if (menuData.success) {
        const items = menuData.menu.items || [];
        setMenuItems(items);
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(items.map((item: MenuItem) => item.category || 'Uncategorized')),
        ) as string[];
        const finalCategories = uniqueCategories.length > 0 ? uniqueCategories : ['Uncategorized'];
        setCategories(finalCategories);

        // Cache menu data
        const menuDataToCache = {
          menuItems: items,
          categories: finalCategories,
          statistics: statsData.success ? statsData.statistics : null,
        };
        cacheData(menuCacheKey, menuDataToCache);
      }

      if (dishesData.success) {
        const dishesList = dishesData.dishes || [];
        setDishes(dishesList);
        cacheData(dishesCacheKey, dishesList);
      } else {
        logger.warn('Failed to load dishes:', dishesData.error || dishesData.message);
        setDishes([]);
      }

      if (recipesData.success) {
        const recipesList = recipesData.recipes || [];
        setRecipes(recipesList);
        cacheData(recipesCacheKey, recipesList);
      } else {
        logger.warn('Failed to load recipes:', recipesData.error || recipesData.message);
        setRecipes([]);
      }

      if (statsData.success) {
        setStatistics(statsData.statistics);
        // Update cached menu data with statistics
        const currentCached = getCachedData<{
          menuItems: MenuItem[];
          categories: string[];
          statistics: MenuStatistics | null;
        }>(menuCacheKey);
        if (currentCached) {
          cacheData(menuCacheKey, { ...currentCached, statistics: statsData.statistics });
        }
      } else {
        logger.warn('Failed to load statistics:', statsData.error || statsData.message);
      }
    } catch (err) {
      logger.error('Failed to load menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  const { activeId, initialOffset, initialCursorPosition, handleDragStart, handleDragEnd } =
    useMenuDragDrop({
      menuId: menu.id,
      menuItems,
      setMenuItems,
      onStatisticsUpdate: refreshStatistics,
      onMenuDataReload: loadMenuData,
      dishes,
      recipes,
      notifications: { showError, showSuccess },
    });

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
  );

  useEffect(() => {
    loadMenuData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu.id]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = async (category: string) => {
    if (categories.length === 1) {
      showWarning('Cannot remove the last category. Menus must have at least one category.');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Remove Category',
      message: `Remove category "${category}"? Items in this category will be moved to "Uncategorized".`,
      variant: 'warning',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        await performRemoveCategory(category);
      },
    });
  };

  const performRemoveCategory = async (category: string) => {
    // Store original state for rollback
    const originalMenuItems = [...menuItems];
    const originalCategories = [...categories];

    // Optimistically update UI immediately
    const itemsToMove = menuItems.filter(item => item.category === category);
    if (itemsToMove.length > 0) {
      // Optimistically move items to Uncategorized
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.category === category ? { ...item, category: 'Uncategorized' } : item,
        ),
      );
    }
    setCategories(categories.filter(c => c !== category));

    // Update statistics optimistically in background
    refreshStatistics().catch(err => {
      logger.error('Failed to refresh statistics:', err);
    });

    // Make API calls in background
    if (itemsToMove.length > 0) {
      let hasError = false;
      for (const item of itemsToMove) {
        try {
          const response = await fetch(`/api/menus/${menu.id}/items/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: 'Uncategorized',
              position: item.position,
            }),
          });

          if (!response.ok) {
            const result = await response.json();
            logger.error('Failed to move item:', result.error || result.message);
            hasError = true;
          }
        } catch (err) {
          logger.error('Failed to move item:', err);
          hasError = true;
        }
      }

      if (hasError) {
        // Revert optimistic update on error
        setMenuItems(originalMenuItems);
        setCategories(originalCategories);
        showError('Some items could not be moved. Please try again.');
        // Refresh statistics to revert optimistic change
        refreshStatistics().catch(err => {
          logger.error('Failed to refresh statistics:', err);
        });
        return;
      }
    }

    // Success - refresh statistics in background to ensure accuracy
    showSuccess(`Category "${category}" removed successfully`);
    refreshStatistics().catch(err => {
      logger.error('Failed to refresh statistics:', err);
    });
  };

  const handleRenameCategory = async (oldName: string, newName: string) => {
    // Prevent renaming to an existing category (except if it's the same)
    if (newName !== oldName && categories.includes(newName)) {
      throw new Error(`Category "${newName}" already exists`);
    }

    // Store original state for rollback
    const originalMenuItems = [...menuItems];
    const originalCategories = [...categories];

    // Get all items in the old category
    const itemsToUpdate = menuItems.filter(item => item.category === oldName);

    // Optimistically update UI immediately
    if (itemsToUpdate.length > 0) {
      setMenuItems(prevItems =>
        prevItems.map(item => (item.category === oldName ? { ...item, category: newName } : item)),
      );
    }
    setCategories(categories.map(c => (c === oldName ? newName : c)));

    // Update statistics optimistically in background
    refreshStatistics().catch(err => {
      logger.error('Failed to refresh statistics:', err);
    });

    if (itemsToUpdate.length === 0) {
      // No items to update, just return (already updated optimistically)
      return;
    }

    // Make API calls in background
    let hasError = false;
    const errors: string[] = [];

    for (const item of itemsToUpdate) {
      try {
        const response = await fetch(`/api/menus/${menu.id}/items/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: newName,
            position: item.position,
          }),
        });

        if (!response.ok) {
          const result = await response.json();
          logger.error('Failed to update item category:', result.error || result.message);
          hasError = true;
          errors.push(
            `${item.dishes?.dish_name || item.recipes?.recipe_name || 'Item'}: ${result.error || result.message}`,
          );
        }
      } catch (err) {
        logger.error('Failed to update item category:', err);
        hasError = true;
        errors.push(
          `Failed to update item: ${err instanceof Error ? err.message : 'Unknown error'}`,
        );
      }
    }

    if (hasError) {
      // Revert optimistic update on error
      setMenuItems(originalMenuItems);
      setCategories(originalCategories);
      throw new Error(`Some items could not be updated:\n${errors.join('\n')}`);
    }

    // Success - refresh statistics in background to ensure accuracy
    refreshStatistics().catch(err => {
      logger.error('Failed to refresh statistics:', err);
    });
  };

  const handleItemTap = (
    item: { type: 'dish' | 'recipe'; id: string; name: string },
    element: HTMLElement,
  ) => {
    setSelectedItem(item);
    setAnchorElement(element);
    setShowCategoryModal(true);
  };

  const handleCategorySelect = async (category: string) => {
    if (!selectedItem) return;

    // Close modal immediately
    setShowCategoryModal(false);
    const itemToAdd = selectedItem;
    setSelectedItem(null);

    // Find the dish or recipe data
    const dish = dishes.find(d => d.id === itemToAdd.id);
    const recipe = recipes.find(r => r.id === itemToAdd.id);

    if (!dish && !recipe) {
      showError('Item not found. Please try again.');
      return;
    }

    // Get the highest position in the category for the new item
    const categoryItems = menuItems.filter(item => item.category === category);
    const maxPosition =
      categoryItems.length > 0 ? Math.max(...categoryItems.map(item => item.position)) : -1;
    const newPosition = maxPosition + 1;

    // Create optimistic menu item
    const optimisticItem: MenuItem = {
      id: `temp-${Date.now()}`, // Temporary ID
      menu_id: menu.id,
      category,
      position: newPosition,
      ...(itemToAdd.type === 'dish'
        ? {
            dish_id: itemToAdd.id,
            dishes: {
              id: dish!.id,
              dish_name: dish!.dish_name,
              description: dish!.description,
              selling_price: dish!.selling_price,
            },
          }
        : {
            recipe_id: itemToAdd.id,
            recipes: {
              id: recipe!.id,
              recipe_name: recipe!.recipe_name,
              description: recipe!.description,
              yield: recipe!.yield,
            },
          }),
    };

    // Optimistically update UI immediately
    setMenuItems([...menuItems, optimisticItem]);

    // Update categories if needed
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }

    // Make API call in background
    try {
      const response = await fetch(`/api/menus/${menu.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          itemToAdd.type === 'dish'
            ? { dish_id: itemToAdd.id, category }
            : { recipe_id: itemToAdd.id, category },
        ),
      });

      const result = await response.json();

      if (response.ok && result.success && result.item) {
        // Replace optimistic item with real item from API (includes full dish/recipe data)
        setMenuItems(prevItems =>
          prevItems.map(item => (item.id === optimisticItem.id ? result.item : item)),
        );

        // Update statistics in background (non-blocking)
        refreshStatistics().catch(err => {
          logger.error('Failed to refresh statistics:', err);
        });
      } else {
        // Revert optimistic update on error
        const errorMessage =
          result.error || result.message || `Failed to add item (${response.status})`;
        logger.error('Failed to add item to menu:', {
          status: response.status,
          error: errorMessage,
          result,
          optimisticItem,
        });
        console.error('[Menu Editor] API Error:', {
          status: response.status,
          error: errorMessage,
          result,
        });
        setMenuItems(prevItems => prevItems.filter(item => item.id !== optimisticItem.id));
        showError(errorMessage);
      }
    } catch (err) {
      // Revert optimistic update on error
      logger.error('Failed to add item to menu:', err);
      console.error('[Menu Editor] Network Error:', err);
      setMenuItems(prevItems => prevItems.filter(item => item.id !== optimisticItem.id));
      showError('Failed to add item. Please check your connection and try again.');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    const itemName = item?.dishes?.dish_name || item?.recipes?.recipe_name || 'this item';

    setConfirmDialog({
      isOpen: true,
      title: 'Remove Item',
      message: `Remove "${itemName}" from this menu?`,
      variant: 'warning',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        await performRemoveItem(itemId, itemName);
      },
    });
  };

  const performRemoveItem = async (itemId: string, itemName: string) => {
    // Store the item being removed for potential revert
    const itemToRemove = menuItems.find(i => i.id === itemId);
    if (!itemToRemove) {
      showError('Item not found');
      return;
    }

    // Optimistically remove from UI immediately (instant feedback)
    setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));

    try {
      const response = await fetch(`/api/menus/${menu.id}/items/${itemId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        // Success - refresh statistics in background (non-blocking)
        showSuccess(`"${itemName}" removed from menu`);
        refreshStatistics().catch(err => {
          logger.error('Failed to refresh statistics:', err);
        });
      } else {
        // Revert optimistic update on error
        setMenuItems(prevItems => {
          // Reinsert the item at its original position
          const otherItems = prevItems.filter(item => item.id !== itemId);
          const insertIndex = otherItems.findIndex(
            item =>
              item.category === itemToRemove.category && item.position > itemToRemove.position,
          );
          if (insertIndex === -1) {
            return [...otherItems, itemToRemove];
          }
          return [
            ...otherItems.slice(0, insertIndex),
            itemToRemove,
            ...otherItems.slice(insertIndex),
          ];
        });
        showError(`Failed to remove item: ${result.error || result.message || 'Unknown error'}`);
      }
    } catch (err) {
      // Revert optimistic update on error
      setMenuItems(prevItems => {
        const otherItems = prevItems.filter(item => item.id !== itemId);
        const insertIndex = otherItems.findIndex(
          item => item.category === itemToRemove.category && item.position > itemToRemove.position,
        );
        if (insertIndex === -1) {
          return [...otherItems, itemToRemove];
        }
        return [
          ...otherItems.slice(0, insertIndex),
          itemToRemove,
          ...otherItems.slice(insertIndex),
        ];
      });
      logger.error('Failed to remove item:', err);
      showError('Failed to remove item. Please check your connection and try again.');
    }
  };

  const handleMoveUp = async (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    const categoryItems = menuItems
      .filter(i => i.category === item.category)
      .sort((a, b) => a.position - b.position);

    const currentIndex = categoryItems.findIndex(i => i.id === itemId);
    if (currentIndex <= 0) return; // Already at top

    const targetItem = categoryItems[currentIndex - 1];
    await performReorder(itemId, targetItem.id, item.category);
  };

  const handleMoveDown = async (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    const categoryItems = menuItems
      .filter(i => i.category === item.category)
      .sort((a, b) => a.position - b.position);

    const currentIndex = categoryItems.findIndex(i => i.id === itemId);
    if (currentIndex === -1 || currentIndex >= categoryItems.length - 1) return; // Already at bottom

    const targetItem = categoryItems[currentIndex + 1];
    await performReorder(itemId, targetItem.id, item.category);
  };

  const performReorder = async (activeId: string, overId: string, category: string) => {
    // Store original state for rollback
    const originalMenuItems = [...menuItems];

    const categoryItems = menuItems
      .filter(item => item.category === category)
      .sort((a, b) => a.position - b.position);

    const oldIndex = categoryItems.findIndex(item => item.id === activeId);
    const newIndex = categoryItems.findIndex(item => item.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically update UI immediately
    const reordered = [...categoryItems];
    const [movedItem] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, movedItem);

    const updatedItems = reordered.map((item, index) => ({
      ...item,
      position: index,
    }));

    const otherItems = menuItems.filter(item => item.category !== category);
    setMenuItems([...otherItems, ...updatedItems]);

    // Refresh statistics optimistically in background
    refreshStatistics().catch(err => {
      logger.error('Failed to refresh statistics:', err);
    });

    // Make API call in background
    try {
      const response = await fetch(`/api/menus/${menu.id}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedItems.map(item => ({
            id: item.id,
            category: item.category,
            position: item.position,
          })),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - refresh statistics in background to ensure accuracy
        refreshStatistics().catch(err => {
          logger.error('Failed to refresh statistics:', err);
        });
      } else {
        // Revert optimistic update on error
        setMenuItems(originalMenuItems);
        logger.error('Failed to reorder items:', result.error || result.message);
        showError(`Failed to reorder items: ${result.error || result.message || 'Unknown error'}`);
        // Refresh statistics to revert optimistic change
        refreshStatistics().catch(err => {
          logger.error('Failed to refresh statistics:', err);
        });
      }
    } catch (err) {
      // Revert optimistic update on error
      setMenuItems(originalMenuItems);
      logger.error('Failed to reorder items:', err);
      showError('Failed to reorder items. Please check your connection and try again.');
      // Refresh statistics to revert optimistic change
      refreshStatistics().catch(err => {
        logger.error('Failed to refresh statistics:', err);
      });
    }
  };

  const handleMoveToCategory = async (itemId: string, targetCategory: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) {
      showError('Item not found');
      return;
    }

    if (item.category === targetCategory) {
      return; // Already in target category
    }

    await performMoveToCategory(itemId, targetCategory, item);
  };

  const handleUpdateActualPrice = async (itemId: string, price: number | null) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    // Store original state for rollback
    const originalMenuItems = [...menuItems];

    // Optimistically update UI
    setMenuItems(prevItems =>
      prevItems.map(i =>
        i.id === itemId ? { ...i, actual_selling_price: price ?? undefined } : i,
      ),
    );

    try {
      const response = await fetch(`/api/menus/${menu.id}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actual_selling_price: price,
        }),
      });

      if (response.ok) {
        // Success - reload menu data to ensure consistency
        await loadMenuData();
        // Refresh statistics in background to ensure accuracy
        refreshStatistics().catch(err => {
          logger.error('Failed to refresh statistics:', err);
        });
      } else {
        // Error - revert optimistic update
        setMenuItems(originalMenuItems);
        const result = await response.json();
        showError(result.error || result.message || 'Failed to update price');
      }
    } catch (err) {
      // Error - revert optimistic update
      setMenuItems(originalMenuItems);
      logger.error('Failed to update price:', err);
      showError('Failed to update price. Please check your connection and try again.');
    }
  };

  const performMoveToCategory = async (itemId: string, targetCategory: string, item: MenuItem) => {
    // Store original state for rollback
    const originalMenuItems = [...menuItems];

    // Optimistically update UI immediately
    setMenuItems(prevItems =>
      prevItems.map(i =>
        i.id === itemId
          ? {
              ...i,
              category: targetCategory,
              position: prevItems.filter(item => item.category === targetCategory).length,
            }
          : i,
      ),
    );

    // Refresh statistics optimistically in background
    refreshStatistics().catch(err => {
      logger.error('Failed to refresh statistics:', err);
    });

    // Make API call in background
    try {
      const response = await fetch(`/api/menus/${menu.id}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: targetCategory,
          position: item.position,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - reload menu data to ensure consistency
        await loadMenuData();
        // Refresh statistics in background to ensure accuracy
        refreshStatistics().catch(err => {
          logger.error('Failed to refresh statistics:', err);
        });
      } else {
        // Revert optimistic update on error
        setMenuItems(originalMenuItems);
        logger.error('Failed to move item:', result.error || result.message);
        showError(`Failed to move item: ${result.error || result.message || 'Unknown error'}`);
        // Refresh statistics to revert optimistic change
        refreshStatistics().catch(err => {
          logger.error('Failed to refresh statistics:', err);
        });
      }
    } catch (err) {
      // Revert optimistic update on error
      setMenuItems(originalMenuItems);
      logger.error('Failed to move item:', err);
      showError('Failed to move item. Please check your connection and try again.');
      // Refresh statistics to revert optimistic change
      refreshStatistics().catch(err => {
        logger.error('Failed to refresh statistics:', err);
      });
    }
  };

  // Modifier to position overlay relative to cursor based on initial grab point
  const centerOnCursor: Modifier = ({ transform, draggingNodeRect }) => {
    if (!draggingNodeRect) return transform;

    // Use tracked initial offset if available
    if (initialOffset && initialCursorPosition) {
      // Verify the calculation: initialCursorPosition should equal draggingNodeRect + initialOffset
      // If not, there might be a coordinate system mismatch
      const expectedCursorX = draggingNodeRect.left + initialOffset.x;
      const expectedCursorY = draggingNodeRect.top + initialOffset.y;
      const cursorMismatch =
        Math.abs(expectedCursorX - initialCursorPosition.x) > 1 ||
        Math.abs(expectedCursorY - initialCursorPosition.y) > 1;

      if (cursorMismatch) {
        logger.dev('[Drag Debug] Coordinate mismatch detected', {
          draggingNodeRectLeft: draggingNodeRect.left,
          draggingNodeRectTop: draggingNodeRect.top,
          initialOffsetX: initialOffset.x,
          initialOffsetY: initialOffset.y,
          expectedCursorX,
          expectedCursorY,
          actualInitialCursorX: initialCursorPosition.x,
          actualInitialCursorY: initialCursorPosition.y,
        });
      }

      // The transform represents movement delta
      // dnd-kit positions overlay at: draggingNodeRect.position + transform
      // We want overlay positioned so grab point follows cursor
      // Current cursor ≈ initialCursorPosition + transform (movement delta)
      // Target overlay position = currentCursor - initialOffset
      // = (initialCursorPosition + transform) - initialOffset
      // = initialCursorPosition - initialOffset + transform
      // dnd-kit does: draggingNodeRect + transform
      // So we need: draggingNodeRect + transform = initialCursorPosition - initialOffset + transform
      // Therefore: transform = initialCursorPosition - initialOffset - draggingNodeRect + transform
      // Which simplifies to: transform = transform + (initialCursorPosition - initialOffset - draggingNodeRect)
      // But initialCursorPosition should equal draggingNodeRect + initialOffset
      // So: transform = transform + (draggingNodeRect + initialOffset - initialOffset - draggingNodeRect)
      //    = transform + 0 = transform
      //
      // dnd-kit's default behavior might center the overlay on the cursor
      // We need to adjust for the difference between where user grabbed (initialOffset)
      // and where dnd-kit assumes (center of element)
      // Adjustment needed: initialOffset - centerOffset
      const centerOffsetX = draggingNodeRect.width / 2;
      const centerOffsetY = draggingNodeRect.height / 2;
      const offsetFromCenterX = initialOffset.x - centerOffsetX;
      const offsetFromCenterY = initialOffset.y - centerOffsetY;

      // Adjust transform to account for the difference
      return {
        ...transform,
        x: transform.x - offsetFromCenterX,
        y: transform.y - offsetFromCenterY,
      };
    }

    // Fallback: center the overlay on the cursor by offsetting by half the dimensions
    return {
      ...transform,
      x: transform.x - draggingNodeRect.width / 2,
      y: transform.y - draggingNodeRect.height / 2,
    };
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        <div className="large-desktop:grid-cols-4 grid grid-cols-1 gap-6">
          {/* Left Panel - Dish Palette */}
          <div className="large-desktop:col-span-1">
            <DishPalette dishes={dishes} recipes={recipes} onItemTap={handleItemTap} />
          </div>

          {/* Right Panel - Menu Builder */}
          <div className="large-desktop:col-span-3">
            {/* Statistics */}
            {statistics && <MenuStatisticsPanel statistics={statistics} />}

            {/* Category Management */}
            <CategoryManager
              categories={categories}
              newCategory={newCategory}
              onNewCategoryChange={setNewCategory}
              onAddCategory={handleAddCategory}
              onRemoveCategory={handleRemoveCategory}
            />

            {/* Categories */}
            <div className="space-y-6">
              {categories.map(category => {
                const categoryItems = menuItems
                  .filter(item => item.category === category)
                  .sort((a, b) => a.position - b.position);

                return (
                  <MenuCategory
                    key={category}
                    category={category}
                    items={categoryItems}
                    menuId={menu.id}
                    onRemoveItem={handleRemoveItem}
                    onRenameCategory={handleRenameCategory}
                    canRename={true}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onMoveToCategory={handleMoveToCategory}
                    onUpdateActualPrice={handleUpdateActualPrice}
                    onShowStatistics={item => setSelectedItemForStats(item)}
                    availableCategories={categories}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null} modifiers={[centerOnCursor]}>
        {activeId
          ? (() => {
              // Only handle menu items for rearranging
              const menuItem = menuItems.find(item => item.id === activeId);
              if (!menuItem) return null;

              const isDish = !!menuItem.dish_id;
              const isRecipe = !!menuItem.recipe_id;

              // Match the exact structure of SortableMenuItem
              return (
                <div className="group flex cursor-grabbing items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 shadow-xl">
                  <div className="flex flex-1 items-center gap-2">
                    {isDish ? (
                      <Icon icon={Utensils} size="sm" className="text-[#29E7CD]" />
                    ) : isRecipe ? (
                      <Icon icon={ChefHat} size="sm" className="text-[#D925C7]" />
                    ) : null}
                    <div className="flex-1">
                      {isDish ? (
                        <>
                          <div className="font-medium text-white">
                            {menuItem.dishes?.dish_name || 'Unknown Dish'}
                          </div>
                          <div className="text-sm text-gray-400">
                            ${menuItem.dishes?.selling_price.toFixed(2) || '0.00'}
                          </div>
                        </>
                      ) : isRecipe ? (
                        <>
                          <div className="font-medium text-white">
                            {menuItem.recipes?.recipe_name || 'Unknown Recipe'}
                          </div>
                        </>
                      ) : (
                        <div className="font-medium text-white">Unknown Item</div>
                      )}
                    </div>
                  </div>
                  {/* Spacer for delete button to match exact dimensions */}
                  <div className="w-10" />
                </div>
              );
            })()
          : null}
      </DragOverlay>

      {/* Category Selector Modal */}
      <CategorySelectorModal
        isOpen={showCategoryModal}
        categories={categories}
        itemName={selectedItem?.name || ''}
        anchorElement={anchorElement}
        onSelectCategory={handleCategorySelect}
        onClose={() => {
          setShowCategoryModal(false);
          setSelectedItem(null);
          setAnchorElement(null);
        }}
      />

      {/* Item Statistics Modal */}
      <MenuItemStatisticsModal
        isOpen={selectedItemForStats !== null}
        item={selectedItemForStats}
        menuId={menu.id}
        onClose={() => setSelectedItemForStats(null)}
        onUpdatePrice={handleUpdateActualPrice}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        variant={confirmDialog.variant}
      />
    </DndContext>
  );
}
