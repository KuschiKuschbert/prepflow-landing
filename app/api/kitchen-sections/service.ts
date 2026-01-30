import { logger } from '@/lib/logger';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { Dish, DishSection, KitchenSection, NormalizedDish } from './types';

export async function fetchSections(supabase: SupabaseClient) {
  try {
    const sectionsQuery = supabase
      .from('kitchen_sections')
      .select('id, name, section_name, description, color_code, color, created_at, updated_at');
    let { data, error } = await sectionsQuery.eq('is_active', true);
    if (error) {
      const fallbackQuery = supabase
        .from('kitchen_sections')
        .select('id, name, section_name, description, color_code, color, created_at, updated_at');
      const fallbackResult = await fallbackQuery;
      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) {
      if (error.code === '42P01') {
        logger.warn('kitchen_sections table does not exist');
        return 'TABLE_NOT_FOUND';
      }
      logger.error('Error fetching kitchen sections:', error);
      return [];
    } else {
      return (data as unknown as KitchenSection[]) || [];
    }
  } catch (err: unknown) {
    const pgError = err as PostgrestError;
    if (pgError?.code === '42P01' || pgError?.message?.includes('does not exist')) {
      logger.warn('kitchen_sections table does not exist');
      return 'TABLE_NOT_FOUND';
    }
    logger.error('Exception fetching kitchen sections:', err);
    return [];
  }
}

export async function fetchDishes(supabase: SupabaseClient) {
  // Try to get dishes with kitchen_section_id embedded
  try {
    const { data: dws, error: dwsError } = await supabase
      .from('dishes')
      .select('id, dish_name, description, selling_price, category, kitchen_section_id');
    if (!dwsError && dws) {
      return dws as unknown as Dish[];
    }
  } catch {}

  // Fallback to menu_dishes with kitchen_section_id
  try {
    const { data: mdws, error: mdwsError } = await supabase
      .from('menu_dishes')
      .select('id, name, description, selling_price, category, kitchen_section_id');
    if (!mdwsError && mdws) {
      return mdws as unknown as Dish[];
    }
  } catch {}

  // If direct column access failed, get basic dishes
  let dishes: Dish[] = [];
  const { data: basicDishes } = await supabase
    .from('dishes')
    .select('id, dish_name, description, selling_price, category');
  if (basicDishes) dishes = basicDishes as unknown as Dish[];
  else {
    const { data: menuDishes } = await supabase
      .from('menu_dishes')
      .select('id, name, description, selling_price, category');
    if (menuDishes) dishes = menuDishes as unknown as Dish[];
  }

  return dishes;
}

export async function fetchDishSections(supabase: SupabaseClient) {
  try {
    const { data } = await supabase.from('dish_sections').select('dish_id, section_id');
    return (data as unknown as DishSection[]) || [];
  } catch {
    return [];
  }
}

export function mapSectionsWithDishes(
  sections: KitchenSection[],
  dishes: Dish[],
  dishSections: DishSection[],
) {
  const normalizedDishes: NormalizedDish[] = dishes.map((dish: Dish) => ({
    id: dish.id,
    name: dish.dish_name || dish.name || '',
    description: dish.description,
    selling_price: dish.selling_price,
    category: dish.category || 'Uncategorized',
    kitchen_section_id: dish.kitchen_section_id || null,
  }));

  const dishSectionMap = new Map<string, string>();
  dishSections.forEach((ds: DishSection) => {
    if (ds.dish_id && ds.section_id) dishSectionMap.set(ds.dish_id, ds.section_id);
  });

  const dishesBySection = new Map<string, NormalizedDish[]>();
  normalizedDishes.forEach((dish: NormalizedDish) => {
    const sectionId = dish.kitchen_section_id || dishSectionMap.get(dish.id) || null;
    if (sectionId) {
      if (!dishesBySection.has(sectionId)) dishesBySection.set(sectionId, []);
      dishesBySection.get(sectionId)!.push(dish);
    }
  });

  return sections
    .map((section: KitchenSection) => ({
      id: section.id,
      name: section.name || section.section_name || 'Unnamed Section',
      description: section.description,
      color: section.color || section.color_code || '#29E7CD',
      created_at: section.created_at,
      updated_at: section.updated_at,
      menu_dishes: dishesBySection.get(section.id) || [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
