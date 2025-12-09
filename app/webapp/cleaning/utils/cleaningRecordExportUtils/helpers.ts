/**
 * Helper functions for cleaning record export utilities
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
 * @returns {string} Task status ('Completed', 'Overdue', or 'Pending')
 */
export function getTaskStatusForDate(task: TaskWithCompletions, date: string): string {
  const completion = task.completions.find(c => c.completion_date === date);

  if (completion) {
    return 'Completed';
  }

  // Check if overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(date);

  if (taskDate < today) {
    return 'Overdue';
  }

  return 'Pending';
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
 * Calculate total records count from tasks
 *
 * @param {TaskWithCompletions[]} tasks - Array of cleaning tasks
 * @param {Object} dateRange - Optional date range
 * @param {string} dateRange.start - Start date
 * @param {string} dateRange.end - End date
 * @returns {number} Total records count
 */
export function calculateTotalRecords(
  tasks: TaskWithCompletions[],
  dateRange?: { start: string; end: string },
): number {
  return tasks.reduce((sum, task) => {
    if (!task.frequency_type) return sum;
    const dates = new Set<string>();
    task.completions.forEach(c => dates.add(c.completion_date));
    if (dateRange) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      const current = new Date(start);
      while (current <= end) {
        dates.add(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    }
    return sum + dates.size;
  }, 0);
}
