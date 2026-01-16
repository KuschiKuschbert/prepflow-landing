import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { generateAllStandardTasks } from '@/lib/cleaning/standard-tasks';

/**
 * POST /api/cleaning-tasks/populate-standard
 * Pre-populate standard cleaning tasks based on equipment and sections
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} Count of created tasks
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch areas (required)
    const { data: areas, error: areasError } = await supabaseAdmin
      .from('cleaning_areas')
      .select('id, area_name, description')
      .eq('is_active', true);

    if (areasError) {
      logger.error('[Cleaning Tasks API] Error fetching areas:', areasError);
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Failed to fetch cleaning areas. Please create at least one area first.',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    if (!areas || areas.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'No cleaning areas found. Please create at least one area first.',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Fetch equipment
    const { data: equipment, error: equipmentError } = await supabaseAdmin
      .from('temperature_equipment')
      .select('id, name, equipment_type, location')
      .eq('is_active', true);

    if (equipmentError && (equipmentError as unknown).code !== '42P01') {
      logger.error('[Cleaning Tasks API] Error fetching equipment:', {
        error: equipmentError.message,
        code: (equipmentError as unknown).code,
      });
    }

    // Fetch sections
    let sections: unknown[] = [];
    try {
      const { data: sectionsData, error: sectionsError } = await supabaseAdmin
        .from('kitchen_sections')
        .select('id, name, description');

      if (!sectionsError && sectionsData) {
        sections = sectionsData;
      } else if ((sectionsError as unknown).code !== '42P01') {
        logger.error('[Cleaning Tasks API] Error fetching sections:', {
          error: sectionsError.message,
          code: (sectionsError as unknown).code,
        });
      }
    } catch (err) {
      logger.warn('[Cleaning Tasks API] Kitchen sections table may not exist:', err);
    }

    // Generate standard tasks (requires areas)
    const equipmentList = equipment || [];
    const sectionList = sections || [];
    const tasksToCreate = generateAllStandardTasks(equipmentList, sectionList, areas);

    if (tasksToCreate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No standard tasks to create',
        data: { count: 0 },
      });
    }

    // Check which tasks already exist (by task_name and standard_task_type)
    const { data: existingTasksData, error: existingTasksError } = await supabaseAdmin
      .from('cleaning_tasks')
      .select('task_name, standard_task_type, equipment_id, section_id')
      .eq('is_standard_task', true);

    if (existingTasksError) {
      logger.warn('[Cleaning Tasks API] Error fetching existing tasks:', {
        error: existingTasksError.message,
        code: (existingTasksError as unknown).code,
      });
      // Continue with empty set if fetch fails
    }

    const existingTaskKeys = new Set<string>();
    if (existingTasksData) {
      existingTasksData.forEach((task: unknown) => {
        const key = `${task.task_name}_${task.standard_task_type}_${task.equipment_id || ''}_${task.section_id || ''}`;
        existingTaskKeys.add(key);
      });
    }

    // Filter out tasks that already exist
    const newTasks = tasksToCreate.filter(task => {
      const key = `${task.task_name}_${task.standard_task_type}_${task.equipment_id || ''}_${task.section_id || ''}`;
      return !existingTaskKeys.has(key);
    });

    if (newTasks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All standard tasks already exist',
        data: { count: 0 },
      });
    }

    // Insert new tasks
    const { data: insertedTasks, error: insertError } = await supabaseAdmin
      .from('cleaning_tasks')
      .insert(newTasks)
      .select();

    if (insertError) {
      logger.error('[Cleaning Tasks API] Error creating standard tasks:', {
        error: insertError.message,
        code: (insertError as unknown).code,
        context: { endpoint: '/api/cleaning-tasks/populate-standard', operation: 'POST' },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(insertError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Created ${insertedTasks?.length || 0} standard tasks`,
      data: {
        count: insertedTasks?.length || 0,
        tasks: insertedTasks,
      },
    });
  } catch (err: unknown) {
    logger.error('[Cleaning Tasks API] Error in populate-standard endpoint:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-tasks/populate-standard', method: 'POST' },
    });
    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: err.status || 500 });
    }
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Internal server error',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
