/**
 * Shared types for cleaning records export/print utilities.
 * Extracted to avoid circular dependencies.
 */

import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

export interface CleaningRecordExportData {
  tasks: TaskWithCompletions[];
  dateRange?: {
    start: string;
    end: string;
  };
  statusFilter?: 'all' | 'completed' | 'pending' | 'overdue';
}

export interface CleaningRecord {
  task: TaskWithCompletions;
  date: string;
  status: { status: string; color: string; completedDate?: string };
}
