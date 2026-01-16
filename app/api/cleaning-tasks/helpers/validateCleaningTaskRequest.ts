/**
 * Validation helpers for cleaning task requests
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';

import { CreateCleaningTaskInput } from './types';

/**
 * Validates create cleaning task request body
 *
 * @param {CreateCleaningTaskInput} body - Request body
 * @returns {NextResponse | null} Error response if validation fails, null if valid
 */
export function validateCreateTaskRequest(body: CreateCleaningTaskInput): NextResponse | null {
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
