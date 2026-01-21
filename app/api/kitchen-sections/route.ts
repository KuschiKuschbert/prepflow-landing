import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import {
    fetchDishSections,
    fetchDishes,
    fetchSections,
    mapSectionsWithDishes,
} from './service';
import { Dish, DishSection, KitchenSection } from './types';

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

    const [sectionsData, dishesData, dishSectionsData] = await Promise.all([
      fetchSections(supabaseAdmin),
      fetchDishes(supabaseAdmin),
      fetchDishSections(supabaseAdmin),
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
