'use client';

import { Icon } from '@/components/ui/Icon';
import { MapPin, Plus } from 'lucide-react';
import type { CleaningArea } from '../hooks/useCleaningAreas/types';
import { AreaCard } from './AreaCard';

interface CleaningAreaListProps {
  areas: CleaningArea[];
  onAddTask: (areaId: string) => void;
  onViewTasks: (areaId: string) => void;
  onDelete: (id: string) => void;
  onAddArea: () => void;
}

export function CleaningAreaList({
  areas,
  onAddTask,
  onViewTasks,
  onDelete,
  onAddArea,
}: CleaningAreaListProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">Manage Cleaning Areas</h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Organize your cleaning tasks by area. Click an area to add tasks.
        </p>
      </div>

      {areas.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20">
              <Icon icon={MapPin} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-[var(--foreground)]">
            No cleaning areas yet
          </h3>
          <p className="mb-6 text-[var(--foreground-muted)]">
            Create your first cleaning area to organize your cleaning tasks.
          </p>
          <button
            onClick={onAddArea}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
          >
            <Icon icon={Plus} size="sm" aria-hidden={true} />
            Create Your First Area
          </button>
        </div>
      ) : (
        <div className="adaptive-grid">
          {areas.map(area => (
            <AreaCard
              key={area.id}
              area={area}
              onAddTask={onAddTask}
              onViewTasks={onViewTasks}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
