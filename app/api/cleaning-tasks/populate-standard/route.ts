import { ApiErrorHandler } from '@/lib/api-error-handler';
import { generateAllStandardTasks, KitchenSection } from '@/lib/cleaning/standard-tasks';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface ExistingTask {
  task_name: string;
  standard_task_type: string | null;
  equipment_id: string | null;
  section_id: string | null;
}

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(
    request.headers.get('Authorization')?.replace('Bearer ', '') || '',
  );

  // Fallback/Use Auth0 helper
  const { requireAuth } = await import('@/lib/auth0-api-helpers');
  const authUser = await requireAuth(request);

  // Get user_id from email
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single();

  if (userError || !userData) {
    throw ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404);
  }
  return { userId: userData.id, supabase: supabaseAdmin };
}

/**
 * POST /api/cleaning-tasks/populate-standard
 * Pre-populate standard cleaning tasks based on equipment and sections
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    // Fetch areas (required)
    const { data: areas, error: areasError } = await supabase
      .from('cleaning_areas')
      .select('id, area_name, description')
      .eq('user_id', userId)
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
    const { data: equipment, error: equipmentError } = await supabase
      .from('temperature_equipment')
      .select('id, name, equipment_type, location')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (equipmentError && equipmentError.code !== '42P01') {
      logger.error('[Cleaning Tasks API] Error fetching equipment:', {
        error: equipmentError.message,
        code: equipmentError.code,
      });
    }

    // Fetch sections
    let sections: KitchenSection[] = [];
    try {
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('kitchen_sections')
        .select('id, name, description')
        .eq('user_id', userId);

      if (!sectionsError && sectionsData) {
        sections = sectionsData as KitchenSection[];
      } else if (sectionsError.code !== '42P01') {
        logger.error('[Cleaning Tasks API] Error fetching sections:', {
          error: sectionsError.message,
          code: sectionsError.code,
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
    const { data: existingTasksData, error: existingTasksError } = await supabase
      .from('cleaning_tasks')
      .select('task_name, standard_task_type, equipment_id, section_id')
      .eq('user_id', userId)
      .eq('is_standard_task', true);

    if (existingTasksError) {
      logger.warn('[Cleaning Tasks API] Error fetching existing tasks:', {
        error: existingTasksError.message,
        code: existingTasksError.code,
      });
      // Continue with empty set if fetch fails
    }

    const existingTaskKeys = new Set<string>();
    if (existingTasksData) {
      (existingTasksData as ExistingTask[]).forEach(task => {
        const key = `${task.task_name}_${task.standard_task_type}_${task.equipment_id || ''}_${task.section_id || ''}`;
        existingTaskKeys.add(key);
      });
    }

    // Filter out tasks that already exist and assign userId
    const newTasks = tasksToCreate
      .filter(task => {
        const key = `${task.task_name}_${task.standard_task_type}_${task.equipment_id || ''}_${task.section_id || ''}`;
        return !existingTaskKeys.has(key);
      })
      .map(task => ({
        ...task,
        user_id: userId,
      }));

    if (newTasks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All standard tasks already exist',
        data: { count: 0 },
      });
    }

    // Insert new tasks
    const { data: insertedTasks, error: insertError } = await supabase
      .from('cleaning_tasks')
      .insert(newTasks)
      .select();

    if (insertError) {
      logger.error('[Cleaning Tasks API] Error creating standard tasks:', {
        error: insertError.message,
        code: insertError.code,
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
      const errorStatus = (err as { status: number }).status;
      return NextResponse.json(err, { status: errorStatus || 500 });
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
