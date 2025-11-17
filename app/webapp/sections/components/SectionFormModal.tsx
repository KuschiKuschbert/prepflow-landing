'use client';

import { useTranslation } from '@/lib/useTranslation';
import { useAutosave } from '@/hooks/useAutosave';
import { AutosaveStatus } from '@/components/ui/AutosaveStatus';

interface KitchenSection {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
  menu_dishes: any[];
}

interface FormData {
  name: string;
  description: string;
  color: string;
}

interface SectionFormModalProps {
  show: boolean;
  editingSection: KitchenSection | null;
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function SectionFormModal({
  show,
  editingSection,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: SectionFormModalProps) {
  const { t } = useTranslation();

  // Autosave integration
  const entityId = editingSection?.id || 'new';
  const canAutosave = entityId !== 'new' || Boolean(formData.name);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'dish_sections',
    entityId: entityId,
    data: formData,
    enabled: canAutosave && show,
  });

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {editingSection
              ? t('dishSections.editSection', 'Edit Section')
              : t('dishSections.addSection', 'Add Section')}
          </h2>
          <div className="flex items-center gap-3">
            <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 transition-colors hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('dishSections.sectionName', 'Section Name')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., Hot Kitchen, Cold Kitchen, Pastry"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('dishSections.description', 'Description')}
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              rows={3}
              placeholder="Optional description of this section"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('dishSections.color', 'Color')}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="h-12 w-12 cursor-pointer rounded-xl border border-[#2a2a2a]"
              />
              <input
                type="text"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="flex-1 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                placeholder="#29E7CD"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-3 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
            >
              {t('dishSections.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
            >
              {editingSection
                ? t('dishSections.update', 'Update')
                : t('dishSections.create', 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
