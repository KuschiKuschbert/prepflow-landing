'use client';
import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';

interface CleaningArea {
  name: string;
  description: string;
  frequency_days: number;
}

interface AddAreaFormProps {
  newArea: CleaningArea;
  onAreaChange: (area: CleaningArea) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function AddAreaForm({ newArea, onAreaChange, onSubmit, onCancel }: AddAreaFormProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{t('cleaning.addNewArea', 'Add New Cleaning Area')}</h3>
        <button onClick={onCancel} className="p-2 text-gray-400 transition-colors hover:text-white">
          <Icon icon={X} size="lg" aria-hidden={true} />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">{t('cleaning.areaName', 'Area Name')}</label>
          <input
            type="text"
            value={newArea.name}
            onChange={e => onAreaChange({ ...newArea, name: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., Kitchen Floors, Prep Tables"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('cleaning.description', 'Description')}
          </label>
          <textarea
            value={newArea.description}
            onChange={e => onAreaChange({ ...newArea, description: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="Describe what needs to be cleaned"
            rows={3}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('cleaning.frequency', 'Cleaning Frequency (days)')}
          </label>
          <input
            type="number"
            value={newArea.frequency_days}
            onChange={e => onAreaChange({ ...newArea, frequency_days: parseInt(e.target.value) || 7 })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            min="1"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
          >
            {t('cleaning.save', 'Save Area')}
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

