'use client';

import { logger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import type { DishOption, MenuOption, RecipeOption } from '../components/RunsheetPanel';

export function useRunsheetOptions() {
  const [menus, setMenus] = useState<MenuOption[]>([]);
  const [dishes, setDishes] = useState<DishOption[]>([]);
  const [recipes, setRecipes] = useState<RecipeOption[]>([]);

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

  return { menus, dishes, recipes, fetchMenus };
}
