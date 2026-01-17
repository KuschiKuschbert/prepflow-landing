/**
 * Helper for parsing create task request body
 */

import { CreateCleaningTaskInput } from './types';

/**
 * Parses and extracts create task data from request body
 *
 * @param {unknown} body - Raw request body
 * @returns {CreateCleaningTaskInput} Parsed task data
 */
export function parseCreateTaskBody(body: unknown): CreateCleaningTaskInput {
  const data = body as Record<string, unknown>;
  return {
    task_name: typeof data.task_name === 'string' ? data.task_name : undefined,
    frequency_type: typeof data.frequency_type === 'string' ? data.frequency_type : undefined,
    area_id: typeof data.area_id === 'string' ? data.area_id : undefined,
    assigned_date: typeof data.assigned_date === 'string' ? data.assigned_date : undefined,
    equipment_id: typeof data.equipment_id === 'string' ? data.equipment_id : undefined,
    section_id: typeof data.section_id === 'string' ? data.section_id : undefined,
    is_standard_task:
      typeof data.is_standard_task === 'boolean' ? data.is_standard_task : undefined,
    standard_task_type:
      typeof data.standard_task_type === 'string' ? data.standard_task_type : undefined,
    description: typeof data.description === 'string' ? data.description : undefined,
    notes: typeof data.notes === 'string' ? data.notes : undefined,
  };
}
