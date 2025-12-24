'use client';

import OptimizedImage from '@/components/OptimizedImage';
import { useTranslation } from '@/lib/useTranslation';
import { CheckCircle, AlertTriangle, ClipboardCheck, Camera, Edit } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface CleaningTask {
  id: number;
  area_id: number;
  assigned_date: string;
  completed_date: string | null;
  status: 'pending' | 'completed' | 'overdue';
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  cleaning_areas: {
    id: number;
    name: string;
    description: string;
    frequency_days: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface TaskCardProps {
  task: CleaningTask;
  onComplete: (taskId: number) => void;
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return (
        <Icon
          icon={CheckCircle}
          size="lg"
          className="text-[var(--color-success)]"
          aria-hidden={true}
        />
      );
    case 'overdue':
      return (
        <Icon
          icon={AlertTriangle}
          size="lg"
          className="text-[var(--color-error)]"
          aria-hidden={true}
        />
      );
    default:
      return (
        <Icon
          icon={ClipboardCheck}
          size="lg"
          className="text-[var(--color-warning)]"
          aria-hidden={true}
        />
      );
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'text-[var(--color-success)] bg-[var(--color-success)]/10 border-[var(--color-success)]/20';
    case 'overdue':
      return 'text-[var(--color-error)] bg-[var(--color-error)]/10 border-[var(--color-error)]/20';
    default:
      return 'text-[var(--color-warning)] bg-[var(--color-warning)]/10 border-[var(--color-warning)]/20';
  }
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg transition-all duration-200 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
            {getStatusIcon(task.status)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[var(--foreground)]">
              {task.cleaning_areas.name}
            </h3>
            <p className="text-[var(--foreground-muted)]">
              {new Date(task.assigned_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(task.status)}`}
        >
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </div>

      {task.notes && <p className="mb-4 text-[var(--foreground-secondary)]">{task.notes}</p>}

      {task.completed_date && (
        <p className="mb-4 flex items-center gap-2 text-sm text-[var(--color-success)]">
          <Icon icon={CheckCircle} size="sm" aria-hidden={true} />
          {t('cleaning.completedOn', 'Completed on')}{' '}
          {new Date(task.completed_date).toLocaleString()}
        </p>
      )}

      {task.photo_url && (
        <div className="mb-4">
          <OptimizedImage
            src={task.photo_url}
            alt="Cleaning verification"
            width={128}
            height={128}
            className="h-32 w-32 rounded-2xl border border-[var(--border)] object-cover"
          />
        </div>
      )}

      <div className="flex space-x-4">
        {task.status === 'pending' && (
          <button
            onClick={() => onComplete(task.id)}
            className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-lg"
          >
            <Icon icon={CheckCircle} size="sm" aria-hidden={true} />
            {t('cleaning.markComplete', 'Mark Complete')}
          </button>
        )}
        <button className="flex items-center gap-2 rounded-xl bg-[var(--muted)] px-4 py-2 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]">
          <Icon icon={Camera} size="sm" aria-hidden={true} />
          {t('cleaning.addPhoto', 'Add Photo')}
        </button>
        <button className="flex items-center gap-2 rounded-xl bg-[var(--muted)] px-4 py-2 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]">
          <Icon icon={Edit} size="sm" aria-hidden={true} />
          {t('cleaning.edit', 'Edit')}
        </button>
      </div>
    </div>
  );
}
