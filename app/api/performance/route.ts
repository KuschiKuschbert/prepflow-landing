import { ApiErrorHandler } from '@/lib/api-error-handler';
import { evaluateGate } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { handlePerformanceError } from './helpers/handlePerformanceError';
import { processPerformanceData } from './helpers/processPerformanceData';
import { upsertSalesData } from './helpers/upsertSalesData';

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

    // Get date range and menu filter from query parameters
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const menuIdParam = searchParams.get('menuId');
    const lockedMenuOnly = searchParams.get('lockedMenuOnly') === 'true';

    // If filtering by locked menu, find the locked menu first
    let targetMenuId: string | null = menuIdParam || null;
    if (lockedMenuOnly && !targetMenuId) {
      const { data: lockedMenu, error: lockedMenuError } = await supabaseAdmin
        .from('menus')
        .select('id')
        .eq('is_locked', true)
        .single();

      if (lockedMenuError) {
        logger.error('[Performance API] Error fetching locked menu:', {
          error: lockedMenuError.message,
          code: (lockedMenuError as unknown).code,
          context: { endpoint: '/api/performance', operation: 'GET' },
        });
      } else if (lockedMenu) {
        targetMenuId = lockedMenu.id;
        logger.dev('[Performance API] Filtering by locked menu:', { menuId: targetMenuId });
      } else {
        logger.dev('[Performance API] No locked menu found, showing all dishes');
      }
    }

    // Build base query
    let dishesQuery = supabaseAdmin.from('menu_dishes').select(
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

    // Filter by menu if menuId is provided
    if (targetMenuId) {
      // Get dish IDs from menu_items for this menu
      const { data: menuItems, error: menuItemsError } = await supabaseAdmin
        .from('menu_items')
        .select('dish_id')
        .eq('menu_id', targetMenuId)
        .not('dish_id', 'is', null);

      if (menuItemsError) {
        logger.error('[Performance API] Error fetching menu items:', {
          error: menuItemsError.message,
          code: (menuItemsError as unknown).code,
          context: { endpoint: '/api/performance', operation: 'GET', menuId: targetMenuId },
        });
        // Continue without filtering if there's an error
      } else if (menuItems && menuItems.length > 0) {
        const dishIds = menuItems.map(item => item.dish_id).filter(Boolean) as string[];
        dishesQuery = dishesQuery.in('id', dishIds);
        logger.dev('[Performance API] Filtering dishes by menu:', {
          menuId: targetMenuId,
          dishCount: dishIds.length,
        });
      } else {
        // No dishes in this menu, return empty result
        logger.dev('[Performance API] No dishes found in menu:', { menuId: targetMenuId });
        return NextResponse.json({
          success: true,
          data: [],
          message: 'No dishes found in the specified menu',
          metadata: {
            methodology: 'PrepFlow COGS Dynamic',
            filteredByMenu: targetMenuId,
          },
        });
      }
    }

    const { data: dishes, error: dishesError } = await dishesQuery.order('created_at', {
      ascending: false,
    });

    if (dishesError) {
      logger.error('[Performance API] Database error fetching dishes:', {
        error: dishesError.message,
        code: (dishesError as unknown).code,
        context: { endpoint: '/api/performance', operation: 'GET', table: 'menu_dishes' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dishesError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Process performance data
    const { performanceData, metadata } = processPerformanceData(
      dishes || [],
      startDateParam,
      endDateParam,
    );

    return NextResponse.json({
      success: true,
      data: performanceData,
      message: 'Performance data retrieved successfully',
      metadata,
    });
  } catch (err) {
    logger.error('[Performance API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/performance', method: 'GET' },
    });
    return handlePerformanceError(err, 'GET');
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

    const data = await upsertSalesData({
      dish_id,
      number_sold,
      popularity_percentage,
      date,
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Sales data updated successfully',
    });
  } catch (err: unknown) {
    logger.error('[Performance API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/performance', method: 'POST' },
    });
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handlePerformanceError(err, 'POST');
  }
}
