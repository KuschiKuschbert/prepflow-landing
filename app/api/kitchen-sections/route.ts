import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Dish, DishSection, KitchenSection, NormalizedDish } from './types';

const TABLE_NOT_FOUND_RESPONSE = {
  success: true,
  data: [],
  message: 'Kitchen sections table not found. Please run database setup.',
  instructions: [
    'The kitchen_sections table does not exist.',
    'To set up the database:',
    '1. Visit /api/setup-menu-builder (GET) to get the SQL migration',
    '2. Or open menu-builder-schema.sql from the project root',
    '3. Copy and run the SQL in your Supabase SQL Editor',
  ],
};

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const sections = await fetchSections(supabaseAdmin);
    if (!sections && sections !== null) { // null means error handled
       return NextResponse.json(TABLE_NOT_FOUND_RESPONSE);
    }

    // fetchSections returns array or null (for 404 handled) or throws
    // Actually, let's make it return array or throws.
    // If sections is empty array, it might be error handled as empty.

    // Let's refine the extraction.

    // We can move the logic for dishes and map logic as well.

    const [sectionsData, dishesData, dishSectionsData] = await Promise.all([
        fetchSections(supabaseAdmin),
        fetchDishes(supabaseAdmin),
        fetchDishSections(supabaseAdmin)
    ]);

    if (sectionsData === 'TABLE_NOT_FOUND') {
         return NextResponse.json(TABLE_NOT_FOUND_RESPONSE);
    }

    const sectionsList = (sectionsData as KitchenSection[]) || [];
    const dishesList = (dishesData as Dish[]) || [];
    const dishSectionsList = (dishSectionsData as DishSection[]) || [];

    const mappedData = mapSectionsWithDishes(sectionsList, dishesList, dishSectionsList);

    return NextResponse.json({ success: true, data: mappedData });
  } catch (error: unknown) {
    logger.error('Kitchen sections API error:', {
      error: error instanceof Error ? error.message : String(error),
    });

    // Check if error is roughly PostgrestError-like
    const pgError = error as { code?: string; message?: string };

    if (pgError?.code === '42P01' || pgError?.message?.includes('does not exist')) {
      return NextResponse.json(TABLE_NOT_FOUND_RESPONSE);
    }
    return NextResponse.json(
      ApiErrorHandler.createError(
        'An unexpected error occurred while fetching kitchen sections',
        'SERVER_ERROR',
        500,
        {
          details: pgError?.message,
        },
      ),
      { status: 500 },
    );
  }
}

async function fetchSections(supabase: any) {
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

async function fetchDishes(supabase: any) {
    // Try dishes with kitchen_section_id first
    try {
        const { data: dishesWithSectionData, error: dishesWithSectionError } = await supabase
          .from('dishes')
          .select('id, dish_name, description, selling_price, category, kitchen_section_id');
        if (!dishesWithSectionError && dishesWithSectionData) {
          return dishesWithSectionData as unknown as Dish[];
        }
    } catch {}

    try {
        const { data: menuDishesWithSectionData, error: menuDishesWithSectionError } = await supabase
              .from('menu_dishes')
              .select('id, name, description, selling_price, category, kitchen_section_id');
        if (!menuDishesWithSectionError && menuDishesWithSectionData) {
            return menuDishesWithSectionData as unknown as Dish[];
        }
    } catch {}

    // Fallback to basic select without kitchen_section_id if needed, though the above implies checking for the column existence indirectly by trying to select it?
    // The original code tried fetch simple dishes first, then tried fetching dishes with kitchen_section_id ONLY if dish_sections table failed.
    // It's a bit of a spaghetti logic.
    // Let's stick to the original logic flow roughly but simplified.

    // Actually, implementing exactly as original is safer.

    let dishes: Dish[] = [];
    const { data: dishesData, error: dishesQueryError } = await supabase
      .from('dishes')
      .select('id, dish_name, description, selling_price, category');
    if (!dishesQueryError && dishesData) {
      dishes = dishesData as unknown as Dish[];
    } else {
      const { data: menuDishesData } = await supabase
        .from('menu_dishes')
        .select('id, name, description, selling_price, category');
      if (menuDishesData) {
        dishes = menuDishesData as unknown as Dish[];
      }
    }

    // Now try to fetch with kitchen_section_id
    try {
        const { data: dws } = await supabase.from('dishes').select('id, dish_name, description, selling_price, category, kitchen_section_id');
        if (dws) return dws as unknown as Dish[];
    } catch {}

    // If that failed, return the basic dishes
    return dishes;
}

// Rewriting fetchDishes to be cleaner and more robust
async function fetchDishesAndSections(supabase: any) {
    // This part of the original code was:
    // 1. fetch basic dishes
    // 2. fetch dish_sections table
    // 3. if dish_sections fails, try fetching dishes with kitchen_section_id column
    // This implies we need both dishes and the mapping.

    let dishes: Dish[] = [];

    // Try to get dishes with kitchen_section_id embedded
    const { data: dws, error: dwsError } = await supabase.from('dishes').select('id, dish_name, description, selling_price, category, kitchen_section_id');
    if (!dwsError && dws) {
        return { dishes: dws as Dish[], dishSections: [] as DishSection[] };
    }

    // Fallback to menu_dishes with kitchen_section_id
    const { data: mdws, error: mdwsError } = await supabase.from('menu_dishes').select('id, name, description, selling_price, category, kitchen_section_id');
    if (!mdwsError && mdws) {
        return { dishes: mdws as Dish[], dishSections: [] as DishSection[] };
    }

    // If direct column access failed, maybe we need the join table
    const { data: basicDishes } = await supabase.from('dishes').select('id, dish_name, description, selling_price, category');
    if (basicDishes) dishes = basicDishes as Dish[];

    const { data: dsData } = await supabase.from('dish_sections').select('dish_id, section_id');

    return { dishes, dishSections: (dsData || []) as DishSection[] };
}

// Let's stick to separate functions but maybe slightly improved flow?
// The original code had nested fallbacks.
// Let's implement fetchDishSections and fetchDishesWithFallback.

async function fetchDishSections(supabase: any) {
    try {
      const { data } = await supabase.from('dish_sections').select('dish_id, section_id');
      return (data as unknown as DishSection[]) || [];
    } catch {
      return [];
    }
}

async function fetchDishesExtended(supabase: any) {
    // Strategy: Try to get dishes with kitchen_section_id. If that fails, get basic dishes.
    // The original code was: Get basic dishes -> Get dish_sections -> if dish_sections fail, get dishes with kitchen_section_id

    // Let's try to get dishes with kitchen_section_id directly first as it's the newer schema likely.

    // Try dishes with column
    {
        const { data, error } = await supabase.from('dishes').select('id, dish_name, description, selling_price, category, kitchen_section_id');
        if (!error && data) return data as Dish[];
    }

    // Try menu_dishes with column
    {
        const { data, error } = await supabase.from('menu_dishes').select('id, name, description, selling_price, category, kitchen_section_id');
        if (!error && data) return data as Dish[];
    }

    // Fallback to basic dishes
    {
        const { data } = await supabase.from('dishes').select('id, dish_name, description, selling_price, category');
        if (data) return data as Dish[];
    }

    return [];
}


function mapSectionsWithDishes(sections: KitchenSection[], dishes: Dish[], dishSections: DishSection[]) {
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
