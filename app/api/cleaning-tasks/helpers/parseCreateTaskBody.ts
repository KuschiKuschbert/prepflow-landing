/**
 * Helper for parsing create task request body
 */

import type { CreateTaskBody } from './validateCleaningTaskRequest';

/**
 * Parses and extracts create task data from request body
 *
 * @param {any} body - Raw request body
 * @returns {CreateTaskBody} Parsed task data
 */
export function parseCreateTaskBody(body: unknown): CreateTaskBody {
  const data = body as Record<string, unknown>;
  return {
    task_name: data.task_name as string,
    frequency_type: data.frequency_type as string,
    area_id: data.area_id as string | undefined,
    assigned_date: data.assigned_date as string | undefined,
    equipment_id: data.equipment_id as string | undefined,
    section_id: data.section_id as string | undefined,
    is_standard_task: data.is_standard_task as boolean | undefined,
    standard_task_type: data.standard_task_type as string | undefined,
    description: data.description as string | undefined,
    notes: data.notes as string | undefined,
  };
}
