'use client';

import { Icon } from '@/components/ui/Icon';
import { ClipboardCheck, Plus } from 'lucide-react';
import { PageHeader } from '../../components/static/PageHeader';

interface CleaningHeaderProps {
  activeTab: 'grid' | 'areas';
  onCreateTask: () => void;
  onAddArea: () => void;
}

export function CleaningHeader({ activeTab, onCreateTask, onAddArea }: CleaningHeaderProps) {
  return (
    <PageHeader
      title="Cleaning Roster"
      subtitle="Manage cleaning areas and track task completion with a 14-day calendar grid"
      icon={ClipboardCheck}
      actions={
        activeTab === 'grid' ? (
          <button
            onClick={onCreateTask}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-lg"
            title="Create new task (N)"
          >
            <Icon icon={Plus} size="sm" aria-hidden={true} />
            <span className="tablet:inline hidden">New Task</span>
            <span className="tablet:hidden">New</span>
          </button>
        ) : (
          <button
            onClick={onAddArea}
            className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
            title="Add new cleaning area (A)"
          >
            <Icon icon={Plus} size="sm" className="mr-2 inline" aria-hidden={true} />
            Add Area
          </button>
        )
      }
    >
      <div className="mt-2 flex items-center gap-4 text-xs text-[var(--foreground-subtle)]">
        <span>
          Press <kbd className="rounded bg-[var(--muted)] px-2 py-1">N</kbd> to create task
        </span>
        <span>•</span>
        <span>
          Press <kbd className="rounded bg-[var(--muted)] px-2 py-1">G</kbd> for grid,{' '}
          <kbd className="rounded bg-[var(--muted)] px-2 py-1">M</kbd> for areas
        </span>
      </div>
    </PageHeader>
  );
}
