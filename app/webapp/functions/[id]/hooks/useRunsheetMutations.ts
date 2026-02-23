'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type {
  DishOption,
  MenuOption,
  RecipeOption,
  RunsheetItemWithRelations,
} from '../components/RunsheetPanel';

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
      }
    },
    [functionId, dayItemsLength, setItems],
  );
  const handleDeleteItem = useCallback(
    async (itemId: string) => {
      const original = [...items];
      setItems(prev => prev.filter(i => i.id !== itemId));
      const res = await fetch(`/api/functions/${functionId}/runsheet/${itemId}`, {
        method: 'DELETE',
      });
      if (!res.ok) setItems(original);
    },
    [functionId, items, setItems],
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
      const optimistic: Partial<RunsheetItemWithRelations> = { ...data };
      if (data.menu_id && menus.length > 0) {
        const m = menus.find(x => x.id === data.menu_id);
        optimistic.menus = m ? { id: m.id, menu_name: m.menu_name, menu_type: m.menu_type } : null;
      } else if (data.menu_id === null) optimistic.menus = null;
      if (data.dish_id && dishes.length > 0) {
        const d = dishes.find(x => x.id === data.dish_id);
        optimistic.dishes = d
          ? { id: d.id, dish_name: d.dish_name, selling_price: d.selling_price }
          : null;
      } else if (data.dish_id === null) optimistic.dishes = null;
      if (data.recipe_id && recipes.length > 0) {
        const r = recipes.find(x => x.id === data.recipe_id);
        optimistic.recipes = r ? { id: r.id, recipe_name: r.recipe_name } : null;
      } else if (data.recipe_id === null) optimistic.recipes = null;

      setItems(prev => prev.map(i => (i.id === itemId ? { ...i, ...optimistic } : i)));

      const res = await fetch(`/api/functions/${functionId}/runsheet/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setItems(prev => prev.map(i => (i.id === itemId ? { ...i, ...updated } : i)));
      } else {
        setItems(original);
      }
    },
    [functionId, items, menus, dishes, recipes, setItems],
  );

  const handleMenuClick = useCallback(
    (menuId: string) => {
      router.push(`/webapp/recipes#menu-builder&menu=${menuId}`);
    },
    [router],
  );
  return { handleAddItem, handleDeleteItem, handleUpdateItem, handleMenuClick };
}
