/**
 * Helper functions for formatting cleaning records for print
 */

import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

/**
 * Get area name for a task
 *
 * @param {TaskWithCompletions} task - Cleaning task
 * @returns {string} Area name
 */
export function getAreaName(task: TaskWithCompletions): string {
  if (task.cleaning_areas?.area_name) {
    return task.cleaning_areas.area_name;
  }
  if (task.temperature_equipment?.name) {
    return `Equipment: ${task.temperature_equipment.name}`;
  }
  if (task.kitchen_sections?.name) {
    return `Section: ${task.kitchen_sections.name}`;
  }
  return 'Unknown';
}

/**
 * Get task status for a specific date
 *
 * @param {TaskWithCompletions} task - Cleaning task
 * @param {string} date - Date string
 * @returns {Object} Status object with status, color, and optional completedDate
 */
export function getTaskStatusForDate(
  task: TaskWithCompletions,
  date: string,
): { status: string; color: string; completedDate?: string } {
  const completion = task.completions.find(c => c.completion_date === date);

  if (completion) {
    return {
      status: 'Completed',
      color: '#10b981',
      completedDate: completion.completed_at || completion.completion_date,
    };
  }

  // Check if overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(date);

  if (taskDate < today) {
    return { status: 'Overdue', color: 'var(--color-error)' };
  }

  return { status: 'Pending', color: '#f59e0b' };
}

/**
 * Format date for display
 *
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format frequency type for display
 *
 * @param {string} frequencyType - Frequency type
 * @returns {string} Formatted frequency type
 */
export function formatFrequencyType(frequencyType: string): string {
  const frequencyMap: Record<string, string> = {
    daily: 'Daily',
    'bi-daily': 'Bi-Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    '3-monthly': '3-Monthly',
  };
  return frequencyMap[frequencyType] || frequencyType;
}
