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
      let sectionsQuery = supabaseAdmin
        .from('kitchen_sections')
        .select('id, name, section_name, description, color_code, color, created_at, updated_at');
      let result = await sectionsQuery.eq('is_active', true);
      if (result.error) {
        const fallbackQuery = supabaseAdmin
          .from('kitchen_sections')
          .select('id, name, section_name, description, color_code, color, created_at, updated_at');
        result = await fallbackQuery;
      }

      if (result.error) {
        sectionsError = result.error;
        if (result.error.code === '42P01') {
          logger.warn('kitchen_sections table does not exist');
          return NextResponse.json(TABLE_NOT_FOUND_RESPONSE);
        }
        logger.error('Error fetching kitchen sections:', sectionsError);
        sections = [];
      } else {
        sections = result.data || [];
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
    const dishesResult = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, description, selling_price, category');
    if (!dishesResult.error && dishesResult.data) {
      dishes = dishesResult.data;
    } else {
      const menuDishesResult = await supabaseAdmin
        .from('menu_dishes')
        .select('id, name, description, selling_price, category');
      if (!menuDishesResult.error && menuDishesResult.data) {
        dishes = menuDishesResult.data;
      } else {
        dishesError = menuDishesResult.error || dishesResult.error;
        logger.warn('Could not fetch dishes from either table:', dishesError);
        dishes = [];
      }
    }
    let dishSections: any[] = [];
    let dishSectionsError: any = null;
    try {
      const dishSectionsResult = await supabaseAdmin
        .from('dish_sections')
        .select('dish_id, section_id');
      if (!dishSectionsResult.error && dishSectionsResult.data) {
        dishSections = dishSectionsResult.data;
      } else {
        dishSectionsError = dishSectionsResult.error;
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
        const dishesWithSection = await supabaseAdmin
          .from('dishes')
          .select('id, dish_name, description, selling_price, category, kitchen_section_id');
        if (!dishesWithSection.error && dishesWithSection.data) {
          dishesWithSectionId = dishesWithSection.data;
        } else {
          const menuDishesWithSection = await supabaseAdmin
            .from('menu_dishes')
            .select('id, name, description, selling_price, category, kitchen_section_id');
          if (!menuDishesWithSection.error && menuDishesWithSection.data) {
            dishesWithSectionId = menuDishesWithSection.data;
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
