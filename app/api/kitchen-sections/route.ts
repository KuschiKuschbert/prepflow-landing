import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

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

    let sections: any[] = [];
    let sectionsError: any = null;
    try {
      const sectionsQuery = supabaseAdmin
        .from('kitchen_sections')
        .select('id, name, section_name, description, color_code, color, created_at, updated_at');
      let { data, error } = await sectionsQuery.eq('is_active', true);
      if (error) {
        const fallbackQuery = supabaseAdmin
          .from('kitchen_sections')
          .select('id, name, section_name, description, color_code, color, created_at, updated_at');
        const fallbackResult = await fallbackQuery;
        data = fallbackResult.data;
        error = fallbackResult.error;
      }

      if (error) {
        sectionsError = error;
        if (error.code === '42P01') {
          logger.warn('kitchen_sections table does not exist');
          return NextResponse.json(TABLE_NOT_FOUND_RESPONSE);
        }
        logger.error('Error fetching kitchen sections:', sectionsError);
        sections = [];
      } else {
        sections = data || [];
      }
    } catch (err: any) {
      sectionsError = err;
      if (err?.code === '42P01' || err?.message?.includes('does not exist')) {
        logger.warn('kitchen_sections table does not exist');
        return NextResponse.json(TABLE_NOT_FOUND_RESPONSE);
      }
      logger.error('Exception fetching kitchen sections:', err);
      sections = [];
    }
    if (sectionsError && sections.length === 0 && sectionsError.code !== '42P01') {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Could not fetch kitchen sections',
      });
    }

    let dishes: any[] = [];
    let dishesError: any = null;
    const { data: dishesData, error: dishesQueryError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, description, selling_price, category');
    if (!dishesQueryError && dishesData) {
      dishes = dishesData;
    } else {
      const { data: menuDishesData, error: menuDishesQueryError } = await supabaseAdmin
        .from('menu_dishes')
        .select('id, name, description, selling_price, category');
      if (!menuDishesQueryError && menuDishesData) {
        dishes = menuDishesData;
      } else {
        dishesError = menuDishesQueryError || dishesQueryError;
        logger.warn('Could not fetch dishes from either table:', dishesError);
        dishes = [];
      }
    }
    let dishSections: any[] = [];
    let dishSectionsError: any = null;
    try {
      const { data: dishSectionsData, error: dishSectionsQueryError } = await supabaseAdmin
        .from('dish_sections')
        .select('dish_id, section_id');
      if (!dishSectionsQueryError && dishSectionsData) {
        dishSections = dishSectionsData;
      } else {
        dishSectionsError = dishSectionsQueryError;
        logger.warn('dish_sections table might not exist:', dishSectionsError);
      }
    } catch (err) {
      dishSectionsError = err;
      logger.warn('Error querying dish_sections:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
    }
    let dishesWithSectionId: any[] = [];
    if (dishSectionsError || dishSections.length === 0) {
      try {
        const { data: dishesWithSectionData, error: dishesWithSectionError } = await supabaseAdmin
          .from('dishes')
          .select('id, dish_name, description, selling_price, category, kitchen_section_id');
        if (!dishesWithSectionError && dishesWithSectionData) {
          dishesWithSectionId = dishesWithSectionData;
        } else {
          const { data: menuDishesWithSectionData, error: menuDishesWithSectionError } =
            await supabaseAdmin
              .from('menu_dishes')
              .select('id, name, description, selling_price, category, kitchen_section_id');
          if (!menuDishesWithSectionError && menuDishesWithSectionData) {
            dishesWithSectionId = menuDishesWithSectionData;
          }
        }
      } catch (err) {
        logger.warn('Error fetching dishes with kitchen_section_id:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
    }

    const allDishes = dishesWithSectionId.length > 0 ? dishesWithSectionId : dishes;
    const normalizedDishes = (allDishes || []).map((dish: any) => ({
      id: dish.id,
      name: dish.dish_name || dish.name,
      description: dish.description,
      selling_price: dish.selling_price,
      category: dish.category || 'Uncategorized',
      kitchen_section_id: dish.kitchen_section_id || null,
    }));
    const dishSectionMap = new Map<string, string>();
    if (dishSections && dishSections.length > 0) {
      dishSections.forEach((ds: any) => {
        if (ds.dish_id && ds.section_id) dishSectionMap.set(ds.dish_id, ds.section_id);
      });
    }
    const dishesBySection = new Map<string, any[]>();
    normalizedDishes.forEach((dish: any) => {
      const sectionId = dish.kitchen_section_id || dishSectionMap.get(dish.id) || null;
      if (sectionId) {
        if (!dishesBySection.has(sectionId)) dishesBySection.set(sectionId, []);
        dishesBySection.get(sectionId)!.push(dish);
      }
    });
    const mappedData = (sections || [])
      .map((section: any) => ({
        id: section.id,
        name: section.name || section.section_name,
        description: section.description,
        color: section.color || section.color_code || '#29E7CD',
        created_at: section.created_at,
        updated_at: section.updated_at,
        menu_dishes: dishesBySection.get(section.id) || [],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ success: true, data: mappedData });
  } catch (error: any) {
    logger.error('Kitchen sections API error:', error);
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      return NextResponse.json(TABLE_NOT_FOUND_RESPONSE);
    }
    return NextResponse.json(
      ApiErrorHandler.createError(
        'An unexpected error occurred while fetching kitchen sections',
        'SERVER_ERROR',
        500,
        {
          details: error?.message,
        },
      ),
      { status: 500 },
    );
  }
}
