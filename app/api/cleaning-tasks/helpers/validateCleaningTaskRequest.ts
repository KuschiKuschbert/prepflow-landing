/**
 * Validation helpers for cleaning task requests
 */

import { NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';

export interface CreateTaskBody {
  task_name?: string;
  frequency_type?: string;
  area_id?: string;
  assigned_date?: string;
  equipment_id?: string;
  section_id?: string;
  is_standard_task?: boolean;
  standard_task_type?: string;
  description?: string;
  notes?: string;
  assigned_to_employee_id?: string;
  assigned_by_employee_id?: string;
}

/**
 * Validates create cleaning task request body
 *
 * @param {CreateTaskBody} body - Request body
 * @returns {NextResponse | null} Error response if validation fails, null if valid
 */
export function validateCreateTaskRequest(body: CreateTaskBody): NextResponse | null {
  // Area is always required
  if (!body.area_id) {
    return NextResponse.json(
      ApiErrorHandler.createError('area_id is required', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  }

  // Task name and frequency type are required for new schema
  if (!body.task_name) {
    return NextResponse.json(
      ApiErrorHandler.createError('task_name is required', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  }

  if (!body.frequency_type) {
    return NextResponse.json(
      ApiErrorHandler.createError('frequency_type is required', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  }

  return null;
}
