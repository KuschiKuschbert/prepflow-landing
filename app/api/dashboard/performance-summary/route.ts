import { filterSalesDataByDateRange, parseDateRange } from '@/lib/api/performance/dateFiltering';
import { deduplicateDishes, filterDishesWithSales } from '@/lib/api/performance/dishDeduplication';
import { calculatePerformanceMetrics } from '@/lib/api/performance/performanceCalculation';
import { aggregateSalesData } from '@/lib/api/performance/salesAggregation';
import { logger } from '../../lib/logger';
import {
  calculateAveragePopularity,
  calculateAverageProfitMargin,
  calculateThresholds,
} from '@/lib/api/performance/thresholdCalculation';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Default to last 7 days for dashboard summary
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const today = new Date();

    const dateRange = {
      startDate: sevenDaysAgo,
      endDate: today,
    };

    // Fetch dishes with sales data
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('menu_dishes')
      .select(
        `
        id,
        name,
        selling_price,
        profit_margin,
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
      logger.error('Error fetching dishes:', dishesError);
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Could not retrieve menu dishes from database',
        },
        { status: 500 },
      );
    }

    // Filter sales_data by date range (last 7 days)
    const filteredDishes = dishes?.map((dish: any) => {
      if (!dish.sales_data || dish.sales_data.length === 0) return dish;
      return {
        ...dish,
        sales_data: filterSalesDataByDateRange(dish.sales_data, dateRange),
      };
    });

    // Remove duplicates
    const uniqueDishes = deduplicateDishes(filteredDishes || []);

    // Filter dishes with sales data
    const dishesWithSales = filterDishesWithSales(filteredDishes || []);

    // Calculate thresholds
    const averageProfitMargin = calculateAverageProfitMargin(uniqueDishes);
    const averagePopularity = calculateAveragePopularity(dishesWithSales, dateRange);
    const { profitThreshold, popularityThreshold } = calculateThresholds(
      averageProfitMargin,
      averagePopularity,
    );

    // Calculate performance data
    const performanceData = uniqueDishes.map(dish => {
      const aggregatedSales = aggregateSalesData(dish.sales_data, dateRange);
      const metrics = calculatePerformanceMetrics(
        dish,
        aggregatedSales,
        profitThreshold,
        popularityThreshold,
      );

      return {
        id: dish.id,
        name: dish.name,
        selling_price: dish.selling_price,
        number_sold: aggregatedSales.numberSold,
        popularity_percentage: aggregatedSales.popularityPercentage,
        profit_category: metrics.profitCategory,
        popularity_category: metrics.popularityCategory,
        menu_item_class: metrics.menuItemClass,
        gross_profit: metrics.grossProfitExclGST,
        gross_profit_percentage: dish.profit_margin ?? 0,
      };
    });

    // Filter items with sales (number_sold > 0)
    const itemsWithSales = performanceData.filter(item => item.number_sold > 0);

    // Top 3 selling items (by number_sold)
    const topSellers = [...itemsWithSales]
      .sort((a, b) => b.number_sold - a.number_sold)
      .slice(0, 3)
      .map(item => ({
        id: item.id,
        name: item.name,
        number_sold: item.number_sold,
        menu_item_class: item.menu_item_class,
      }));

    // Bottom 3 items (lowest sales)
    const bottomSellers = [...itemsWithSales]
      .sort((a, b) => a.number_sold - b.number_sold)
      .slice(0, 3)
      .map(item => ({
        id: item.id,
        name: item.name,
        number_sold: item.number_sold,
        menu_item_class: item.menu_item_class,
      }));

    // Hidden gems (high profit, low sales - promotion opportunities)
    const hiddenGems = itemsWithSales
      .filter(
        item =>
          item.profit_category === 'High' &&
          item.popularity_category === 'Low' &&
          item.menu_item_class === 'Hidden Gem',
      )
      .sort((a, b) => b.gross_profit_percentage - a.gross_profit_percentage)
      .slice(0, 3)
      .map(item => ({
        id: item.id,
        name: item.name,
        gross_profit_percentage: item.gross_profit_percentage,
        number_sold: item.number_sold,
      }));

    // Category counts - ensure all dishes are included, even those without sales
    // Verify all dishes have a menu_item_class assigned
    const categoryCounts = {
      chefsKiss: performanceData.filter(item => item.menu_item_class === "Chef's Kiss").length,
      hiddenGem: performanceData.filter(item => item.menu_item_class === 'Hidden Gem').length,
      bargainBucket: performanceData.filter(item => item.menu_item_class === 'Bargain Bucket')
        .length,
      burntToast: performanceData.filter(item => item.menu_item_class === 'Burnt Toast').length,
    };

    // Debug: Log if any dishes don't have a category assigned
    const dishesWithoutCategory = performanceData.filter(item => !item.menu_item_class);
    if (dishesWithoutCategory.length > 0) {
      logger.warn(`Warning: ${dishesWithoutCategory.length} dishes without category assignment`);
    }

    return NextResponse.json({
      success: true,
      topSellers,
      bottomSellers,
      hiddenGems,
      categoryCounts,
      dateRange: {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    logger.error('Error in performance summary API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}
