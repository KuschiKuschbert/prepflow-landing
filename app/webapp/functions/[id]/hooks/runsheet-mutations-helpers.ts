/**
 * Helpers for useRunsheetMutations optimistic updates.
 */

import type {
  DishOption,
  MenuOption,
  RecipeOption,
  RunsheetItemWithRelations,
} from '../components/runsheet-types';

type UpdateData = {
  menu_id?: string | null;
  dish_id?: string | null;
  recipe_id?: string | null;
  [key: string]: unknown;
};

export function buildOptimisticRunsheetUpdate(
  data: UpdateData,
  menus: MenuOption[],
  dishes: DishOption[],
  recipes: RecipeOption[],
): Partial<RunsheetItemWithRelations> {
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
  return optimistic;
}
