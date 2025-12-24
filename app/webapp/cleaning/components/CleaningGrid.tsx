'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
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
  // Optimistic completions: Map<`${taskId}_${date}`, { completed: boolean, tempId?: string }>
  const [optimisticCompletions, setOptimisticCompletions] = useState<
    Map<string, { completed: boolean; tempId?: string }>
  >(new Map());

  // Sync optimistic completions with tasks when they update (for background refresh)
  useEffect(() => {
    // Clear optimistic completions that match server state (background refresh completed)
    setOptimisticCompletions(prev => {
      const updated = new Map(prev);
      tasks.forEach(task => {
        task.completions.forEach(completion => {
          const key = `${task.id}_${completion.completion_date}`;
          if (updated.has(key)) {
            // Server state matches optimistic - clear optimistic state
            updated.delete(key);
          }
        });
      });
      return updated;
    });
  }, [tasks]);

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
      const key = `${taskId}_${date}`;
      const newCompleted = !isCompleted; // Toggle the completion state

      // Store original state for rollback - check if task was originally completed
      const originalTask = tasks.find(t => t.id === taskId);
      const originalCompletion = originalTask?.completions.find(c => c.completion_date === date);
      const originallyCompleted = !!originalCompletion;
      // Store whether there was an existing optimistic change
      const existingOptimistic = optimisticCompletions.get(key);

      // Optimistically update UI immediately
      setOptimisticCompletions(prev => {
        const updated = new Map(prev);
        if (newCompleted) {
          // Adding completion - create temp completion entry
          updated.set(key, { completed: true, tempId: `temp-${Date.now()}` });
        } else {
          // Removing completion
          updated.set(key, { completed: false });
        }
        return updated;
      });

      try {
        const endpoint = newCompleted
          ? `/api/cleaning-tasks/${taskId}/complete`
          : `/api/cleaning-tasks/${taskId}/uncomplete`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completion_date: date }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || data.message || 'Failed to update task');
        }

        showSuccess(newCompleted ? 'Task marked as complete' : 'Task marked as incomplete');
        // Background refresh - optimistic state will be cleared when tasks update
        onTaskUpdate?.();
      } catch (error) {
        // Error - revert optimistic update
        setOptimisticCompletions(prev => {
          const updated = new Map(prev);
          // Remove our optimistic change
          updated.delete(key);
          // Restore any previous optimistic change if there was one
          if (existingOptimistic) {
            updated.set(key, existingOptimistic);
          }
          return updated;
        });
        logger.error('Error toggling task completion:', error);
        showError(
          newCompleted ? 'Failed to mark task as complete' : 'Failed to mark task as incomplete',
        );
      }
    },
    [showSuccess, showError, onTaskUpdate, optimisticCompletions, tasks],
  );

  // Merge tasks with optimistic completions
  const optimisticTasks = useMemo(() => {
    return tasks.map(task => {
      const optimisticCompletionsForTask: typeof task.completions = [];
      dates.forEach(date => {
        const key = `${task.id}_${date}`;
        const optimistic = optimisticCompletions.get(key);
        if (optimistic) {
          if (optimistic.completed) {
            // Add optimistic completion
            optimisticCompletionsForTask.push({
              id: optimistic.tempId || `temp-${task.id}-${date}`,
              task_id: task.id,
              completion_date: date,
              completed_at: new Date().toISOString(),
            });
          }
          // If optimistic.completed is false, don't include completion (it's removed)
        } else {
          // Use original completion if no optimistic change
          const original = task.completions.find(c => c.completion_date === date);
          if (original) {
            optimisticCompletionsForTask.push(original);
          }
        }
      });
      return {
        ...task,
        completions: optimisticCompletionsForTask,
      };
    });
  }, [tasks, optimisticCompletions, dates]);

  if (tasks.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
          <Icon
            icon={ClipboardCheck}
            size="xl"
            className="text-[var(--primary)]"
            aria-hidden={true}
          />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-[var(--button-active-text)]">
          No cleaning tasks yet
        </h3>
        <p className="mb-6 text-[var(--foreground-muted)]">
          Create your first cleaning task to start tracking your cleaning schedule.
        </p>
        <div className="tablet:flex-row tablet:justify-center flex flex-col gap-3">
          <button
            onClick={() => onCreateTask?.()}
            className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
          >
            Create Your First Task
          </button>
          <p className="flex items-center justify-center text-sm text-[var(--foreground-subtle)]">
            Press <kbd className="mx-1 rounded bg-[var(--muted)] px-2 py-1 text-xs">N</kbd> for
            quick create
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
      {/* Sticky header with day headers */}
      <div className="sticky top-0 z-20 flex border-b border-[var(--border)] bg-[var(--surface)]">
        {/* Empty cell for task name column */}
        <div className="desktop:min-w-[280px] desktop:max-w-[280px] sticky left-0 z-30 max-w-[220px] min-w-[220px] border-r border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <div className="text-sm font-medium text-[var(--foreground-muted)]">Task</div>
          {dates.length > 0 && (
            <div className="mt-1 text-xs text-[var(--foreground-subtle)]">
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
        {optimisticTasks.map(task => (
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
