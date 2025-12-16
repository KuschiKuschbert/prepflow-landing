/**
 * Helper for handling GET requests for cleaning tasks
 */

import { NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { buildCleaningTasksQuery } from './buildCleaningTasksQuery';
import { fetchTasksWithCompletions } from './fetchTasksWithCompletions';
import { fetchPaginatedTasks } from './fetchPaginatedTasks';

export interface GetRequestParams {
  startDate: string | null;
  endDate: string | null;
  areaId: string | null;
  equipmentId: string | null;
  sectionId: string | null;
  frequencyType: string | null;
  status: string | null;
  date: string | null;
  page: number;
  pageSize: number;
}

/**
 * Handles GET request for cleaning tasks
 *
 * @param {GetRequestParams} params - Request parameters
 * @returns {Promise<NextResponse>} Response with tasks data
 */
export async function handleGetRequest(params: GetRequestParams): Promise<NextResponse> {
  // Build query with filters
  const query = buildCleaningTasksQuery({
    areaId: params.areaId,
    equipmentId: params.equipmentId,
    sectionId: params.sectionId,
    frequencyType: params.frequencyType,
    status: params.status,
    date: params.date,
  });

  // If date range provided, fetch tasks with completions
  if (params.startDate && params.endDate) {
    try {
      const tasksWithCompletions = await fetchTasksWithCompletions(
        params.startDate,
        params.endDate,
        query,
      );

      return NextResponse.json({
        success: true,
        data: tasksWithCompletions,
        total: tasksWithCompletions.length,
      });
    } catch (err: any) {
      const apiError = ApiErrorHandler.fromSupabaseError(err, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }
  }

  // Legacy pagination support (when no date range)
  try {
    const { data, total } = await fetchPaginatedTasks(query, params.page, params.pageSize);

    return NextResponse.json({
      success: true,
      data,
      total,
    });
  } catch (err: any) {
    const apiError = ApiErrorHandler.fromSupabaseError(err, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}



