'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type {
  DishOption,
  MenuOption,
  RecipeOption,
  RunsheetItemWithRelations,
} from '../components/runsheet-types';
import { buildOptimisticRunsheetUpdate } from './runsheet-mutations-helpers';

interface UseRunsheetMutationsParams {
  functionId: string;
  items: RunsheetItemWithRelations[];
  setItems: React.Dispatch<React.SetStateAction<RunsheetItemWithRelations[]>>;
  menus: MenuOption[];
  dishes: DishOption[];
  recipes: RecipeOption[];
  dayItemsLength: number;
}
export function useRunsheetMutations({
  functionId,
  items,
  setItems,
  menus,
  dishes,
  recipes,
  dayItemsLength,
}: UseRunsheetMutationsParams) {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const handleAddItem = useCallback(
    async (data: {
      day_number: number;
      item_time: string | null;
      description: string;
      item_type: 'meal' | 'activity' | 'setup' | 'other';
      menu_id: string | null;
      dish_id: string | null;
      recipe_id: string | null;
    }) => {
      const res = await fetch(`/api/functions/${functionId}/runsheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, position: dayItemsLength }),
      });
      if (res.ok) {
        const newItem = await res.json();
        setItems(prev => [...prev, newItem]);
        showSuccess('Item added');
      } else {
        showError('Failed to add item');
      }
    },
    [functionId, dayItemsLength, setItems, showSuccess, showError],
  );
  const handleDeleteItem = useCallback(
    async (itemId: string) => {
      const original = [...items];
      setItems(prev => prev.filter(i => i.id !== itemId));
      const res = await fetch(`/api/functions/${functionId}/runsheet/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showSuccess('Item removed');
      } else {
        setItems(original);
        showError('Failed to remove item');
      }
    },
    [functionId, items, setItems, showSuccess, showError],
  );

  const handleUpdateItem = useCallback(
    async (
      itemId: string,
      data: {
        item_time?: string | null;
        description?: string;
        item_type?: 'meal' | 'activity' | 'setup' | 'other';
        menu_id?: string | null;
        dish_id?: string | null;
        recipe_id?: string | null;
      },
    ) => {
      const original = [...items];
      const optimistic = buildOptimisticRunsheetUpdate(data, menus, dishes, recipes);
      setItems(prev => prev.map(i => (i.id === itemId ? { ...i, ...optimistic } : i)));

      const res = await fetch(`/api/functions/${functionId}/runsheet/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setItems(prev => prev.map(i => (i.id === itemId ? { ...i, ...updated } : i)));
        showSuccess('Item updated');
      } else {
        setItems(original);
        showError('Failed to update item');
      }
    },
    [functionId, items, menus, dishes, recipes, setItems, showSuccess, showError],
  );

  const handleMenuClick = useCallback(
    (menuId: string) => {
      router.push(`/webapp/recipes#menu-builder&menu=${menuId}`);
    },
    [router],
  );
  return { handleAddItem, handleDeleteItem, handleUpdateItem, handleMenuClick };
}
