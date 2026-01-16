/**
 * Query builder helper for cleaning tasks
 */

import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';

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

export interface CleaningTasksQueryParams {
  areaId?: string | null;
  equipmentId?: string | null;
  sectionId?: string | null;
  frequencyType?: string | null;
  status?: string | null;
  date?: string | null;
}

/**
 * Builds a Supabase query for cleaning tasks with filters
 *
 * @param {CleaningTasksQueryParams} params - Query parameters
 */
export function buildCleaningTasksQuery(params: CleaningTasksQueryParams) {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError(
      'Supabase admin client not initialized',
      'DATABASE_ERROR',
      500,
    );
  }

  let query = supabaseAdmin.from('cleaning_tasks').select(CLEANING_TASKS_SELECT);

  // Apply filters
  if (params.areaId) query = query.eq('area_id', params.areaId);
  if (params.equipmentId) query = query.eq('equipment_id', params.equipmentId);
  if (params.sectionId) query = query.eq('section_id', params.sectionId);
  if (params.frequencyType) query = query.eq('frequency_type', params.frequencyType);
  if (params.status) query = query.eq('status', params.status);
  if (params.date) query = query.eq('assigned_date', params.date);

  // Order by task name
  query = query.order('task_name', { ascending: true });

  return query;
}
