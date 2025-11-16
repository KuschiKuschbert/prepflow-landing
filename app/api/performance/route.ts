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
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const gate = evaluateGate('analytics', request);
    if (!gate.allowed) {
      return NextResponse.json(ApiErrorHandler.createError('Access denied', 'FORBIDDEN', 403), {
        status: 403,
      });
    }
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
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
      logger.error('[Performance API] Database error fetching dishes:', {
        error: dishesError.message,
        code: (dishesError as any).code,
        context: { endpoint: '/api/performance', operation: 'GET', table: 'menu_dishes' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dishesError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
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
  } catch (err) {
    logger.error('[Performance API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/performance', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dish_id, number_sold, popularity_percentage, date } = await request.json();

    if (!dish_id || !number_sold || !popularity_percentage) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'dish_id, number_sold, and popularity_percentage are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
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
      logger.error('[Performance API] Database error inserting sales data:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/performance', operation: 'POST', table: 'sales_data' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Sales data updated successfully',
    });
  } catch (err) {
    logger.error('[Performance API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/performance', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
