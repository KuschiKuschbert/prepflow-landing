import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

const CLEANING_TASKS_SELECT = `
  *,
  cleaning_areas (
    id,
    area_name,
    description,
    cleaning_frequency
  ),
  temperature_equipment:equipment_id (
    id,
    name,
    equipment_type,
    location
  ),
  kitchen_sections:section_id (
    id,
    section_name,
    description
  )
`;

/**
 * Create a cleaning task.
 *
 * @param {Object} taskData - Cleaning task data
 * @returns {Promise<Object>} Created cleaning task
 * @throws {Error} If creation fails
 */
export async function createCleaningTask(taskData: {
  task_name?: string;
  frequency_type?: string;
  area_id?: string;
  assigned_date?: string;
  equipment_id?: string | null;
  section_id?: string | null;
  is_standard_task?: boolean;
  standard_task_type?: string | null;
  description?: string | null;
  notes?: string | null;
}) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  // Build insert data
  const insertData: any = {
    status: 'pending',
  };

  // Area is required (either new or legacy)
  if (taskData.area_id) insertData.area_id = taskData.area_id;

  // New schema fields
  if (taskData.task_name) insertData.task_name = taskData.task_name;
  if (taskData.frequency_type) insertData.frequency_type = taskData.frequency_type;
  if (taskData.equipment_id) insertData.equipment_id = taskData.equipment_id;
  if (taskData.section_id) insertData.section_id = taskData.section_id;
  if (taskData.is_standard_task !== undefined)
    insertData.is_standard_task = taskData.is_standard_task;
  if (taskData.standard_task_type) insertData.standard_task_type = taskData.standard_task_type;
  if (taskData.description) insertData.description = taskData.description;

  // Legacy schema fields (for backward compatibility)
  if (taskData.assigned_date) insertData.assigned_date = taskData.assigned_date;
  if (taskData.notes) insertData.notes = taskData.notes;

  // First try insert without SELECT to see if insert itself works
  const { data: insertResult, error: insertError } = await supabaseAdmin
    .from('cleaning_tasks')
    .insert(insertData)
    .select('id, task_name, frequency_type, area_id, description, equipment_id, section_id')
    .single();

  if (insertError) {
    logger.error('[Cleaning Tasks API] Database error inserting task:', {
      error: insertError.message,
      code: (insertError as any).code,
      details: (insertError as any).details,
      hint: (insertError as any).hint,
      insertData,
      context: { endpoint: '/api/cleaning-tasks', operation: 'POST', table: 'cleaning_tasks' },
    });
    throw ApiErrorHandler.fromSupabaseError(insertError, 500);
  }

  // Now fetch with full joins
  const { data, error } = await supabaseAdmin
    .from('cleaning_tasks')
    .select(CLEANING_TASKS_SELECT)
    .eq('id', insertResult.id)
    .single();

  if (error) {
    logger.error('[Cleaning Tasks API] Database error fetching created task:', {
      error: error.message,
      code: (error as any).code,
      details: (error as any).details,
      hint: (error as any).hint,
      taskId: insertResult.id,
      context: { endpoint: '/api/cleaning-tasks', operation: 'POST', table: 'cleaning_tasks' },
    });
    // Return the basic data if SELECT fails (at least the insert worked)
    return insertResult;
  }

  return data;
}
