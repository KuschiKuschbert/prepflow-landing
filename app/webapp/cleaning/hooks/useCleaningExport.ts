'use client';

import { type ExportFormat } from '@/components/ui/ExportButton';
import { useNotification } from '@/contexts/NotificationContext';
import { getTaskDatesWithStatus, type TaskWithCompletions } from '@/lib/cleaning/completion-logic';
import { logger } from '@/lib/logger';
import { useState } from 'react';
import {
  exportCleaningScheduleToCSV,
  exportCleaningScheduleToHTML,
  exportCleaningScheduleToPDF,
} from '../utils/exportCleaningSchedules';
import { printCleaningSchedule, type CleaningTask } from '../utils/printCleaningSchedule';

interface UseCleaningExportProps {
  tasks: TaskWithCompletions[];
  startDate: Date;
  endDate: Date;
}

export function useCleaningExport({ tasks, startDate, endDate }: UseCleaningExportProps) {
  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);

  const prepareTasksForExport = (tasksToExport: TaskWithCompletions[]): CleaningTask[] => {
    const flatTasks: CleaningTask[] = [];

    tasksToExport.forEach(task => {
      const dates = getTaskDatesWithStatus(task, startDate.toISOString(), endDate.toISOString());

      dates.forEach(d => {
        if (!d.shouldAppear) return;

        const completion = task.completions.find(c => c.completion_date === d.date);

        flatTasks.push({
          id: task.id,
          area_id: task.area_id || '',
          assigned_date: d.date,
          completed_date: completion?.completed_at || null,
          status: d.isCompleted ? 'completed' : d.isOverdue ? 'overdue' : 'pending',
          notes: completion?.notes || null,
          photo_url: completion?.photo_url || null,
          created_at: task.created_at,
          updated_at: task.created_at,
          cleaning_areas: {
            id: task.cleaning_areas?.id || '',
            name: task.cleaning_areas?.area_name || 'Unknown Area',
            description: task.cleaning_areas?.description || '',
            frequency_days: task.cleaning_areas?.frequency_days || 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        });
      });
    });

    return flatTasks;
  };

  const handlePrint = () => {
    if (tasks.length === 0) {
      showError('No cleaning tasks to print');
      return;
    }

    try {
      const exportTasks = prepareTasksForExport(tasks);
      printCleaningSchedule(exportTasks, startDate, endDate);
      showSuccess('Cleaning schedule opened for printing');
    } catch (err) {
      logger.error('[Cleaning Schedule] Print error:', err);
      showError('Failed to print cleaning schedule.');
    }
  };

  const handleExport = async (format: ExportFormat) => {
    if (tasks.length === 0) {
      showError('No cleaning tasks to export');
      return;
    }

    setExportLoading(format);
    try {
      const exportTasks = prepareTasksForExport(tasks);
      switch (format) {
        case 'csv':
          exportCleaningScheduleToCSV(exportTasks);
          showSuccess('Cleaning schedule exported to CSV');
          break;
        case 'html':
          exportCleaningScheduleToHTML(exportTasks, startDate, endDate);
          showSuccess('Cleaning schedule exported to HTML');
          break;
        case 'pdf':
          await exportCleaningScheduleToPDF(exportTasks, startDate, endDate);
          showSuccess('Cleaning schedule exported to PDF');
          break;
      }
    } catch (err) {
      logger.error(`[Cleaning Schedule] Export error (${format}):`, err);
      showError(`Failed to export cleaning schedule to ${format.toUpperCase()}.`);
    } finally {
      setExportLoading(null);
    }
  };

  return {
    exportLoading,
    handlePrint,
    handleExport,
  };
}
