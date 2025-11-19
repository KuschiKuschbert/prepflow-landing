import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // First, try to fetch kitchen sections with flexible column handling
    // Don't order in SQL to avoid column name issues - we'll sort in JavaScript
    let sections: any[] = [];
    let sectionsError: any = null;

    try {
      let sectionsQuery = supabaseAdmin
        .from('kitchen_sections')
        .select('id, name, section_name, description, color_code, color, created_at, updated_at');

      // Try to filter by is_active if column exists
      let result = await sectionsQuery.eq('is_active', true);

      if (result.error) {
        // If is_active column doesn't exist, try without filter
        const fallbackQuery = supabaseAdmin
          .from('kitchen_sections')
          .select('id, name, section_name, description, color_code, color, created_at, updated_at');

        result = await fallbackQuery;
      }

      if (result.error) {
        sectionsError = result.error;

        // Check if table doesn't exist
        if (result.error.code === '42P01') {
          logger.warn('kitchen_sections table does not exist');
          return NextResponse.json({
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
          });
        }

        logger.error('Error fetching kitchen sections:', sectionsError);
        sections = [];
      } else {
        sections = result.data || [];
      }
    } catch (err: any) {
      sectionsError = err;

      // Check if it's a table doesn't exist error
      if (err?.code === '42P01' || err?.message?.includes('does not exist')) {
        logger.warn('kitchen_sections table does not exist');
        return NextResponse.json({
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
        });
      }

      logger.error('Exception fetching kitchen sections:', err);
      sections = [];
    }

    // If we can't get sections due to non-table errors, return empty array
    if (sectionsError && sections.length === 0 && sectionsError.code !== '42P01') {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Could not fetch kitchen sections',
      });
    }

    // Fetch dishes - try both 'dishes' and 'menu_dishes' tables
    let dishes: any[] = [];
    let dishesError: any = null;

    // Try dishes table first
    const dishesResult = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, description, selling_price, category');
    if (!dishesResult.error && dishesResult.data) {
      dishes = dishesResult.data;
    } else {
      // Try menu_dishes table instead
      const menuDishesResult = await supabaseAdmin
        .from('menu_dishes')
        .select('id, name, description, selling_price, category');
      if (!menuDishesResult.error && menuDishesResult.data) {
        dishes = menuDishesResult.data;
      } else {
        dishesError = menuDishesResult.error || dishesResult.error;
        logger.warn('Could not fetch dishes from either table:', dishesError);
        // Continue with empty dishes array
        dishes = [];
      }
    }

    // Fetch dish_sections junction table to link dishes to sections
    // This table might not exist, so handle errors gracefully
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

    // If dish_sections doesn't exist or is empty, try dishes with kitchen_section_id column
    let dishesWithSectionId: any[] = [];
    if (dishSectionsError || dishSections.length === 0) {
      // Try to get dishes with direct kitchen_section_id
      try {
        const dishesWithSection = await supabaseAdmin
          .from('dishes')
          .select('id, dish_name, description, selling_price, category, kitchen_section_id');
        if (!dishesWithSection.error && dishesWithSection.data) {
          dishesWithSectionId = dishesWithSection.data;
        } else {
          // Try menu_dishes with kitchen_section_id
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

    // Normalize dishes data - use dishesWithSectionId if available, otherwise use dishes
    const allDishes = dishesWithSectionId.length > 0 ? dishesWithSectionId : dishes;
    const normalizedDishes = (allDishes || []).map((dish: any) => ({
      id: dish.id,
      name: dish.dish_name || dish.name,
      description: dish.description,
      selling_price: dish.selling_price,
      category: dish.category || 'Uncategorized',
      kitchen_section_id: dish.kitchen_section_id || null,
    }));

    // Create a map of dish_id -> section_id from dish_sections junction table
    const dishSectionMap = new Map<string, string>();
    if (dishSections && dishSections.length > 0) {
      dishSections.forEach((ds: any) => {
        if (ds.dish_id && ds.section_id) {
          dishSectionMap.set(ds.dish_id, ds.section_id);
        }
      });
    }

    // Group dishes by section
    const dishesBySection = new Map<string, any[]>();
    normalizedDishes.forEach((dish: any) => {
      const sectionId = dish.kitchen_section_id || dishSectionMap.get(dish.id) || null;
      if (sectionId) {
        if (!dishesBySection.has(sectionId)) {
          dishesBySection.set(sectionId, []);
        }
        dishesBySection.get(sectionId)!.push(dish);
      }
    });

    // Map sections with their dishes
    const mappedData = (sections || []).map((section: any) => {
      const sectionId = section.id;
      const sectionDishes = dishesBySection.get(sectionId) || [];

      return {
        id: section.id,
        name: section.name || section.section_name,
        description: section.description,
        color: section.color || section.color_code || '#29E7CD',
        created_at: section.created_at,
        updated_at: section.updated_at,
        menu_dishes: sectionDishes,
      };
    });

    // Sort by name
    mappedData.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      data: mappedData,
    });
  } catch (error: any) {
    logger.error('Kitchen sections API error:', error);

    // Check if it's a table doesn't exist error
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      return NextResponse.json({
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
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching kitchen sections',
        details: error?.message,
      },
      { status: 500 },
    );
  }
}
