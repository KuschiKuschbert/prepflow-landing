'use client';
import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';

interface CleaningArea {
  id: number;
  name: string;
}

interface NewTask {
  area_id: string;
  assigned_date: string;
  notes: string;
}

interface AddTaskFormProps {
  newTask: NewTask;
  areas: CleaningArea[];
  onTaskChange: (task: NewTask) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function AddTaskForm({
  newTask,
  areas,
  onTaskChange,
  onSubmit,
  onCancel,
}: AddTaskFormProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          {t('cleaning.addNewTask', 'Add New Cleaning Task')}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <Icon icon={X} size="lg" aria-hidden={true} />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('cleaning.selectArea', 'Select Area')}
          </label>
          <select
            value={newTask.area_id}
            onChange={e => onTaskChange({ ...newTask, area_id: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            <option value="">
              {t('cleaning.selectAreaPlaceholder', 'Choose a cleaning area')}
            </option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('cleaning.assignedDate', 'Assigned Date')}
          </label>
          <input
            type="date"
            value={newTask.assigned_date}
            onChange={e => onTaskChange({ ...newTask, assigned_date: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('cleaning.notes', 'Notes')}
          </label>
          <textarea
            value={newTask.notes}
            onChange={e => onTaskChange({ ...newTask, notes: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Additional notes or instructions"
            rows={3}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-text)] transition-all duration-200 hover:shadow-xl"
          >
            {t('cleaning.save', 'Save Task')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-[var(--muted)] px-6 py-3 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]"
          >
            {t('cleaning.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
