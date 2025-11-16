import { useState } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { MenuItem } from '../types';
import { addDishToMenu, addRecipeToMenu, reorderMenuItems } from '../utils/menuDragDropHelpers';

interface UseMenuDragDropProps {
  menuId: string;
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  onStatisticsUpdate: () => void;
  onMenuDataReload: () => Promise<void>;
}

export function useMenuDragDrop({
  menuId,
  menuItems,
  setMenuItems,
  onStatisticsUpdate,
  onMenuDataReload,
}: UseMenuDragDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle adding dish from palette
    if (active.data.current?.type === 'dish' && over.data.current?.type === 'category') {
      const dishId = active.id as string;
      const category = over.data.current.category as string;
      await addDishToMenu(menuId, dishId, category, onMenuDataReload, onStatisticsUpdate);
      return;
    }

    // Handle adding recipe from palette
    if (active.data.current?.type === 'recipe' && over.data.current?.type === 'category') {
      const recipeId = active.id as string;
      const category = over.data.current.category as string;
      await addRecipeToMenu(menuId, recipeId, category, onMenuDataReload, onStatisticsUpdate);
      return;
    }

    // Handle reordering within category
    if (active.data.current?.type === 'menu-item' && over.data.current?.type === 'menu-item') {
      const activeItem = menuItems.find(item => item.id === active.id);
      const overItem = menuItems.find(item => item.id === over.id);

      if (!activeItem || !overItem || activeItem.category !== overItem.category) return;

      await reorderMenuItems(
        menuId,
        menuItems,
        activeItem,
        active.id as string,
        over.id as string,
        setMenuItems,
        onStatisticsUpdate,
        onMenuDataReload,
      );
    }
  };

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
  };
}
