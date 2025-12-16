'use client';

import React, { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { CheckCircle2, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';
import { getTaskStatusForDate } from '@/lib/cleaning/completion-logic';

interface CleaningStatsProps {
  tasks: TaskWithCompletions[];
  dates: string[];
}

/**
 * Cleaning Stats Component
 * Shows quick statistics about cleaning task completion
 */
export function CleaningStats({ tasks, dates }: CleaningStatsProps) {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    let totalTasks = 0;
    let completedTasks = 0;
    let overdueTasks = 0;
    let upcomingTasks = 0;

    tasks.forEach(task => {
      dates.forEach(date => {
        const status = getTaskStatusForDate(task, date);
        if (status.shouldAppear) {
          totalTasks++;
          if (status.isCompleted) {
            completedTasks++;
          } else if (status.isOverdue) {
            overdueTasks++;
          } else {
            const taskDate = new Date(date);
            taskDate.setHours(0, 0, 0, 0);
            if (taskDate > today) {
              upcomingTasks++;
            }
          }
        }
      });
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      upcomingTasks,
      completionRate,
    };
  }, [tasks, dates]);

  if (stats.totalTasks === 0) {
    return null;
  }

  return (
    <div className="desktop:grid-cols-4 grid grid-cols-2 gap-4">
      {/* Completion Rate */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Completion Rate</p>
            <p className="text-2xl font-bold text-[var(--button-active-text)]">{stats.completionRate}%</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
            <Icon icon={TrendingUp} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs text-[var(--foreground-subtle)]">
            {stats.completedTasks} of {stats.totalTasks} tasks
          </p>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Completed</p>
            <p className="text-2xl font-bold text-[var(--color-success)]">{stats.completedTasks}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400/20 to-green-400/10">
            <Icon icon={CheckCircle2} size="sm" className="text-[var(--color-success)]" aria-hidden={true} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs text-[var(--foreground-subtle)]">Tasks done</p>
        </div>
      </div>

      {/* Overdue Tasks */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Overdue</p>
            <p className="text-2xl font-bold text-[var(--color-error)]">{stats.overdueTasks}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-400/20 to-red-400/10">
            <Icon icon={AlertTriangle} size="sm" className="text-[var(--color-error)]" aria-hidden={true} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs text-[var(--foreground-subtle)]">Need attention</p>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Upcoming</p>
            <p className="text-2xl font-bold text-[var(--color-info)]">{stats.upcomingTasks}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-400/10">
            <Icon icon={Calendar} size="sm" className="text-[var(--color-info)]" aria-hidden={true} />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs text-[var(--foreground-subtle)]">Future tasks</p>
        </div>
      </div>
    </div>
  );
}
