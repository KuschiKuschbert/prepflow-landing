import { filterSalesDataByDateRange, parseDateRange } from '@/lib/api/performance/dateFiltering';
import { deduplicateDishes, filterDishesWithSales } from '@/lib/api/performance/dishDeduplication';
import { calculatePerformanceMetrics } from '@/lib/api/performance/performanceCalculation';
import { aggregateSalesData } from '@/lib/api/performance/salesAggregation';
import {
    calculateAveragePopularity,
    calculateAverageProfitMargin,
    calculateThresholds,
} from '@/lib/api/performance/thresholdCalculation';
import { evaluateGate } from '@/lib/feature-gate';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

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

    // Get date range from query parameters
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const dateRange = parseDateRange(startDateParam, endDateParam);

    // Build sales_data query
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

    // Filter sales_data by date range if provided
    const filteredDishes = dishes?.map((dish: any) => {
      if (!dish.sales_data || dish.sales_data.length === 0) return dish;
      return {
        ...dish,
        sales_data: filterSalesDataByDateRange(dish.sales_data, dateRange),
      };
    });

    // Remove duplicates by keeping only the most recent entry for each dish name
    const uniqueDishes = deduplicateDishes(filteredDishes || []);

    // Filter dishes with sales data for analysis
    const dishesWithSales = filterDishesWithSales(filteredDishes || []);

    // PrepFlow COGS Methodology - Dynamic thresholds based on menu averages
    const averageProfitMargin = calculateAverageProfitMargin(uniqueDishes);
    const averagePopularity = calculateAveragePopularity(
      dishesWithSales,
      startDateParam || endDateParam ? dateRange : null,
    );
    const { profitThreshold, popularityThreshold } = calculateThresholds(
      averageProfitMargin,
      averagePopularity,
    );

    // Calculate performance data for all dishes
    const performanceData = uniqueDishes.map(dish => {
      const aggregatedSales = aggregateSalesData(
        dish.sales_data,
        startDateParam || endDateParam ? dateRange : null,
      );
      const metrics = calculatePerformanceMetrics(
        dish,
        aggregatedSales,
        profitThreshold,
        popularityThreshold,
      );

      return {
        ...dish,
        number_sold: aggregatedSales.numberSold,
        popularity_percentage: aggregatedSales.popularityPercentage,
        profit_category: metrics.profitCategory,
        popularity_category: metrics.popularityCategory,
        menu_item_class: metrics.menuItemClass,
        food_cost: metrics.foodCost,
        contribution_margin: metrics.contributionMargin,
        gross_profit: metrics.grossProfitExclGST, // Gross profit excluding GST
        gross_profit_percentage: dish.profit_margin ?? 0,
      };
    });

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
        // Note: Profit average includes ALL dishes (profit exists regardless of sales)
        // Popularity average includes ONLY dishes with sales (can't calculate without sales)
        // Final output includes ALL dishes (items without sales are valuable insights)
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
