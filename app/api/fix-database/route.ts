import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    // First, let's check if sales_data table has the right structure
    const { data: salesData, error: salesError } = await supabaseAdmin
      .from('sales_data')
      .select('*')
      .limit(1);

    if (salesError) {
      console.error('Error checking sales_data table:', salesError);
      return NextResponse.json({
        error: 'Failed to check sales_data table',
        message: 'Could not check table structure',
        details: salesError.message
      }, { status: 500 });
    }

    // Check if dish_id column exists
    const hasDishId = salesData.length > 0 ? Object.keys(salesData[0]).includes('dish_id') : false;

    if (!hasDishId) {
      // We need to add the dish_id column
      return NextResponse.json({
        error: 'Missing dish_id column',
        message: 'The sales_data table is missing the dish_id column',
        instructions: {
          step1: 'Go to your Supabase dashboard',
          step2: 'Navigate to SQL Editor',
          step3: 'Run this SQL command:',
          sql: 'ALTER TABLE sales_data ADD COLUMN dish_id INTEGER REFERENCES menu_dishes(id) ON DELETE CASCADE;'
        }
      }, { status: 400 });
    }

    // If we get here, the table structure is correct
    return NextResponse.json({
      success: true,
      message: 'Database structure is correct',
      data: {
        sales_data_columns: salesData.length > 0 ? Object.keys(salesData[0]) : [],
        has_dish_id: hasDishId
      }
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred while checking database structure',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
