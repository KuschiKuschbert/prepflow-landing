/**
 * Completion Logic for Cleaning Tasks
 * Handles checking completion status and calculating overdue tasks
 */

import { calculateTaskDates, FrequencyType } from './frequency-calculator';

export interface TaskCompletion {
  id: string;
  task_id: string;
  completion_date: string;
  completed_at: string;
  notes?: string | null;
  photo_url?: string | null;
}

export interface TaskWithCompletions {
  id: string;
  task_name?: string;
  frequency_type: FrequencyType;
  area_id?: string | null;
  equipment_id?: string | null;
  section_id?: string | null;
  is_standard_task?: boolean;
  standard_task_type?: string | null;
  description?: string | null;
  created_at: string;
  completions: TaskCompletion[];
  cleaning_areas?: {
    id: string;
    area_name: string;
    description?: string;
    frequency_days?: number;
  } | null;
  temperature_equipment?: {
    id: string;
    name: string;
    equipment_type: string;
    location?: string;
  } | null;
  kitchen_sections?: {
    id: string;
    name: string;
    description?: string;
  } | null;
}

/**
 * Check if a task is completed for a specific date
 *
 * @param task - Task with completions
 * @param date - Date to check (ISO date string)
 * @returns Completion record if completed, null otherwise
 */
export function getCompletionForDate(
  task: TaskWithCompletions,
  date: string,
): TaskCompletion | null {
  return task.completions.find(c => c.completion_date === date) || null;
}

/**
 * Check if a task should appear on a date and if it's completed
 *
 * @param task - Task with completions
 * @param date - Date to check (ISO date string)
 * @returns Object with shouldAppear and isCompleted flags
 */
export function getTaskStatusForDate(
  task: TaskWithCompletions,
  date: string,
): { shouldAppear: boolean; isCompleted: boolean; isOverdue: boolean } {
  // If no frequency_type, task doesn't appear (legacy tasks without frequency)
  if (!task.frequency_type) {
    return { shouldAppear: false, isCompleted: false, isOverdue: false };
  }

  const taskDate = new Date(date);
  const createdDate = task.created_at ? new Date(task.created_at) : undefined;

  // Check if task should appear on this date
  const shouldAppear = calculateTaskDates(
    task.frequency_type,
    taskDate,
    taskDate,
    createdDate,
  ).includes(date);

  if (!shouldAppear) {
    return { shouldAppear: false, isCompleted: false, isOverdue: false };
  }

  // Check if completed
  const completion = getCompletionForDate(task, date);
  const isCompleted = !!completion;

  // Check if overdue (should appear but not completed, and date is in the past)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  const isOverdue = !isCompleted && checkDate < today;

  return { shouldAppear: true, isCompleted, isOverdue };
}

/**
 * Get all dates in a range where a task should appear
 *
 * @param task - Task with completions
 * @param startDate - Start date (ISO date string)
 * @param endDate - End date (ISO date string)
 * @returns Array of dates with their status
 */
export function getTaskDatesWithStatus(
  task: TaskWithCompletions,
  startDate: string,
  endDate: string,
): Array<{ date: string; shouldAppear: boolean; isCompleted: boolean; isOverdue: boolean }> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const createdDate = task.created_at ? new Date(task.created_at) : undefined;

  const dates = calculateTaskDates(task.frequency_type, start, end, createdDate);

  return dates.map(date => {
    const status = getTaskStatusForDate(task, date);
    return {
      date,
      ...status,
    };
  });
}
