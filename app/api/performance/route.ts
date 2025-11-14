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

    // Get date range from query parameters
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Build sales_data query with optional date filtering
    let salesDataQuery = supabaseAdmin
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
      );

    // Apply date filter to sales_data if dates are provided
    if (startDateParam || endDateParam) {
      // We'll filter in JavaScript since Supabase nested filtering is limited
      // For now, fetch all and filter client-side
    }

    const { data: dishes, error: dishesError } = await salesDataQuery.order('created_at', {
      ascending: false,
    });

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
    let filteredDishes = dishes;
    if (startDateParam || endDateParam) {
      const startDate = startDateParam ? new Date(startDateParam) : null;
      const endDate = endDateParam ? new Date(endDateParam) : null;
      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);

      filteredDishes = dishes?.map((dish: any) => {
        if (!dish.sales_data || dish.sales_data.length === 0) return dish;

        const filteredSalesData = dish.sales_data.filter((sale: any) => {
          const saleDate = new Date(sale.date);
          if (startDate && saleDate < startDate) return false;
          if (endDate && saleDate > endDate) return false;
          return true;
        });

        return {
          ...dish,
          sales_data: filteredSalesData,
        };
      });
    }

    // Filter dishes with sales data for analysis
    const dishesWithSales =
      filteredDishes?.filter(dish => dish.sales_data && dish.sales_data.length > 0) || [];

    // Remove duplicates by keeping only the most recent entry for each dish name
    const uniqueDishes =
      filteredDishes?.reduce((acc: any[], dish: any) => {
        const existingDish = acc.find((d: any) => d.name === dish.name);
        if (!existingDish || new Date(dish.created_at) > new Date(existingDish.created_at)) {
          // Remove existing entry if it exists
          const filteredAcc = acc.filter((d: any) => d.name !== dish.name);
          return [...filteredAcc, dish];
        }
        return acc;
      }, [] as any[]) || [];

    // PrepFlow COGS Methodology - Dynamic thresholds based on menu averages
    //
    // Profit Average: Includes ALL dishes (even without sales) because:
    // - Profit margin exists regardless of sales volume (cost vs selling price)
    // - Items that don't sell still need profit analysis to identify opportunities
    // - "Hidden Gems" (high profit, no sales) are opportunities to market better
    // - "Burnt Toast" (low profit, no sales) should be removed
    const averageProfitMargin =
      uniqueDishes.length > 0
        ? uniqueDishes.reduce((sum, dish) => {
            // Handle null/undefined profit_margin - exclude from average calculation
            const profitMargin = dish.profit_margin ?? 0;
            return sum + profitMargin;
          }, 0) / uniqueDishes.length
        : 70.0; // Default fallback average for empty menus

    // Popularity Average: Includes ONLY dishes with sales data because:
    // - Can't calculate popularity percentage without sales data
    // - Items without sales automatically get LOW popularity category
    const averagePopularity =
      dishesWithSales.length > 0
        ? dishesWithSales.reduce((sum, dish) => {
            const sortedSalesData = dish.sales_data
              ? [...dish.sales_data].sort((a, b) => {
                  const dateA = new Date(a.date).getTime();
                  const dateB = new Date(b.date).getTime();
                  return dateB - dateA; // Descending order (newest first)
                })
              : [];

            if (startDateParam || endDateParam) {
              // Average popularity over date range
              const avgPopularity =
                sortedSalesData.reduce((s, sale) => s + (sale.popularity_percentage || 0), 0) /
                Math.max(1, sortedSalesData.length);
              return sum + avgPopularity;
            } else {
              // Use most recent entry (backward compatibility)
              const latestSales = sortedSalesData[0];
              return sum + (latestSales?.popularity_percentage || 0);
            }
          }, 0) / dishesWithSales.length
        : 8.3; // Default fallback average for menus with no sales data

    // Dynamic thresholds based on PrepFlow methodology
    // Profit: HIGH if above menu average (items "making you smile at the bank")
    const profitThreshold = averageProfitMargin;
    // Popularity: HIGH if ≥ 80% of average popularity (items "selling like hot chips")
    const popularityThreshold = averagePopularity * 0.8;

    const performanceData =
      uniqueDishes
        .map(dish => {
          // Aggregate sales_data over the date range
          // If date range is provided, sum up all sales in that range
          // Otherwise, use most recent entry (backward compatibility)
          const sortedSalesData = dish.sales_data
            ? [...dish.sales_data].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return dateB - dateA; // Descending order (newest first)
              })
            : [];

          let numberSold = 0;
          let popularityPercentage = 0;
          const hasSalesData = sortedSalesData.length > 0;

          if (hasSalesData) {
            if (startDateParam || endDateParam) {
              // Aggregate over date range: sum number_sold, average popularity_percentage
              const totalSold = sortedSalesData.reduce((sum, sale) => sum + (sale.number_sold || 0), 0);
              const avgPopularity =
                sortedSalesData.reduce((sum, sale) => sum + (sale.popularity_percentage || 0), 0) /
                sortedSalesData.length;
              numberSold = totalSold;
              popularityPercentage = avgPopularity;
            } else {
              // Use most recent entry (backward compatibility)
              const latestSales = sortedSalesData[0];
              numberSold = latestSales?.number_sold || 0;
              popularityPercentage = latestSales?.popularity_percentage || 0;
            }
          }

          // Handle null/undefined profit_margin - default to 0 for calculation purposes
          const profitMargin = dish.profit_margin ?? 0;

          // Calculate food cost and contribution margin (PrepFlow's key metric)
          // In PrepFlow Excel: profit_margin is actually gross profit percentage
          // Food cost = selling price * (100 - profit_margin) / 100
          const foodCost = (dish.selling_price * (100 - profitMargin)) / 100;
          const contributionMargin = dish.selling_price - foodCost;

          // Calculate gross profit excluding GST (PrepFlow standard)
          // Assuming 10% GST rate for Australia
          const gstRate = 0.1;
          const grossProfitExclGST = contributionMargin / (1 + gstRate);

          // Calculate Profit Category: HIGH if above menu average, LOW if below
          // Edge case: Negative profit margins are always LOW (never "making you smile")
          let profitCategory: string;
          if (profitMargin < 0) {
            profitCategory = 'Low'; // Negative profit is always LOW
          } else if (dish.profit_margin === null || dish.profit_margin === undefined) {
            profitCategory = 'Low'; // Null/undefined profit_margin defaults to LOW
          } else {
            // HIGH if ≥ average (items at average still "making you smile at the bank")
            profitCategory = profitMargin >= profitThreshold ? 'High' : 'Low';
          }

          // Calculate Popularity Category: HIGH if ≥ 80% of average popularity, LOW if below
          // Edge case: Items without sales data automatically get LOW popularity
          let popularityCategory: string;
          if (!hasSalesData) {
            popularityCategory = 'Low'; // No sales = no popularity
          } else if (popularityPercentage === null || popularityPercentage === undefined) {
            popularityCategory = 'Low'; // Null/undefined defaults to LOW
          } else {
            // HIGH if ≥ 80% threshold (items at threshold still "selling like hot chips")
            popularityCategory = popularityPercentage >= popularityThreshold ? 'High' : 'Low';
          }

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
            gross_profit_percentage: profitMargin,
          };
        })
        // Include ALL dishes in performance analysis (even those without sales)
        // Items without sales will be categorized as "Hidden Gem" (high profit, low popularity)
        // or "Burnt Toast" (low profit, low popularity) - both are valuable insights
        || [];

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
