import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { evaluateGate } from '@/lib/feature-gate';

export async function GET(request: NextRequest) {
  try {
    const gate = evaluateGate('analytics', request);
    if (!gate.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('menu_dishes')
      .select(
        `
        *,
        sales_data (
          id,
          number_sold,
          popularity_percentage,
          date
        )
      `,
      )
      .order('created_at', { ascending: false });

    if (dishesError) {
      console.error('Error fetching dishes:', dishesError);
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Could not retrieve menu dishes from database',
          details: dishesError,
        },
        { status: 500 },
      );
    }

    // Filter dishes with sales data for analysis
    const dishesWithSales =
      dishes?.filter(dish => dish.sales_data && dish.sales_data.length > 0) || [];

    // Remove duplicates by keeping only the most recent entry for each dish name
    const uniqueDishes =
      dishes?.reduce((acc: any[], dish: any) => {
        const existingDish = acc.find((d: any) => d.name === dish.name);
        if (!existingDish || new Date(dish.created_at) > new Date(existingDish.created_at)) {
          // Remove existing entry if it exists
          const filteredAcc = acc.filter((d: any) => d.name !== dish.name);
          return [...filteredAcc, dish];
        }
        return acc;
      }, [] as any[]) || [];

    // PrepFlow COGS Methodology - Dynamic thresholds based on menu averages
    // Calculate average profit margin across all unique dishes
    const averageProfitMargin =
      uniqueDishes.length > 0
        ? uniqueDishes.reduce((sum, dish) => sum + dish.profit_margin, 0) / uniqueDishes.length
        : 70.0; // Default fallback average

    // Calculate average popularity across all dishes with sales data
    const averagePopularity =
      dishesWithSales.length > 0
        ? dishesWithSales.reduce((sum, dish) => {
            const latestSales = dish.sales_data?.[0];
            return sum + (latestSales?.popularity_percentage || 0);
          }, 0) / dishesWithSales.length
        : 8.3; // Default fallback average

    // Dynamic thresholds based on PrepFlow methodology
    const profitThreshold = averageProfitMargin; // HIGH if above menu average
    const popularityThreshold = averagePopularity * 0.8; // HIGH if ≥ 80% of average popularity

    const performanceData =
      uniqueDishes
        .map(dish => {
          const latestSales = dish.sales_data?.[0]; // Get most recent sales data
          const numberSold = latestSales?.number_sold || 0;
          const popularityPercentage = latestSales?.popularity_percentage || 0;

          // Calculate food cost and contribution margin (PrepFlow's key metric)
          // In PrepFlow Excel: profit_margin is actually gross profit percentage
          // Food cost = selling price * (100 - profit_margin) / 100
          const foodCost = (dish.selling_price * (100 - dish.profit_margin)) / 100;
          const contributionMargin = dish.selling_price - foodCost;

          // Calculate gross profit excluding GST (PrepFlow standard)
          // Assuming 10% GST rate for Australia
          const gstRate = 0.1;
          const grossProfitExclGST = contributionMargin / (1 + gstRate);

          // Calculate Profit Category: HIGH if above menu average, LOW if below (PrepFlow standard)
          const profitCategory = dish.profit_margin >= profitThreshold ? 'High' : 'Low';

          // Calculate Popularity Category: HIGH if ≥ 80% of average popularity, LOW if below (PrepFlow standard)
          const popularityCategory = popularityPercentage >= popularityThreshold ? 'High' : 'Low';

          // Calculate Menu Item Class (combination of Profit Cat + Popularity Cat)
          let menuItemClass: string;
          if (profitCategory === 'High' && popularityCategory === 'High') {
            menuItemClass = "Chef's Kiss";
          } else if (profitCategory === 'High' && popularityCategory === 'Low') {
            menuItemClass = 'Hidden Gem';
          } else if (profitCategory === 'Low' && popularityCategory === 'High') {
            menuItemClass = 'Bargain Bucket';
          } else {
            menuItemClass = 'Burnt Toast';
          }

          return {
            ...dish,
            number_sold: numberSold,
            popularity_percentage: popularityPercentage,
            profit_category: profitCategory,
            popularity_category: popularityCategory,
            menu_item_class: menuItemClass,
            food_cost: foodCost,
            contribution_margin: contributionMargin,
            gross_profit: grossProfitExclGST, // Gross profit excluding GST
            gross_profit_percentage: dish.profit_margin,
          };
        })
        // Filter out items with no sales (number_sold = 0 or null)
        .filter(dish => dish.number_sold > 0) || [];

    return NextResponse.json({
      success: true,
      data: performanceData,
      message: 'Performance data retrieved successfully',
      metadata: {
        methodology: 'PrepFlow COGS Dynamic',
        averageProfitMargin: averageProfitMargin,
        averagePopularity: averagePopularity,
        profitThreshold: profitThreshold,
        popularityThreshold: popularityThreshold,
        totalDishes: dishes?.length || 0,
        uniqueDishes: uniqueDishes.length,
        dishesWithSales: dishesWithSales.length,
      },
    });
  } catch (error) {
    console.error('Error in performance API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
        details: error,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dish_id, number_sold, popularity_percentage, date } = await request.json();

    if (!dish_id || !number_sold || !popularity_percentage) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'dish_id, number_sold, and popularity_percentage are required',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Upsert sales data
    const { data, error } = await supabaseAdmin
      .from('sales_data')
      .upsert(
        {
          dish_id: dish_id,
          number_sold: number_sold,
          popularity_percentage: popularity_percentage,
          date: date || new Date().toISOString().split('T')[0],
        },
        {
          onConflict: 'dish_id,date',
        },
      )
      .select();

    if (error) {
      console.error('Error inserting sales data:', error);
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Could not update sales data',
          details: error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Sales data updated successfully',
    });
  } catch (error) {
    console.error('Error in performance POST API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
        details: error,
      },
      { status: 500 },
    );
  }
}
