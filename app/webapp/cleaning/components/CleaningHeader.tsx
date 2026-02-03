'use client';

import { Button } from '@/components/ui/Button';
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
          <Button
            onClick={onCreateTask}
            variant="primary"
            size="sm"
            title="Create new task (N)"
            className="shadow-lg hover:shadow-xl"
          >
            <Icon icon={Plus} size="sm" className="mr-1.5" aria-hidden={true} />
            <span className="tablet:inline hidden">New Task</span>
            <span className="tablet:hidden">New</span>
          </Button>
        ) : (
          <Button
            onClick={onAddArea}
            variant="primary"
            size="sm"
            title="Add new cleaning area (A)"
            className="shadow-lg hover:shadow-xl"
          >
            <Icon icon={Plus} size="sm" className="mr-1.5" aria-hidden={true} />
            Add Area
          </Button>
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
