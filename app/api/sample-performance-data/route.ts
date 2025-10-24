import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Create sample menu dishes (matching existing table structure)
    const sampleDishes = [
      {
        name: 'Double Cheese Burger',
        selling_price: 41.0,
        profit_margin: 72.12,
        popularity_score: 95,
      },
      {
        name: 'Hot Dog',
        selling_price: 21.9,
        profit_margin: 72.44,
        popularity_score: 88,
      },
      {
        name: 'Steak and Chips',
        selling_price: 35.9,
        profit_margin: 70.28,
        popularity_score: 75,
      },
      {
        name: 'Chicken Parmy',
        selling_price: 30.9,
        profit_margin: 70.38,
        popularity_score: 82,
      },
      {
        name: 'Chefs Burger',
        selling_price: 25.9,
        profit_margin: 70.71,
        popularity_score: 90,
      },
      {
        name: 'Pizza Hawaii',
        selling_price: 13.9,
        profit_margin: 70.13,
        popularity_score: 68,
      },
      {
        name: 'Arrancini',
        selling_price: 10.9,
        profit_margin: 69.83,
        popularity_score: 72,
      },
      {
        name: 'Dumplings',
        selling_price: 4.9,
        profit_margin: 71.73,
        popularity_score: 85,
      },
      {
        name: 'Spring Rolls',
        selling_price: 6.9,
        profit_margin: 69.9,
        popularity_score: 78,
      },
      {
        name: 'Mo Mos',
        selling_price: 7.0,
        profit_margin: 74.57,
        popularity_score: 80,
      },
      {
        name: 'Steak Sandwich',
        selling_price: 32.0,
        profit_margin: 70.58,
        popularity_score: 50,
      },
      {
        name: 'Chicken Burger',
        selling_price: 19.0,
        profit_margin: 71.56,
        popularity_score: 60,
      },
      {
        name: 'Sausage Roll',
        selling_price: 9.0,
        profit_margin: 72.13,
        popularity_score: 37,
      },
    ];

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Insert sample dishes
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('menu_dishes')
      .insert(sampleDishes)
      .select();

    if (dishesError) {
      console.error('Error inserting dishes:', dishesError);
      return NextResponse.json(
        {
          error: 'Failed to insert dishes',
          message: 'Could not create sample menu dishes',
          details: dishesError.message,
        },
        { status: 500 },
      );
    }

    // Create sample sales data
    const sampleSalesData = [
      { dish_id: dishes[0].id, number_sold: 175, popularity_percentage: 10.85 },
      { dish_id: dishes[1].id, number_sold: 158, popularity_percentage: 9.8 },
      { dish_id: dishes[2].id, number_sold: 105, popularity_percentage: 6.51 },
      { dish_id: dishes[3].id, number_sold: 162, popularity_percentage: 10.04 },
      { dish_id: dishes[4].id, number_sold: 80, popularity_percentage: 4.96 },
      { dish_id: dishes[5].id, number_sold: 159, popularity_percentage: 9.86 },
      { dish_id: dishes[6].id, number_sold: 121, popularity_percentage: 7.5 },
      { dish_id: dishes[7].id, number_sold: 139, popularity_percentage: 8.62 },
      { dish_id: dishes[8].id, number_sold: 60, popularity_percentage: 3.72 },
      { dish_id: dishes[9].id, number_sold: 101, popularity_percentage: 6.26 },
      { dish_id: dishes[10].id, number_sold: 80, popularity_percentage: 4.96 },
      { dish_id: dishes[11].id, number_sold: 97, popularity_percentage: 6.01 },
      { dish_id: dishes[12].id, number_sold: 60, popularity_percentage: 3.72 },
    ];

    // Insert sample sales data
    const { data: salesData, error: salesError } = await supabaseAdmin
      .from('sales_data')
      .insert(sampleSalesData)
      .select();

    if (salesError) {
      console.error('Error inserting sales data:', salesError);
      return NextResponse.json(
        {
          error: 'Failed to insert sales data',
          message: 'Could not create sample sales data',
          details: salesError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sample performance data created successfully',
      data: {
        dishes: dishes.length,
        salesData: salesData.length,
      },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while creating sample data',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
