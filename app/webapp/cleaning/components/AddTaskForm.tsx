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

export function AddTaskForm({ newTask, areas, onTaskChange, onSubmit, onCancel }: AddTaskFormProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{t('cleaning.addNewTask', 'Add New Cleaning Task')}</h3>
        <button onClick={onCancel} className="p-2 text-gray-400 transition-colors hover:text-white">
          <Icon icon={X} size="lg" aria-hidden={true} />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('cleaning.selectArea', 'Select Area')}
          </label>
          <select
            value={newTask.area_id}
            onChange={e => onTaskChange({ ...newTask, area_id: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            required
          >
            <option value="">{t('cleaning.selectAreaPlaceholder', 'Choose a cleaning area')}</option>
            {areas.map(area => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('cleaning.assignedDate', 'Assigned Date')}
          </label>
          <input
            type="date"
            value={newTask.assigned_date}
            onChange={e => onTaskChange({ ...newTask, assigned_date: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">{t('cleaning.notes', 'Notes')}</label>
          <textarea
            value={newTask.notes}
            onChange={e => onTaskChange({ ...newTask, notes: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="Additional notes or instructions"
            rows={3}
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
          >
            {t('cleaning.save', 'Save Task')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
          >
            {t('cleaning.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}

