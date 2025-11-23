'use client';

import { useMemo, useState, useCallback } from 'react';
import { MemoizedTaskRow } from './TaskRow';
import { MemoizedDayHeader } from './DayHeader';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useNotification } from '@/contexts/NotificationContext';
import { Icon } from '@/components/ui/Icon';
import { ClipboardCheck } from 'lucide-react';
import { logger } from '@/lib/logger';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

type GridFilter = 'today' | 'next2days' | 'week' | 'all';

interface CleaningGridProps {
  tasks: TaskWithCompletions[];
  startDate: Date;
  endDate: Date;
  filter?: GridFilter;
  onTaskUpdate?: () => void;
  onCreateTask?: () => void;
}

/**
 * Cleaning Grid Component
 * Displays a 14-day calendar grid with tasks as rows and days as columns
 */
export function CleaningGrid({
  tasks,
  startDate,
  endDate,
  filter = 'all',
  onTaskUpdate,
  onCreateTask,
}: CleaningGridProps) {
  const { showSuccess, showError } = useNotification();
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());

  // Calculate filtered date range based on filter type
  const { filteredStartDate, filteredEndDate, dates } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredStart: Date;
    let filteredEnd: Date;

    switch (filter) {
      case 'today':
        filteredStart = new Date(today);
        filteredEnd = new Date(today);
        break;
      case 'next2days':
        filteredStart = new Date(today);
        filteredEnd = new Date(today);
        filteredEnd.setDate(filteredEnd.getDate() + 2);
        break;
      case 'week':
        filteredStart = new Date(today);
        filteredEnd = new Date(today);
        filteredEnd.setDate(filteredEnd.getDate() + 6); // Today + 6 days = 7 days total
        break;
      case 'all':
      default:
        filteredStart = new Date(startDate);
        filteredEnd = new Date(endDate);
        break;
    }

    const dateArray: string[] = [];
    const current = new Date(filteredStart);
    const end = new Date(filteredEnd);

    while (current <= end) {
      dateArray.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return {
      filteredStartDate: filteredStart,
      filteredEndDate: filteredEnd,
      dates: dateArray,
    };
  }, [filter, startDate, endDate]);

  // Get today's date for highlighting
  const today = useMemo(() => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return todayDate.toISOString().split('T')[0];
  }, []);

  // Pre-compute Date objects for all dates to avoid repeated instantiation
  const dateObjects = useMemo(() => {
    return dates.map(date => new Date(date));
  }, [dates]);

  const handleToggleCompletion = useCallback(
    async (taskId: string, date: string, isCompleted: boolean) => {
      // Optimistic update
      setUpdatingTasks(prev => new Set(prev).add(`${taskId}_${date}`));

      try {
        const endpoint = isCompleted
          ? `/api/cleaning-tasks/${taskId}/uncomplete`
          : `/api/cleaning-tasks/${taskId}/complete`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completion_date: date }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || data.message || 'Failed to update task');
        }

        showSuccess(isCompleted ? 'Task marked as incomplete' : 'Task marked as complete');
        onTaskUpdate?.();
      } catch (error) {
        logger.error('Error toggling task completion:', error);
        showError(
          isCompleted ? 'Failed to mark task as incomplete' : 'Failed to mark task as complete',
        );
      } finally {
        setUpdatingTasks(prev => {
          const next = new Set(prev);
          next.delete(`${taskId}_${date}`);
          return next;
        });
      }
    },
    [showSuccess, showError, onTaskUpdate],
  );

  if (tasks.length === 0) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
          <Icon icon={ClipboardCheck} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">No cleaning tasks yet</h3>
        <p className="mb-6 text-gray-400">
          Create your first cleaning task to start tracking your cleaning schedule.
        </p>
        <div className="tablet:flex-row tablet:justify-center flex flex-col gap-3">
          <button
            onClick={() => onCreateTask?.()}
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
          >
            Create Your First Task
          </button>
          <p className="flex items-center justify-center text-sm text-gray-500">
            Press <kbd className="mx-1 rounded bg-[#2a2a2a] px-2 py-1 text-xs">N</kbd> for quick
            create
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
      {/* Sticky header with day headers */}
      <div className="sticky top-0 z-20 flex border-b border-[#2a2a2a] bg-[#1f1f1f]">
        {/* Empty cell for task name column */}
        <div className="desktop:min-w-[280px] desktop:max-w-[280px] sticky left-0 z-30 max-w-[220px] min-w-[220px] border-r border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3">
          <div className="text-sm font-medium text-gray-400">Task</div>
          {dates.length > 0 && (
            <div className="mt-1 text-xs text-gray-500">
              {dates.length} {dates.length === 1 ? 'day' : 'days'}
            </div>
          )}
        </div>

        {/* Day headers */}
        <div className="flex flex-1">
          {dates.map((date, index) => (
            <MemoizedDayHeader key={date} date={dateObjects[index]} isToday={date === today} />
          ))}
        </div>
      </div>

      {/* Task rows */}
      <div className="max-h-[600px] overflow-y-auto">
        {tasks.map(task => (
          <MemoizedTaskRow
            key={task.id}
            task={task}
            dates={dates}
            onToggleCompletion={handleToggleCompletion}
          />
        ))}
      </div>
    </div>
  );
}
