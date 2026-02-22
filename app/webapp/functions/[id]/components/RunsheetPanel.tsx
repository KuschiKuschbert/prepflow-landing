'use client';

import type { AppFunction, RunsheetItem } from '@/app/api/functions/helpers/schemas';
import { Card } from '@/components/ui/Card';
import { logger } from '@/lib/logger';
import { Icon } from '@/components/ui/Icon';
import { ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DayTabBar } from './DayTabBar';
import { ExportDayButton } from './ExportDayButton';
import { FunctionAllergenSummary } from './FunctionAllergenSummary';
import { RunsheetAddForm } from './RunsheetAddForm';
import { RunsheetItemRow } from './RunsheetItemRow';

export type RunsheetItemWithRelations = RunsheetItem & {
  menus?: { id: string; menu_name: string; menu_type: string } | null;
  dishes?: {
    id: string;
    dish_name: string;
    selling_price: number;
    is_vegetarian?: boolean | null;
    is_vegan?: boolean | null;
    allergens?: string[] | null;
  } | null;
  recipes?: {
    id: string;
    recipe_name: string;
    is_vegetarian?: boolean | null;
    is_vegan?: boolean | null;
    allergens?: string[] | null;
  } | null;
};

export interface DishOption {
  id: string;
  dish_name: string;
  selling_price: number;
}

export interface RecipeOption {
  id: string;
  recipe_name: string;
}

export interface MenuOption {
  id: string;
  menu_name: string;
  menu_type: string;
}

interface RunsheetPanelProps {
  func: AppFunction;
  initialItems: RunsheetItemWithRelations[];
  functionId: string;
}

export function RunsheetPanel({ func, initialItems, functionId }: RunsheetPanelProps) {
  const router = useRouter();
  const [items, setItems] = useState<RunsheetItemWithRelations[]>(initialItems);
  const [activeDay, setActiveDay] = useState(1);
  const [menus, setMenus] = useState<MenuOption[]>([]);
  const [dishes, setDishes] = useState<DishOption[]>([]);
  const [recipes, setRecipes] = useState<RecipeOption[]>([]);

  const isMultiDay = func.start_date && func.end_date && func.start_date !== func.end_date;
  const totalDays = isMultiDay
    ? Math.max(
        1,
        Math.round(
          (new Date(func.end_date!).getTime() - new Date(func.start_date).getTime()) / 86400000,
        ) + 1,
      )
    : 1;

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const fetchMenus = useCallback(() => {
    fetch('/api/menus')
      .then(res => res.json())
      .then(data => {
        const allMenus = Array.isArray(data?.menus) ? data.menus : Array.isArray(data) ? data : [];
        setMenus(
          allMenus.map((m: { id: string; menu_name: string; menu_type?: string }) => ({
            id: m.id,
            menu_name: m.menu_name,
            menu_type: m.menu_type || 'a_la_carte',
          })),
        );
      })
      .catch(err => logger.error('Failed to fetch menus:', { error: err }));
  }, []);

  useEffect(() => {
    fetchMenus();

    fetch('/api/dishes?pageSize=200')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.dishes) ? data.dishes : Array.isArray(data) ? data : [];
        setDishes(
          list.map((d: DishOption) => ({
            id: d.id,
            dish_name: d.dish_name,
            selling_price: d.selling_price,
          })),
        );
      })
      .catch(err => logger.error('Failed to fetch dishes:', { error: err }));

    fetch('/api/recipes')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.recipes) ? data.recipes : Array.isArray(data) ? data : [];
        setRecipes(
          list.map((r: RecipeOption) => ({
            id: r.id,
            recipe_name: r.recipe_name,
          })),
        );
      })
      .catch(err => logger.error('Failed to fetch recipes:', { error: err }));
  }, [fetchMenus]);

  const dayItems = items
    .filter(item => item.day_number === activeDay)
    .sort((a, b) => a.position - b.position);

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
      const position = dayItems.length;
      const res = await fetch(`/api/functions/${functionId}/runsheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, position }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setItems(prev => [...prev, newItem]);
      }
    },
    [functionId, dayItems.length],
  );

  const handleDeleteItem = useCallback(
    async (itemId: string) => {
      const original = [...items];
      setItems(prev => prev.filter(i => i.id !== itemId));

      const res = await fetch(`/api/functions/${functionId}/runsheet/${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        setItems(original);
      }
    },
    [functionId, items],
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
        if (m) optimistic.menus = { id: m.id, menu_name: m.menu_name, menu_type: m.menu_type };
        else optimistic.menus = null;
      } else if (data.menu_id === null) optimistic.menus = null;
      if (data.dish_id && dishes.length > 0) {
        const d = dishes.find(x => x.id === data.dish_id);
        if (d)
          optimistic.dishes = { id: d.id, dish_name: d.dish_name, selling_price: d.selling_price };
        else optimistic.dishes = null;
      } else if (data.dish_id === null) optimistic.dishes = null;
      if (data.recipe_id && recipes.length > 0) {
        const r = recipes.find(x => x.id === data.recipe_id);
        if (r) optimistic.recipes = { id: r.id, recipe_name: r.recipe_name };
        else optimistic.recipes = null;
      } else if (data.recipe_id === null) optimistic.recipes = null;

      setItems(
        prev =>
          prev.map(i =>
            i.id === itemId ? { ...i, ...optimistic } : i,
          ) as RunsheetItemWithRelations[],
      );

      const res = await fetch(`/api/functions/${functionId}/runsheet/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setItems(
          prev =>
            prev.map(i =>
              i.id === itemId ? { ...i, ...updated } : i,
            ) as RunsheetItemWithRelations[],
        );
      } else {
        setItems(original);
      }
    },
    [functionId, items, menus, dishes, recipes],
  );

  const handleMenuClick = useCallback(
    (menuId: string) => {
      router.push(`/webapp/recipes#menu-builder&menu=${menuId}`);
    },
    [router],
  );

  return (
    <Card>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--foreground)]">
            <Icon icon={ClipboardList} size="sm" className="text-[var(--primary)]" />
            Runsheet
          </h3>
          <div className="flex items-center gap-2">
            {totalDays > 1 && (
              <>
                <ExportDayButton functionId={functionId} dayNumber={activeDay} />
                <ExportDayButton functionId={functionId} />
              </>
            )}
            {totalDays === 1 && <ExportDayButton functionId={functionId} dayNumber={1} />}
          </div>
        </div>

        <FunctionAllergenSummary items={items} />

        {totalDays > 1 && (
          <DayTabBar
            startDate={func.start_date}
            endDate={func.end_date || null}
            activeDay={activeDay}
            onDayChange={setActiveDay}
          />
        )}

        {dayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon
              icon={ClipboardList}
              size="xl"
              className="mb-3 text-[var(--foreground-muted)]"
              aria-hidden
            />
            <p className="text-sm text-[var(--foreground-muted)]">
              No items on {totalDays > 1 ? `Day ${activeDay}` : 'the runsheet'} yet.
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Add activities, meal services, and setup tasks below.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {dayItems.map(item => (
              <RunsheetItemRow
                key={item.id}
                item={item}
                menus={menus}
                dishes={dishes}
                recipes={recipes}
                onDelete={handleDeleteItem}
                onUpdate={handleUpdateItem}
                onMenuClick={handleMenuClick}
              />
            ))}
          </div>
        )}

        <RunsheetAddForm
          dayNumber={activeDay}
          onAdd={handleAddItem}
          menus={menus}
          dishes={dishes}
          recipes={recipes}
          onMenuCreated={fetchMenus}
          functionName={func.name}
        />
      </div>
    </Card>
  );
}
