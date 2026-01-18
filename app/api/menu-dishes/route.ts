import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Define strict interfaces
interface Dish {
  id: string;
  dish_name?: string; // from 'dishes' table
  name?: string; // from 'menu_dishes' table
  description: string | null;
  selling_price: number;
  category: string | null;
  kitchen_section_id: string | null;
}

interface DishSection {
  dish_id: string;
  section_id: string;
}

interface OutputDish {
  id: string;
  name: string;
  description: string | null;
  selling_price: number;
  category: string;
  kitchen_section_id: string | null;
}

export async function GET(_request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Try to fetch from 'dishes' table first (newer schema)
    let dishes: Dish[] = [];
    let dishesError: PostgrestError | null = null;

    const { data: dishesData, error: dishesQueryError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, description, selling_price, category, kitchen_section_id')
      .limit(1);

    if (!dishesQueryError && dishesData) {
      // Table exists, fetch all dishes
      const { data: allDishesData, error: allDishesError } = await supabaseAdmin
        .from('dishes')
        .select('id, dish_name, description, selling_price, category, kitchen_section_id');

      if (!allDishesError && allDishesData) {
        dishes = allDishesData as unknown as Dish[];
      }
    } else if (dishesQueryError?.code === '42P01') {
      // Table doesn't exist (42P01 = undefined_table)
      logger.warn('dishes table does not exist, trying menu_dishes table');
      // Fallback to 'menu_dishes' table (older schema)
      const { data: menuDishesData, error: menuDishesError } = await supabaseAdmin
        .from('menu_dishes')
        .select('id, name, description, selling_price, category, kitchen_section_id')
        .limit(1);

      if (!menuDishesError && menuDishesData) {
        // Table exists, fetch all dishes
        const { data: allMenuDishesData, error: allMenuDishesError } = await supabaseAdmin
          .from('menu_dishes')
          .select('id, name, description, selling_price, category, kitchen_section_id');
        if (!allMenuDishesError && allMenuDishesData) {
          dishes = allMenuDishesData as unknown as Dish[];
        }
      } else if (menuDishesError?.code === '42P01') {
        // Neither table exists
        logger.warn('Neither dishes nor menu_dishes table exists');
        return NextResponse.json({
          success: true,
          data: [],
          message: 'No dishes tables found. Tables may need to be created.',
        });
      } else {
        dishesError = menuDishesError;
        logger.error('Error fetching from menu_dishes:', dishesError);
        return NextResponse.json({
          success: true,
          data: [],
          message: 'Could not fetch dishes',
        });
      }
    } else {
      dishesError = dishesQueryError; // Use the error from the query above
      logger.error('Error fetching dishes:', dishesError);
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Could not fetch dishes',
      });
    }

    // Fetch dish_sections junction table to map dishes to sections
    // This table might not exist, so handle errors gracefully
    const dishIds = (dishes || []).map(d => d.id);
    let dishSections: DishSection[] = [];
    if (dishIds.length > 0) {
      try {
        const dishSectionsResult = await supabaseAdmin
          .from('dish_sections')
          .select('dish_id, section_id')
          .in('dish_id', dishIds);
        if (!dishSectionsResult.error && dishSectionsResult.data) {
          dishSections = dishSectionsResult.data as unknown as DishSection[];
        } else {
          logger.warn('dish_sections table might not exist or query failed:', {
            error: dishSectionsResult.error?.message || String(dishSectionsResult.error),
            code: dishSectionsResult.error?.code,
            details: dishSectionsResult.error?.details,
            hint: dishSectionsResult.error?.hint,
          });
        }
      } catch (err) {
        logger.warn('Error querying dish_sections:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
        // Continue without dish_sections mapping
      }
    }

    // Create a map of dish_id -> section_id
    const dishSectionMap = new Map<string, string>();
    dishSections.forEach(ds => {
      dishSectionMap.set(ds.dish_id, ds.section_id);
    });

    // Map dishes with their section IDs
    const dishesWithSections: OutputDish[] = (dishes || []).map(dish => ({
      id: dish.id,
      name: dish.dish_name || dish.name || 'Unknown Dish',
      description: dish.description,
      selling_price: dish.selling_price,
      category: dish.category || 'Uncategorized',
      kitchen_section_id: dish.kitchen_section_id || dishSectionMap.get(dish.id) || null,
    }));

    return NextResponse.json({
      success: true,
      data: dishesWithSections,
    });
  } catch (error) {
    const pgError = error as PostgrestError;
    logger.error('Menu dishes API error:', error);

    // Check if it's a table doesn't exist error
    if (pgError?.code === '42P01' || pgError?.message?.includes('does not exist')) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Dishes tables not found. Please run database setup.',
        instructions: [
          'The dishes or menu_dishes table does not exist.',
          'To set up the database:',
          '1. Visit /api/setup-menu-builder (GET) to get the SQL migration',
          '2. Or open menu-builder-schema.sql from the project root',
          '3. Copy and run the SQL in your Supabase SQL Editor',
        ],
      });
    }

    return NextResponse.json(
      ApiErrorHandler.createError(
        'An unexpected error occurred while fetching dishes',
        'SERVER_ERROR',
        500,
        {
          details: pgError?.message || String(error),
        },
      ),
      { status: 500 },
    );
  }
}
