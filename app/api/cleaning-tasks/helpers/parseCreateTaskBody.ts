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
  return {
    task_name: body.task_name,
    frequency_type: body.frequency_type,
    area_id: body.area_id,
    assigned_date: body.assigned_date,
    equipment_id: body.equipment_id,
    section_id: body.section_id,
    is_standard_task: body.is_standard_task,
    standard_task_type: body.standard_task_type,
    description: body.description,
    notes: body.notes,
  };
}
