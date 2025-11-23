'use client';

import React, { useMemo, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { CheckCircle2, AlertTriangle, Circle } from 'lucide-react';
import { getTaskStatusForDate } from '@/lib/cleaning/completion-logic';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

/**
 * Format frequency type for display
 */
function formatFrequencyType(frequencyType: string): string {
  // Day of week frequencies
  const dayMap: Record<string, string> = {
    monday: 'Every Monday',
    tuesday: 'Every Tuesday',
    wednesday: 'Every Wednesday',
    thursday: 'Every Thursday',
    friday: 'Every Friday',
    saturday: 'Every Saturday',
    sunday: 'Every Sunday',
  };

  if (dayMap[frequencyType]) {
    return dayMap[frequencyType];
  }

  // Custom interval (every-X-days)
  if (frequencyType.startsWith('every-') && frequencyType.endsWith('-days')) {
    const daysMatch = frequencyType.match(/every-(\d+)-days/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      return `Every ${days} ${days === 1 ? 'day' : 'days'}`;
    }
  }

  // Standard frequencies
  const standardMap: Record<string, string> = {
    daily: 'Daily',
    'bi-daily': 'Bi-daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    '3-monthly': '3-Monthly',
  };

  return (
    standardMap[frequencyType] || frequencyType.charAt(0).toUpperCase() + frequencyType.slice(1)
  );
}

interface TaskRowProps {
  task: TaskWithCompletions;
  dates: string[];
  onToggleCompletion: (taskId: string, date: string, isCompleted: boolean) => void;
}

/**
 * Memoized Task Cell Component
 * Prevents unnecessary re-renders of individual cells
 */
const TaskCell = React.memo(function TaskCell({
  date,
  status,
  onToggleCompletion,
  taskId,
}: {
  date: string;
  status: { shouldAppear: boolean; isCompleted: boolean; isOverdue: boolean };
  onToggleCompletion: (taskId: string, date: string, isCompleted: boolean) => void;
  taskId: string;
}) {
  const handleClick = useCallback(() => {
    if (status.shouldAppear) {
      onToggleCompletion(taskId, date, status.isCompleted);
    }
  }, [status.shouldAppear, status.isCompleted, onToggleCompletion, taskId, date]);

  const isClickable = status.shouldAppear;

  return (
    <div
      onClick={handleClick}
      className={`group relative z-0 flex flex-1 cursor-pointer items-center justify-center border-r border-[#2a2a2a] px-2 py-3 transition-all duration-200 ${
        isClickable
          ? 'hover:bg-[#2a2a2a]/40 active:bg-[#2a2a2a]/60'
          : 'cursor-not-allowed opacity-30'
      }`}
      title={
        isClickable
          ? status.isCompleted
            ? 'Click to mark incomplete'
            : status.isOverdue
              ? 'Overdue - Click to mark complete'
              : 'Click to mark complete'
          : 'Task does not appear on this day'
      }
    >
      {status.shouldAppear && (
        <>
          {status.isCompleted ? (
            <Icon icon={CheckCircle2} size="md" className="text-green-400" aria-label="Completed" />
          ) : status.isOverdue ? (
            <Icon icon={AlertTriangle} size="md" className="text-red-400" aria-label="Overdue" />
          ) : (
            <Icon icon={Circle} size="md" className="text-gray-500" aria-label="Pending" />
          )}
        </>
      )}
    </div>
  );
});

/**
 * Task Row Component
 * Displays a task name on the left and grid cells for each day
 * Optimized with pre-computed statuses and memoization
 */
function TaskRow({ task, dates, onToggleCompletion }: TaskRowProps) {
  // Pre-compute all statuses for this task and all dates (major performance optimization)
  const dateStatuses = useMemo(() => {
    const statusMap = new Map<
      string,
      { shouldAppear: boolean; isCompleted: boolean; isOverdue: boolean }
    >();
    dates.forEach(date => {
      statusMap.set(date, getTaskStatusForDate(task, date));
    });
    return statusMap;
  }, [task, dates]);

  // Memoize task metadata to prevent unnecessary recalculations
  const taskMetadata = useMemo(() => {
    return {
      areaName: task.cleaning_areas
        ? (task.cleaning_areas as any)?.area_name || (task.cleaning_areas as any)?.name || 'Area'
        : null,
      hasEquipment: !!(task.equipment_id && task.temperature_equipment),
      hasSection: !!(task.section_id && task.kitchen_sections),
      taskName: task.task_name || (task.cleaning_areas as any)?.area_name || 'Unnamed Task',
      frequencyType: task.frequency_type ? formatFrequencyType(task.frequency_type) : null,
    };
  }, [task]);

  return (
    <div className="flex border-b border-[#2a2a2a] transition-colors hover:bg-[#2a2a2a]/20">
      {/* Task name column - sticky */}
      <div className="desktop:min-w-[280px] desktop:max-w-[280px] sticky left-0 z-10 max-w-[220px] min-w-[220px] border-r border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3">
        <div className="flex flex-col gap-2">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            {taskMetadata.areaName && (
              <div
                className="flex h-6 items-center justify-center rounded-full bg-[#29E7CD]/10 px-2 text-xs text-[#29E7CD]"
                title="Area"
              >
                {taskMetadata.areaName}
              </div>
            )}
            {taskMetadata.hasEquipment && (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs text-blue-400"
                title="Equipment"
              >
                E
              </div>
            )}
            {taskMetadata.hasSection && (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D925C7]/10 text-xs text-[#D925C7]"
                title="Section"
              >
                S
              </div>
            )}
          </div>
          {/* Task name - now wraps */}
          <div className="min-w-0">
            <div className="leading-tight font-medium break-words text-white">
              {taskMetadata.taskName}
            </div>
            {taskMetadata.frequencyType && (
              <div className="mt-1 text-xs text-gray-400">{taskMetadata.frequencyType}</div>
            )}
          </div>
        </div>
      </div>

      {/* Grid cells for each day */}
      <div className="flex flex-1">
        {dates.map(date => {
          const status = dateStatuses.get(date)!;
          return (
            <TaskCell
              key={date}
              date={date}
              status={status}
              onToggleCompletion={onToggleCompletion}
              taskId={task.id}
            />
          );
        })}
      </div>
    </div>
  );
}

export const MemoizedTaskRow = React.memo(TaskRow);
