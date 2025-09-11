import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    // Check menu_dishes table structure
    const { data: menuDishes, error: menuDishesError } = await supabaseAdmin
      .from('menu_dishes')
      .select('*')
      .limit(1);

    if (menuDishesError) {
      console.error('Error checking menu_dishes table:', menuDishesError);
      return NextResponse.json({
        error: 'Failed to check menu_dishes table',
        message: 'Could not retrieve table structure',
        details: menuDishesError.message
      }, { status: 500 });
    }

    // Check sales_data table structure
    const { data: salesData, error: salesDataError } = await supabaseAdmin
      .from('sales_data')
      .select('*')
      .limit(1);

    if (salesDataError) {
      console.error('Error checking sales_data table:', salesDataError);
      return NextResponse.json({
        error: 'Failed to check sales_data table',
        message: 'Could not retrieve table structure',
        details: salesDataError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Table structure retrieved successfully',
      data: {
        menu_dishes: menuDishes,
        sales_data: salesData,
        menu_dishes_columns: menuDishes.length > 0 ? Object.keys(menuDishes[0]) : [],
        sales_data_columns: salesData.length > 0 ? Object.keys(salesData[0]) : []
      }
    });

  } catch (error) {
    console.error('Error in GET /api/check-table-structure:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while checking table structure',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}